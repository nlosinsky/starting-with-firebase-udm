importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyCqVgISRmJjEFmmNwaQLwzSYznosJUGBb8",
    authDomain: "starting-with-firebase-u-de28d.firebaseapp.com",
    databaseURL: "https://starting-with-firebase-u-de28d.firebaseio.com",
    projectId: "starting-with-firebase-u-de28d",
    storageBucket: "starting-with-firebase-u-de28d.appspot.com",
    messagingSenderId: "1070875841539"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
