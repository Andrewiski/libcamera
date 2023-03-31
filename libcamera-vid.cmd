@echo off
set /A COUNTER=1
echo This is a fake windows libcamera-vid
:writeData
set /A COUNTER=COUNTER+1
echo This is Some Data. %COUNTER%
rem TIMEOUT -T 10000 /nobreak > null
( timeout /t 1 || >nul ping -n 2 localhost ) 2>nul
goto writeData