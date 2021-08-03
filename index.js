const mqtt = require('mqtt');
const { json } = require('express');
const sendPushNotification = require('./pushNotifications');

const client = mqtt.connect('mqtt://io.adafruit.com', {
    username: '',
    password: '',
});

const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());

const firebase = require('./firebase/firebaseConnect')

// =================================== Web API ==================================================
app.get('/', (req, res) => {
    res.send('This is server of Fan Control Mobile App')
});

app.post('/api/control/', (req, res) => {
    // const device = req.params.device
    console.log(req.body)
    client.publish(req.body.topic, JSON.stringify({
        "id": "1",
        "name": "LED",
        "data": req.body.isOn ? '1' : '0',
        "unit": ""
    }))
    res.status(200).json(req.body);
})

app.post('/api/grantRoom/', (req, res) => {
    // const device = req.params.device
    console.log(req.body)
    sendPushNotification(req.body.token, 'Admin accepted your request to control room ' + req.body.room)
    res.status(200).json(req.body);
})

app.post('/api/denyRoom/', (req, res) => {
    // const device = req.params.device
    console.log(req.body)
    sendPushNotification(req.body.token, 'Admin denied your request to control room ' + req.body.room)
    res.status(200).json(req.body);
})

app.post('/api/subscribe/', (req, res) => {
    // const device = req.params.device
    client.subscribe(req.body.feed)
    console.log('Subscribe topic ' + req.body.feed)
    res.status(200).json(req.body);
})

app.post('/api/revoke/', (req, res) => {
    // const device = req.params.device
    console.log(req.body)
    sendPushNotification(req.body.token, 'You have been revoked control of room ' + req.body.room)
    res.status(200).json(req.body);
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on ${port}...`));
// ================================================================================================


// =================================== Firebase ================================================
let adminToken
firebase.database().ref('users/nEjXfLjaY6VwR0oxqUnGHtUbeEZ2').child('tokenPushNotifications').on('value', snapshot => {
    if (snapshot.val())
        adminToken = snapshot.val()
})

let listUsers = []
firebase.database().ref('users').on('value', snapshot => {
    if (snapshot.val())
        listUsers = snapshot.val()
})


let listRooms = []
firebase.database().ref('rooms').on('value', snapshot => {
    if (snapshot.val()) {
        listRooms = snapshot.val()
    }
})

let listFans = []
firebase.database().ref('fans').on('value', snapshot => {
    if (snapshot.val()) {
        listFans = snapshot.val()
    }
})

let listAirCons = []
firebase.database().ref('airCons').on('value', snapshot => {
    if (snapshot.val()) {
        listAirCons = snapshot.val()
    }
})

// let adaAccount = null
// let adaKey = null
// firebase.database().ref('adaAccount').on('value', snapshot => {
//     if (snapshot.val()) {
//         adaAccount = snapshot.val().account
//         adaKey = snapshot.val().key
//     }
// })

firebase.database().ref('pendingRequests').on('child_added', snapshot => {
    if (snapshot.val()) {
        console.log(snapshot.val())
        let message = snapshot.val().user + ' request to control room ' + snapshot.val().requestRoom
        sendPushNotification(adminToken, message)
    }
})
// ================================================================================================



// =================================== MQTT =======================================================
client.on('connect', () => {
    console.log('Adafruit server connected ')

    // subscribe all sensor feed 
    setTimeout(function() {
        Object.values(listRooms).forEach(room => {
            client.subscribe(room.sensorFeed)
            console.log('Subscribe feed ' + room.sensorFeed)
        })
      }, 2000);
})



client.on('message', function (topic, message, packet) {
    let data = JSON.parse(message.toString())
    console.log('Receive data from topic: ' + topic.toString())
    console.log(data)

    let patternTopicName = /bk-.*/
    let topicName = topic.match(patternTopicName)[0]

    if (topicName === 'bk-iot-temp-humid') {
        receiveDataFromSensor(data.data, topic.toString())
    }
})

const receiveDataFromSensor = (data, feed) => {
    let patternTemp = /[0-9]*/;
    let patternHumid = /-[0-9]*/
    let temperature = data.match(patternTemp)[0];
    let humidity = data.match(patternHumid)[0].substr(1, 2);
    Object.values(listRooms).forEach(room => {
        let currentHour = new Date().getHours()
        if (room.sensorFeed === feed && currentHour <= 21) {
            // ============================= Update temp and humid =====================
            firebase.database().ref('rooms/' + room.name).child('temperature').set(temperature)
            firebase.database().ref('rooms/' + room.name).child('humidity').set(humidity)
            // ================= Check if too hot then turn on fan ====================
            if ((temperature >= room.thresholdTemp || humidity >= room.thresholdHumid) && (room.mode == 'Auto')) {
                if (room.listFans)
                    room.listFans.forEach(fanId => {
                        firebase.database().ref('fans/' + fanId).child('isOn').set(true)
                        firebase.database().ref('fans/' + fanId).once('value', snapshot => {
                            if (snapshot.val()) {
                                let topic = snapshot.val().feed
                                let data = {
                                    "id": "1",
                                    "name": "LED",
                                    "data": '1',
                                    "unit": ""
                                }
                                client.publish(topic, JSON.stringify(data))
                                console.log('Send to topic ' + topic + ' data: ' + JSON.stringify(data))
                            }
                        })
                    })
                if (room.listAirCon)
                    room.listAirCon.forEach(airConId => {
                        firebase.database().ref('airCons/' + airConId).child('isOn').set(true)
                        firebase.database().ref('airCons/' + airConId).once('value', snapshot => {
                            if (snapshot.val()) {
                                let topic = snapshot.val().feed
                                let data = {
                                    "id": "1",
                                    "name": "LED",
                                    "data": '1',
                                    "unit": ""
                                }
                                client.publish(topic, JSON.stringify(data))
                                console.log('Send to topic ' + topic + ' data: ' + JSON.stringify(data))
                            }
                        })
                    })
            }
        }
    })
}

// =============================== Timer ============================================================
function AutoTurnOfAllDevices() {
    let currentHour = new Date().getHours()
    if (currentHour >= 21 || currentHour <= 6) {
        Object.keys(listFans).forEach(fanId => {
            firebase.database().ref('fans/' + fanId).child('isOn').set(false)
        })
        Object.keys(listAirCons).forEach(airConId => {
            firebase.database().ref('airCons/' + airConId).child('isOn').set(false)
        })
    }
}

// setInterval(AutoTurnOfAllDevices, 60000);









