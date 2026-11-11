# SchoolHub QA Automation Kit

This package includes the current SchoolHub **front-end prototype** plus Playwright browser tests. It creates synthetic QA student/parent records and checks the main user flows:

- Dashboard and section navigation
- Student account creation and parent linking
- Homework creation
- Exam scheduling
- Class document link creation
- Bulk notification recipient preview and local demo send
- School profile save

## Run on Windows

1. Install Node.js LTS from https://nodejs.org/ (if not already installed).
2. Extract this ZIP to a normal folder, for example `C:\SchoolHub-QA`.
3. Double-click `run-tests.bat`.
4. The first run needs an internet connection to install Playwright and Chromium.
5. Check the final terminal output. A detailed report is saved under `playwright-report\index.html`.

Alternatively, open Command Prompt in this folder and run:

```bat
npm install
npx playwright install chromium
npm test
```

To watch the browser while tests run:

```bat
npm run test:headed
```

## Important limitations

- Tests use synthetic data in a local browser and clear the test browser's local storage before each test.
- This is **not yet a Firebase backend integration test**. The included app still stores data in browser `localStorage`; the bulk-send action records a local demo notice and does not send email, SMS or push notifications.
- No real Firebase project, real student data, or production credentials are needed or used by this test kit.
- Do not point test automation at a live school or production database. After Firebase is integrated, add Firebase Emulator Suite tests for Authentication, Firestore rules, Storage rules, Cloud Functions and notification dispatch, and run end-to-end tests against the emulator/staging environment.
- The prototype's temporary passwords are demo-only. Production account provisioning should use Firebase Auth/admin SDK from a trusted server, force password reset, and never return plaintext passwords from a database.

## Test list

`tests/schoolhub.e2e.spec.js` contains the browser tests. The app is served only on `127.0.0.1:4173` by `server.js` during test execution.
