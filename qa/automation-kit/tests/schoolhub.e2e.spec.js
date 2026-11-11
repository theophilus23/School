const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  // All browser actions remain local. The app's confirm dialogs are accepted for repeatable testing.
  await page.addInitScript(() => {
    localStorage.clear();
    window.confirm = () => true;
    window.alert = () => {};
  });
  await page.goto('/');
  await expect(page.locator('#p-dashboard')).toBeVisible();
});

test('dashboard renders and all main sections open', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  for (const [label, section] of [
    ['Accounts & parent links', 'accounts'], ['Class documents', 'documents'],
    ['Homework & assignments', 'tasks'], ['Exams & timetable', 'exams'],
    ['Bulk notifications', 'bulk'], ['Messages & inbox', 'messages'], ['Settings & export', 'settings']
  ]) {
    await page.locator('.nav').filter({ hasText: label }).click();
    await expect(page.locator(`#p-${section}`)).toHaveClass(/active/);
  }
});

test('creates student and linked parent accounts', async ({ page }) => {
  await page.locator('.nav').filter({ hasText: 'Accounts & parent links' }).click();
  await page.locator('#p-accounts button.primary').click();
  await page.locator('#aName').fill('QA Test Student');
  await page.locator('#aClass').selectOption('Class 10');
  await page.locator('#aSection').selectOption('A');
  await page.locator('#aYear').selectOption('2026-27');
  await page.locator('#aRoll').fill('QA-001');
  await page.locator('#aParent').fill('QA Test Guardian');
  await page.locator('#aEmail').fill('qa-guardian@example.test');
  await page.locator('#aPending').check();
  await page.locator('#modalAction').click();
  await expect(page.getByText('QA Test Student', { exact: true })).toBeVisible();
  await expect(page.getByText(/Student ID:/)).toBeVisible();
  await page.locator('#modalAction').click();
  await expect(page.locator('#accountRows')).toContainText('QA Test Student');
  await expect(page.locator('#accountRows')).toContainText('QA Test Guardian');
});

test('creates homework, schedules an exam and adds a class document URL', async ({ page }) => {
  await page.locator('.nav').filter({ hasText: 'Homework & assignments' }).click();
  await page.locator('#p-tasks button.primary').click();
  await page.locator('#tTitle').fill('QA Mathematics Homework');
  await page.locator('#tClass').selectOption('Class 10');
  await page.locator('#tSection').selectOption('A');
  await page.locator('#tYear').selectOption('2026-27');
  await page.locator('#tSubject').selectOption({ index: 0 });
  await page.locator('#tType').selectOption('Homework');
  await page.locator('#tDue').fill('2026-11-15');
  await page.locator('#modalAction').click();
  await expect(page.locator('#taskRows')).toContainText('QA Mathematics Homework');

  await page.locator('.nav').filter({ hasText: 'Exams & timetable' }).click();
  await page.locator('#p-exams button.primary').click();
  await page.locator('#xTitle').fill('QA Mathematics Exam');
  await page.locator('#xClass').selectOption('Class 10');
  await page.locator('#xSection').selectOption('A');
  await page.locator('#xYear').selectOption('2026-27');
  await page.locator('#xDate').fill('2026-11-20');
  await page.locator('#xTime').fill('09:30');
  await page.locator('#xRoom').fill('QA Room');
  await page.locator('#modalAction').click();
  await expect(page.locator('#examList')).toContainText('QA Mathematics Exam');

  await page.locator('.nav').filter({ hasText: 'Class documents' }).click();
  await page.locator('#p-documents button.primary').click();
  await page.locator('#dTitle').fill('QA Class Notes');
  await page.locator('#dClass').selectOption('Class 10');
  await page.locator('#dSection').selectOption('A');
  await page.locator('#dYear').selectOption('2026-27');
  await page.locator('#dUrl').fill('https://example.test/qa-notes.pdf');
  await page.locator('#modalAction').click();
  await expect(page.locator('#documentList')).toContainText('QA Class Notes');
});

test('builds final recipients and records a bulk notification in local demo inbox', async ({ page }) => {
  // Create a known test account first so this test does not depend on seeded demo records.
  await page.locator('.nav').filter({ hasText: 'Accounts & parent links' }).click();
  await page.locator('#p-accounts button.primary').click();
  await page.locator('#aName').fill('QA Fee Reminder Student');
  await page.locator('#aClass').selectOption('Class 10');
  await page.locator('#aSection').selectOption('A');
  await page.locator('#aYear').selectOption('2026-27');
  await page.locator('#aParent').fill('QA Fee Reminder Parent');
  await page.locator('#aPending').check();
  await page.locator('#modalAction').click();
  await page.locator('#modalAction').click();

  await page.locator('.nav').filter({ hasText: 'Bulk notifications' }).click();
  await page.locator('#bType').selectOption('Fee reminder');
  await page.locator('#bYear').selectOption('2026-27');
  await page.locator('#bClass').selectOption('Class 10');
  await page.locator('#bSection').selectOption('A');
  await page.locator('#bAudience').selectOption('both');
  await page.locator('#bFilter').selectOption('pending');
  await page.locator('#bTitle').fill('QA test bulk notice');
  await page.locator('#bBody').fill('Automated test notice only. No real messages are sent.');
  await page.getByRole('button', { name: /Build final recipient list/ }).click();
  await expect(page.locator('#recipientStatus')).toContainText('Preview ready');
  await expect(page.locator('#recipientRows')).toContainText('QA Fee Reminder Student');
  await expect(page.locator('#recipientRows')).toContainText('QA Fee Reminder Parent');
  await expect(page.locator('#sendBtn')).toBeEnabled();
  await page.locator('#sendBtn').click();
  await page.locator('.nav').filter({ hasText: 'Messages & inbox' }).click();
  await expect(page.locator('#messageList')).toContainText('QA test bulk notice');
  await expect(page.locator('#messageList')).toContainText('recipient entries in demo');
});

test('school profile can be saved', async ({ page }) => {
  await page.locator('.nav').filter({ hasText: 'Settings & export' }).click();
  await page.locator('#schoolName').fill('QA Sample School');
  await page.locator('#schoolEmail').fill('qa-office@example.test');
  await page.getByRole('button', { name: 'Save school profile' }).click();
  await expect(page.locator('#brandName')).toContainText('QA Sample School');
});
