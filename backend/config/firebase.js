const admin = require("firebase-admin");

// firebase-admin v13+ dropped the admin.apps / admin.credential compat
// exports in favor of getApps() and a top-level cert() function.
if (!admin.getApps().length) {
  admin.initializeApp({
    credential: admin.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Render/most hosts store the private key with literal \n — convert back to real newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    }),
  });
}

module.exports = admin;
