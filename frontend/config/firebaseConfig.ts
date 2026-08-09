import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore — getReactNativePersistence lives in Firebase's React Native build,
// which Metro resolves correctly at runtime but plain `tsc` module resolution can't see.
import { initializeAuth, getReactNativePersistence, getAuth, type Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey ?? process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain ?? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId ?? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket ?? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseSenderId ?? process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
    appId: Constants.expoConfig?.extra?.firebaseAppId ?? process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Same Firebase project ("gigo-company-ltd") as the other GIGO apps that share auth,
// per the shared-infrastructure notes — confirm project id before first real run.
// initializeAuth throws if called twice (e.g. on Fast Refresh), so fall back to getAuth().
let auth: Auth;
try {
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
    auth = getAuth(app);
}
export { auth };

export default app;
