@echo off
rem set /A COUNTER=1
rem echo This is a fake windows libcamera-vid
:writeData
rem set /A COUNTER=COUNTER+1
rem echo This is Some Data. %COUNTER%
rem TIMEOUT -T 10000 /nobreak > null
type test.h264
( timeout /t > nul || >nul ping -n 2 localhost ) 2>nul
goto writeData