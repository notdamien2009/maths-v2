@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %ERRORLEVEL%==0 (
  py -3 "tools\apply_nova_repairs.py" --check
) else (
  python "tools\apply_nova_repairs.py" --check
)
pause
