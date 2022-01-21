@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

echo - %BUILD_PROJECT% ^> vendor

if not exist vendor\ mkdir vendor

rem Apache

set PRODUCT_NAME=installer-apache-httpd
set PRODUCT_VERSION=2.4.51
set PRODUCT_BASE=httpd

set VENDOR=httpd-%PRODUCT_VERSION%-win64-VS16.zip
set WEB_LINK=https://www.apachelounge.com/download/VS16/binaries/httpd-%PRODUCT_VERSION%-win64-VS16.zip
if not exist vendor\%VENDOR% curl -A "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0" --insecure --location %WEB_LINK% --output vendor\%VENDOR%

set VENDOR=httpd-%PRODUCT_VERSION%-win64-msvc-2019.7z
set WEB_LINK=https://github.com/g-stefan/vendor-httpd/releases/download/v%PRODUCT_VERSION%/httpd-%PRODUCT_VERSION%-win64-msvc-2019.7z
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

set VENDOR=vc-2019-redist.x64.exe
set WEB_LINK=https://aka.ms/vs/16/release/vc_redist.x64.exe
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

set VENDOR=vc-2022-redist.x64.exe
set WEB_LINK=https://aka.ms/vs/17/release/vc_redist.x64.exe
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

rem Electron

set PRODUCT_NAME=installer-electron
set PRODUCT_VERSION=16.0.2
set PRODUCT_BASE=electron

set VENDOR=electron-v%PRODUCT_VERSION%-win32-x64.zip
set WEB_LINK=https://github.com/electron/electron/releases/download/v%PRODUCT_VERSION%/electron-v%PRODUCT_VERSION%-win32-x64.zip
if not exist vendor\electron-v%PRODUCT_VERSION%-win32-x64.zip curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

rem Electron - modules

set VENDOR=electron-v%PRODUCT_VERSION%-modules.7z
if exist vendor\%VENDOR% goto :ElectronModulesDone

if not exist temp\ mkdir temp

pushd temp
call npm install electron-context-menu
popd

move "temp\node_modules" "temp\electron-v%PRODUCT_VERSION%-modules"
pushd temp
7zr a -mx9 -mmt4 -r- -sse -w. -y -t7z ..\vendor\%VENDOR% electron-v%PRODUCT_VERSION%-modules
popd

:ElectronModulesDone

rem MariaDB

set PRODUCT_NAME=installer-mariadb
set PRODUCT_VERSION=10.6.5
set PRODUCT_BASE=mariadb

set VENDOR=mariadb-%PRODUCT_VERSION%-winx64.zip             
set WEB_LINK=https://mirrors.chroot.ro/mariadb/mariadb-%PRODUCT_VERSION%/winx64-packages/mariadb-%PRODUCT_VERSION%-winx64.zip
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

rem PHP

set PRODUCT_NAME=installer-hypertext-preprocessor
set PRODUCT_VERSION=8.0.13
set PRODUCT_BASE=hypertext-preprocessor

set VENDOR=php-%PRODUCT_VERSION%-Win32-vs16-x64.zip
set WEB_LINK=https://windows.php.net/downloads/releases/%VENDOR%
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

set VENDOR=cacert.pem
set WEB_LINK=https://curl.haxx.se/ca/%VENDOR%
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

set VENDOR=php_mailparse-3.1.2-8.0-ts-vs16-x64.zip
set WEB_LINK=https://windows.php.net/downloads/pecl/releases/mailparse/3.1.2/%VENDOR%
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

set VENDOR=composer.phar
set WEB_LINK=https://getcomposer.org/download/2.1.14/composer.phar
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%

rem phpMyAdmin

set PRODUCT_NAME=installer-phpmyadmin
set PRODUCT_VERSION=5.1.1
set PRODUCT_BASE=phpmyadmin

set VENDOR=phpMyAdmin-%PRODUCT_VERSION%-all-languages.zip
set WEB_LINK=https://files.phpmyadmin.net/phpMyAdmin/%PRODUCT_VERSION%/%VENDOR%
if not exist vendor\%VENDOR% curl --insecure --location %WEB_LINK% --output vendor\%VENDOR%
