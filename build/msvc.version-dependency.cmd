@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

echo -^> version-dependency web-dev

xyo-cc --bump-version-minor-if-version-dependency web-dev
