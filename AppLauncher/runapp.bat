@ECHO OFF

TASKKILL /IM notepad.exe

START C:\Windows\system32\notepad.exe
cmdow.exe "Untitled - Notepad" /ACT /VIS /MAX /TOP

:LOOP
TASKLIST | FIND /I "notepad.exe"
IF ERRORLEVEL 1 (
  GOTO CONTINUE
) ELSE (
  ECHO Application is still running
  CALL :SLEEP 2
  GOTO LOOP
)

:SLEEP
ping 127.0.0.1 -n 2 -w 1000 > NUL
ping 127.0.0.1 -n %1 -w 1000 > NUL

:CONTINUE

