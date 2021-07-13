const firebase = require('firebase')

var firebaseConfig = {
    apiKey: "AIzaSyD1LzPcLAWMZyK5ReigpdeERbsLZhU65yg",
    authDomain: "iotdatabase-1fe93.firebaseapp.com",
    databaseURL: "https://iotdatabase-1fe93-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iotdatabase-1fe93",
    storageBucket: "iotdatabase-1fe93.appspot.com",
    messagingSenderId: "719384932871",
    appId: "1:719384932871:web:b67f63b2b3f66627fd70a2",
    measurementId: "G-26G6P0HD7F"
};
// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);

module.exports = app;