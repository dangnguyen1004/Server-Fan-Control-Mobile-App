export const getUpdates =  (setState) => {
  let client;
  try{
      var mqtt = require('mqtt');

    
    //   const options = {
    //       clientId:"mqttjs01",
    //       username:"duynguyen123",
    //       password:"aio_DskA020xUVMIa2BZUKrNYX8WCLAP",
    //       clean:true
    //   };

    const client = mqtt.connect('mqtts://io.adafruit.com', {
        username: 'duynguyen123',
        password: 'aio_DskA020xUVMIa2BZUKrNYX8WCLAP',
    });

      //client =  mqtt.connect("mqtt://broker.emqx.io");
      // "broker.emqx.io"
    //   const client = mqtt.connect("mqtt://io.adafruit.com", options);

        client.on('connect', () => {
            client.subscribe('duynguyen123/feeds/bbc-led')
            console.log('Subscribe feeds/bk-iotled')
            // client.subscribe('NguyenDang/feeds/bk-iottemp-humid')
            // console.log('Subscribe feeds/bk-iottemp-humid')
            // client.subscribe('NguyenDang/feeds/fan')
         })

      client.on('message', function(topic, message, packet) {
          console.log("message is " + message);
          setState(message);
          console.log("topic is " + topic);
      });


    //   client.on("connect", function() {
    //       console.log("connected");
    //   });



    //   var topic_list=["AmbInt/sensors/pot","AmbInt/sensors/temp","AmbInt/sensors/int"];
    //   client.subscribe(topic_list,{qos:1});
      // var topic_o = {"AmbInt/sensors/pot":1,"AmbInt/sensors/temp":1,"AmbInt/sensors/int":1};
      // client.subscribe(topic_o);
  } catch (e) {
      console.log(e);
      //client.end();
  } 
};



/*
var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://io.adafruit.com', {
    username: 'ADAFRUIT_IO_USERNAME',
    password: 'ADAFRUIT_UI_KEY'
});

var ssd1306topic = `${client.options.username}/f/ssd1306`;

client.on('connect', function() {
    console.log('connected');

    client.subscribe(ssd1306topic, function(err) {
        if(! err) {
            console.log('subscribed');

            client.publish(ssd1306topic, 'Hello from NodeJS');
        }
    });
});

client.on('message', function(topic, message) {
    console.log(message.toString());
});
*/