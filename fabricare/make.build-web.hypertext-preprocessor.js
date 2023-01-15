// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.build-web [hypertext-preprocessor]");

var version = "8.1.14";

Shell.mkdirRecursivelyIfNotExists("output/library");

Shell.removeDirRecursivelyForce("temp");

Shell.mkdirRecursivelyIfNotExists("temp");
Shell.system("7z x \"vendor/php-"+version+"-Win32-vs16-x64.zip\" -aoa -otemp");
Shell.rename("temp","output/library/php");

Shell.mkdirRecursivelyIfNotExists("temp");
Shell.system("7z x \"vendor/php_mailparse-3.1.1-8.0-ts-vs16-x64.zip\" -aoa -otemp");
Shell.rename("temp/php_mailparse.dll","output/library/php/ext/php_mailparse.dll");
Shell.removeDirRecursivelyForce("temp");

Shell.copyFile("vendor/cacert.pem","output/library/cacert.pem");
Shell.copyFile("vendor/composer.phar","output/library/php/composer.phar");

Shell.removeDirRecursivelyForce("output/library/php/dev");

