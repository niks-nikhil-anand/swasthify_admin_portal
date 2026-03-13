import admin from "firebase-admin";

const initializeMobileAdmin = () => {
    const existingApp = admin.apps.find(app => app?.name === "mobileAuth");
    if (existingApp) return existingApp;

    try {
        const projectId = process.env.MOBILE_FIREBASE_PROJECT_ID;
        const clientEmail = process.env.MOBILE_FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.MOBILE_FIREBASE_PRIVATE_KEY;

        if (projectId && clientEmail && privateKey) {
            return admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: projectId,
                    clientEmail: clientEmail,
                    privateKey: privateKey.replace(/\\n/g, "\n"),
                }),
            }, "mobileAuth");
        }
    } catch (error) {
        console.error("Firebase Mobile Admin initialization error:", error);
    }
    return null;
};

const mobileAdminApp = initializeMobileAdmin();
const mobileAdmin = mobileAdminApp || admin;

export default mobileAdmin;
export { mobileAdminApp };
