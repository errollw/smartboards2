@ECHO OFF

REM Kill all currently running processes with the same name
TASKKILL /IM notepad.exe

REM Start our process
START C:\Windows\system32\notepad.exe
REM Use the window caption to activate, make visible, maximumise and place on top
cmdow.exe "Untitled - Notepad" /ACT /VIS /MAX /TOP

REM Loop until the process has finished
:LOOP
TASKLIST | FIND /I "notepad.exe"
IF ERRORLEVEL 1 (
  GOTO CONTINUE
) ELSE (
  ECHO Application is still running
  CALL :SLEEP 2
  GOTO LOOP
)

REM Utility for sleeping. Usage: "CALL :SLEEP X", where X is the number of seconds to sleep
:SLEEP
ping 127.0.0.1 -n 2 -w 1000 > NUL
ping 127.0.0.1 -n %1 -w 1000 > NUL

REM Exit when 
:CONTINUE

