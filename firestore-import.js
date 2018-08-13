const argv = require('minimist')(process.argv.slice(2));
const admin = require('firebase-admin');

if (!argv.key || !argv.data || !argv.db) {
    console.info('Usage: node firestore-import --data=path/to/data.json --key=path/to/service-key.json --db=url');
    return;
}

const serviceAccount = require(argv.key);
const data = require(argv.data);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: argv.db,
    timestampsInSnapshots: true,
});

admin.firestore().settings({ timestampsInSnapshots: true });

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];

    if (typeof nestedContent === 'object') {
        Object.keys(nestedContent).forEach(docTitle => {
            const data = nestedContent[docTitle];
            let docId = docTitle;
            if (data.uid) {
                docId = data.uid;
            }

            admin.firestore()
                .collection(key)
                .doc(docId)
                .set(nestedContent[docTitle])
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }
});