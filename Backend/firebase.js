import admin from "firebase-admin";
import dotenv from "dotenv"
dotenv.config()
let serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: serviceAccount.storageBucket || serviceAccount.project_id + ".firebasestorage.app"
});


const bucket = admin.storage().bucket();

export { admin, bucket };