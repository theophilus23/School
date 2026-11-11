@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo SchoolHub automated UI test runner
echo ==========================================
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed. Install the current Node.js LTS version first.
  pause
  exit /b 1
)
echo [1/3] Installing test dependencies...
call npm install
if errorlevel 1 goto failed
echo [2/3] Checking Chromium browser is installed...
call npx playwright install chromium
if errorlevel 1 goto failed
echo [3/3] Running automated tests...
call npm test
if errorlevel 1 goto failed
echo.
echo All automated tests passed. HTML report: playwright-report\index.html
pause
exit /b 0
:failed
echo.
echo Tests or setup failed. Read the error above and check README.md.
pause
exit /b 1
