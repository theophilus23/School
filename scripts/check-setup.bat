@echo off
echo === SchoolHub local Firebase setup check ===
where node >nul 2>nul && (node --version) || echo ERROR: Node.js not found
where npm >nul 2>nul && (npm --version) || echo ERROR: npm not found
where java >nul 2>nul && (java -version) || echo ERROR: Java JDK not found
where firebase >nul 2>nul && (firebase --version) || echo ERROR: Firebase CLI not found
echo.
echo If any tool is missing, install it and reopen Command Prompt.
pause
