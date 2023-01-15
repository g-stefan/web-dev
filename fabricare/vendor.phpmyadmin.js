// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("vendor [phpmyadmin]");

version = "5.2.0";

Shell.mkdirRecursivelyIfNotExists("vendor");

var vendor = "phpMyAdmin-" + version + "-all-languages.zip";
if (!Shell.fileExists("vendor/" + vendor)) {
	var webLink = "https://files.phpmyadmin.net/phpMyAdmin/" + version + "/" + vendor;
	var cmd = "curl --insecure --location " + webLink + " --output vendor/" + vendor;
	Console.writeLn(cmd);
	exitIf(Shell.system(cmd));
};
