// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.build-web [phpmyadmin]");

version = "5.2.0";

Shell.mkdirRecursivelyIfNotExists("output/library");

Shell.removeDirRecursivelyForce("temp");
Shell.mkdirRecursivelyIfNotExists("temp");

Shell.system("7z x \"vendor/phpMyAdmin-" + version + "-all-languages.zip\" -aoa -otemp");
Shell.rename("temp/phpMyAdmin-" + version + "-all-languages", "output/library/phpmyadmin");
