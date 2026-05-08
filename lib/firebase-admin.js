import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.MOBILE_FIREBASE_PROJECT_ID,
            clientEmail: process.env.MOBILE_FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.MOBILE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}
export { admin };
