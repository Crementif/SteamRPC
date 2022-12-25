@echo off
cd C:\\Misc\\SteamRPC
:loop
node SteamRPC.js
timeout /t 20 >null
cls
goto loop
