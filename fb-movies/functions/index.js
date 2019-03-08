const functions = require('firebase-functions');
const { Translate } = require('@google-cloud/translate');

const translateClient = new Translate({
    projectId: 'starting-with-firebase-u-de28d'
});

exports.translateToRussian = functions.database
    .ref('/trollbox/{messageId}')
    .onWrite((event) => {
        // console.log(1, event.after.val());
        // console.log(2, event.after.ref.root);
        const translated = event.after.val().translated;

        if (!translated) {
            const origTxt = event.after.val().message;
            const root = event.after.ref.root;
            const translate_promise = translateClient.translate(origTxt, 'ru')
                .then((results) => {
                    console.log(4, results);
                    const translation = results[0];
                    return translation;
                })
                .catch((err) => {
                    console.log('Error:', err);
                });
            const completed_promise = translate_promise
                .then((ruText) => {
                    const postData = {
                        message: ruText,
                        translated: true,
                        troll: event.after.val().troll,
                        date: event.after.val().date
                    };

                    const newPostKey = root.child('/trollbox').push().key;
                    root.child('/trollbox/' + newPostKey).set(postData);

                    return ruText;
                });

            return completed_promise;
        }

        return null;
    });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
