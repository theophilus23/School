// Local emulator config for smoke testing.
// For a real web deployment, register a Web app in Firebase Console and replace
// this object with the config shown there. Firebase web config is not a password,
// but it must be paired with correct Firestore Security Rules.
export const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-schoolhub-local.firebaseapp.com",
  projectId: "demo-schoolhub-local",
  appId: "demo-app-id"
};
export const useEmulators = true;
