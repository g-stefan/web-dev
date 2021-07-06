@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

call .\build\msvc.config.cmd

if exist release\%PROJECT%-%VERSION%.7z del /Q /F release\%PROJECT%-%VERSION%.7z

move output %PROJECT%-%VERSION%
7zr a -mx9 -mmt4 -r -sse -w. -y -t7z release\%PROJECT%-%VERSION%-portable.7z %PROJECT%-%VERSION%
move %PROJECT%-%VERSION% output
pushd release
xyo-cc --sha512-file=%PROJECT%-%VERSION%-portable.7z >%PROJECT%-%VERSION%-portable.sha512.csv
popd
