@echo off
REM ============================================================================
REM Build and Run Script for Courier Management System (Java)
REM Student: Dharshan S | Reg: 732925ITR026 | Class: 25IT3A
REM ============================================================================

echo [INFO] Compiling Java classes...
if not exist "bin" mkdir "bin"

javac -d bin src/com/courier/model/*.java src/com/courier/service/*.java src/com/courier/exception/*.java src/com/courier/util/*.java src/com/courier/Main.java

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed!
    pause
    exit /b %ERRORLEVEL%
)

echo [SUCCESS] Compilation complete. Launching SwiftTrack Console...
java -cp bin com.courier.Main
pause
