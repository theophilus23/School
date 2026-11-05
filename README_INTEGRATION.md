# SchoolHub Firebase Auth milestone (Spark/local emulator)

This package integrates Firebase Authentication and a required Firestore user profile gate into the existing SchoolHub HTML prototype.

## What is connected now
- Firebase Auth emulator sign-in and local test account creation.
- Reads `users/{uid}` from Firestore and requires a valid `role` and `schoolId` before revealing the existing app.
- Hides the demo role switcher and displays the authenticated profile role.
- Sign out returns to the sign-in gate.

## What is NOT migrated yet
The dashboard's accounts, homework, messages, exams, documents, settings and notification records still use the original browser `localStorage`. The login gate does not magically make those records cloud-backed. Do not enter real student or parent data yet. The next milestone will migrate one collection at a time and add tests for rules.

## Start locally on Windows
1. Keep Node.js LTS and Java installed. Extract this ZIP to `C:\SchoolHub-Firebase`.
2. Open Command Prompt:
   ```bat
   cd /d C:\SchoolHub-Firebase
   firebase emulators:start --project demo-schoolhub-local
   ```
3. Open a second Command Prompt:
   ```bat
   cd /d C:\SchoolHub-Firebase
   npx --yes http-server public -p 5500
   ```
4. Open `http://127.0.0.1:5500/index.html`.
5. In the app, enter a test email and password (minimum 6 characters), then choose **Create test account**. This creates an account only in the local Auth emulator.
6. Open `http://127.0.0.1:4000`, select Firestore, and create a document:
   - Collection: `users`
   - Document ID: the UID displayed by the app
   - Fields:
     - `role` — string — `admin`
     - `schoolId` — string — `greenfield-demo`
     - `name` — string — `SchoolHub Test Admin`
7. Return to the app and sign in with that test account. The gate should disappear and the existing prototype should appear. Click **Sign out** to verify the gate returns.

Create separate test accounts for teacher/student/parent and add a matching `users/{uid}` document for each. Only do this manually in the local emulator. Do not give users a public role-selection or profile-creation mechanism in production.

## Firebase config
`public/firebase-config.js` currently uses demo values and `useEmulators = true`. This is intentional for local-only testing. Do not deploy this config to Firebase Hosting and expect it to work as a production app. A later deployment step requires registering a Firebase Web app, replacing the config, changing emulator mode, reviewing production rules, and testing with a real project.

## Important rules warning
The `firestore.rules` file is a starting point, not a completed production security audit. The local-only `smokeTests` rule, if added to your copy, must be removed before any real deployment. Do not run `firebase deploy` yet. No billing upgrade is required for this local emulator milestone.
