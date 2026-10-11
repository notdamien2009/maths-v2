@echo off
setlocal
cd /d "%~dp0"
echo NOVA Maths repository repair — local files only, no GitHub changes.
where py >nul 2>&1
if %ERRORLEVEL%==0 (
  py -3 "tools\apply_nova_repairs.py"
) else (
  python "tools\apply_nova_repairs.py"
)
if errorlevel 1 (
  echo.
  echo REPAIR STOPPED — read the error above. No GitHub operations were performed.
  pause
  exit /b 1
)
echo.
echo Repair complete. Inspect changed files and the core audit before your own Git push.
pause
