@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

echo - %BUILD_PROJECT% ^> release

goto cmdXDefined
:cmdX
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo "Error: release"
exit 1
:cmdXDefined

call :cmdX call build\platform\msvc.cmd vendor
call :cmdX call build\platform\msvc.cmd version
call :cmdX call build\platform\msvc.cmd make
call :cmdX call build\platform\msvc.cmd sign
call :cmdX call build\platform\msvc.cmd archive
