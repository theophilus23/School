# SchoolHub Firebase Starter (Spark-first, local emulators)

This is a backend setup scaffold for the SchoolHub prototype. It does **not** silently convert the current localStorage prototype into a live app. First start and verify the local Firebase emulators, then integrate `web/firebase.js` and `web/schoolhub-data.js` into the app's real source.

## Why this starts locally

- Local testing uses Firebase Authentication + Cloud Firestore emulators.
- The project alias is `demo-schoolhub-local`; Firebase CLI treats `demo-*` projects as emulator-only, reducing the risk of writing to a real project.
- This starter intentionally does not deploy Cloud Functions or Cloud Storage. Their cloud deployment can require Blaze billing; do not upgrade billing just to complete this local setup.
- Do not enter real student information or real passwords in emulator/demo testing.

## 1. Install prerequisites (Windows)

Install:
- Node.js LTS: https://nodejs.org/
- Java JDK 21 (or a supported current JDK): https://adoptium.net/

Close and reopen Command Prompt, then verify:

```bat
node --version
npm --version
java -version
```

Install Firebase CLI:

```bat
npm install -g firebase-tools
firebase --version
```

## 2. Run the local backend

Extract this ZIP to `C:\SchoolHub-Backend`. Open Command Prompt:

```bat
cd /d C:\SchoolHub-Backend
firebase emulators:start --project demo-schoolhub-local
```

On first run, Firebase downloads emulator components. Keep this window open. Open:
- Emulator dashboard: http://127.0.0.1:4000
- Authentication emulator: http://127.0.0.1:9099
- Firestore emulator: http://127.0.0.1:8080

If Java/Node are installed but the CLI is not recognized, close and reopen Command Prompt. Do not use `firebase deploy` yet.

## 3. Open the web demo page

Open `web\firebase-smoke-test.html` in a browser. It connects to the local Auth and Firestore emulators using the demo project ID and creates a temporary test account, then writes/reads a test document. This is only a connection smoke test, not the full SchoolHub integration.

For the best local test, serve the folder from a local HTTP server rather than `file://`:
```bat
npx --yes http-server . -p 5500
```
Then open `http://127.0.0.1:5500/web/firebase-smoke-test.html`.

## 4. Connect the existing SchoolHub app

1. Back up your current source ZIP and extract it to a separate working folder.
2. Find the actual HTML entry point and JavaScript that currently reads/writes `localStorage`.
3. Copy `web/firebase-config.js` and `web/firebase.js` into the app's source folder.
4. In the app's entry HTML, load the app's own JavaScript as an ES module and import the Firebase functions from `firebase.js`. Do not paste a second Firebase initialization into multiple files.
5. Replace one localStorage feature at a time with Firestore calls, starting with authentication/profile, then classes/sections, homework, exams, messages and notifications.
6. Keep demo/local data separate from real production data. Never put admin credentials, service-account JSON, or server secrets in browser code.

The source currently available in this conversation appears to be a single `index.html` prototype bundled with a README, not a fully modular source tree. The smoke test is separate on purpose so it doesn't break the prototype. To integrate accurately, use the exact latest project ZIP/source folder you want to modify.

## 5. Firestore data model (starter)

- `users/{uid}` — role, schoolId, displayName, email (no password)
- `schools/{schoolId}` — school metadata
- `schools/{schoolId}/academicYears/{yearId}`
- `schools/{schoolId}/classes/{classId}`
- `schools/{schoolId}/sections/{sectionId}`
- `schools/{schoolId}/homework/{itemId}`
- `schools/{schoolId}/assignments/{itemId}`
- `schools/{schoolId}/exams/{itemId}`
- `schools/{schoolId}/messages/{itemId}`
- `schools/{schoolId}/notifications/{itemId}`
- `schools/{schoolId}/parentStudentLinks/{linkId}`

Use Firebase Authentication UIDs as identities. Never store plaintext passwords in Firestore. Parent/child links and role assignments must be created/approved by a trusted school admin; clients must not be able to grant themselves admin/teacher roles.

## 6. Admin bootstrap (local only)

The rules intentionally don't allow a new browser user to assign themselves `admin`. For local testing only:
1. Create a test email/password account through the smoke test page.
2. In Emulator UI → Firestore, create collection `users`, document ID equal to that user's UID.
3. Add fields:
   - `role` (string): `admin`
   - `schoolId` (string): `demo-school`
   - `displayName` (string): `SchoolHub Demo Admin`
   - `email` (string): the test account's email
4. Then run app tests. Do not copy this manual bootstrap approach to production without a trusted server/admin provisioning process.

## 7. Spark and later deployment

- Local emulator development does not deploy cloud resources.
- Firebase Hosting can host a static website on eligible Spark usage; hosting configuration is included as a starting point but is not deployed by these instructions.
- Cloud Functions deployment and Cloud Storage cloud usage may require a Blaze billing plan under current Firebase requirements. For now, use local emulators and do not deploy those products.
- Before deploying any real school data, finish role-based rules, test rules with both allowed and denied cases, set up backups, privacy notices, account recovery, and a safe admin provisioning flow.

## Files

- `firebase.json`: emulator + optional Hosting configuration
- `firestore.rules`: starter school-scoped access control rules
- `firestore.indexes.json`: initially empty indexes
- `web/firebase-config.js`: local emulator config; replace only for a real registered Firebase web app
- `web/firebase.js`: shared modular Firebase initialization
- `web/schoolhub-data.js`: starter Firestore access functions
- `web/firebase-smoke-test.html`: Auth + Firestore emulator smoke test
- `scripts/check-setup.bat`: checks basic tool installation
