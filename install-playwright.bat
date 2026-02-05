@echo off
REM Manual Playwright installation script
REM Run this if npm install fails

echo Installing Playwright...

REM Try npx first
npx --yes @playwright/test@1.40.0 install chromium

echo.
echo Playwright browser installed successfully!
echo.
echo Note: You may need to manually run 'npm install' to install the package.
echo If npm install continues to fail due to auth issues, try:
echo   1. npm config delete //registry.npmjs.org/:_authToken
echo   2. npm cache clean --force
echo   3. npm install
echo.

pause
