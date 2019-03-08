const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnEmailLogin = document.getElementById('btnEmailLogin');
const btnCreateAccount = document.getElementById('btnCreateAccount');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const trollbox = document.getElementById('trollbox');
const txtTrollMsg = document.getElementById('txtTrollMsg');
const btnNewTrollMsg = document.getElementById('btnNewTrollMsg');

const provider = new firebase.auth.GoogleAuthProvider();
var user = JSON.parse(localStorage.getItem('udm|user'));

if (user) {
    appInit();
}

function appInit() {
    const moviesRef = firebase.database().ref('/movies').orderByChild('episode_id');
    moviesRef.once('value', (snapshot) => {
        var movieData = '';

        snapshot.forEach((childSnapshot) => {
            movieData += `
                            <b>${childSnapshot.val().title}</b><br>
                            <b>Episode:</b> ${childSnapshot.val().episode_id}
                            <p>${childSnapshot.val().opening_crawl}</p>
                            <div>&nbsp;</div>
                        `;
        });

        document.getElementById('movies').innerHTML = movieData;
    });

    const charactersRef = firebase.database().ref('/characters');
    charactersRef.once('value', (snapshot) => {
        var charactersData = '';

        snapshot.forEach(childSnapshot => {
            charactersData += `
                <b>${childSnapshot.val().name}</b>
                <p>${JSON.stringify(childSnapshot)}</p>
                <div>&nbsp;</div>
            `;
        });

        document.getElementById('characters').innerHTML = charactersData;
    });

    const trollboxRef = firebase.database().ref('/trollbox');
    trollboxRef.on('child_added', (data) => {
        updateTrollbox(data.val().message, data.val().troll, data.val().date)
    });
}

function updateTrollbox(message, troll, date) {
    var trollData = `
        <p>
          <b>${troll}</b> said: ${message}
          <small${date}</small>
        </p>
    `;

    trollbox.innerHTML += trollData
}

//Google Login
btnLogin.addEventListener('click', e => {
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            user = result.user;
            const msg = 'Aloha, ' + user.displayName;
            document.getElementById('msg').innerHTML = msg;

            appInit();

            console.log('our logged in user: ' + JSON.stringify(user));
        })
        .catch((err) => {
            var errCode = err.code;
            var errMessage = err.message;

            console.log('Error: ' + errCode + '--' + errMessage);
        });
});

// Logout
btnLogout.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => {
            document.getElementById('msg').innerHTML = 'Bye-bye!';
            user = null;
            trollbox.innerHtml = '';
            console.log('successful sign-out');
            localStorage.removeItem('udm|user');
        })
        .catch()
});

//Create account
btnCreateAccount.addEventListener('click', () => {
    const email = txtEmail.value;
    const pass = txtPassword.value;


    firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then((user) => {
            const msg = 'Thanks for  signing up, ' + user.email + '! You can now login.';
            document.getElementById('msg').innerHTML = msg;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMesssage = error.message;

            console.log('Error: ' + errorCode + '--' + errorMesssage);
        })
});

// Email login
btnEmailLogin.addEventListener('click', () => {
    const email = txtEmail.value;
    const pass = txtPassword.value;

    firebase.auth().signInWithEmailAndPassword(email,  pass)
        .then(result => {
            user = result.user;
            document.getElementById('msg').innerHTML = 'Aloha, ' + user.email;
            txtEmail.value = '';
            txtPassword.value = '';

            localStorage.setItem('udm|user', JSON.stringify(user));

            appInit();
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMesssage = error.message;

            console.log('Error: ' + errorCode + '--' + errorMesssage);
        });
});


btnNewTrollMsg.addEventListener('click', () => {
    if (!user) {
        return;
    }

    const troll = user.email;
    const message = txtTrollMsg.value;
    const now = new Date();
    const postData = {
        troll,
        message,
        date: now.toISOString()
    };

    const newPostKey = firebase.database().ref('/trollbox').push().key;
    firebase.database().ref('trollbox/' + newPostKey).set(postData);
    txtTrollMsg.value = '';
});
