const messaging = firebase.messaging();
messaging.requestPermission()
    .then(function() {
        console.log('Permissions granted');

        return messaging.getToken();
    })
    .then(function(token) {
        console.log(token);
    })
    .catch(function() {
        console.log('Permissions denied ');
    });

messaging.onMessage(function(payload) {
    const msg = JSON.stringify(payload);

    alert(msg);
    console.log('cloud message: ' + msg);
});


var provider = new firebase.auth.GoogleAuthProvider();

const btnLogin = document.getElementById('btnLogin');

var user;

btnLogin.addEventListener('click', e => {
    if (user) {
        firebase.auth().signOut()
            .then(function() {
                user = null;
                console.log('successful sign-out');
            })
            .catch(function() {

            });
    } else {
        firebase.auth().signInWithPopup(provider)
            .then(function(result) {
                user = result.user;

                console.log('our logged in user: ' + JSON.stringify(user));
            })
            .catch(function(err) {
                var errCode = err.code;
                var errMessage = err.message;

                console.log('Error: ' + errCode + '--' + errMessage);
            });
    }
});