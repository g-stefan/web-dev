// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("vendor [electron]");

version = "24.0.0";

Shell.mkdirRecursivelyIfNotExists("vendor");

if (!Shell.fileExists("vendor/electron-v" + version + "-win32-x64.zip")) {
	var webLink = "https://github.com/electron/electron/releases/download/v" + version + "/electron-v" + version + "-win32-x64.zip";
	var cmd = "curl --insecure --location " + webLink + " --output vendor/electron-v" + version + "-win32-x64.zip";
	Console.writeLn(cmd);
	exitIf(Shell.system(cmd));
};

if (!Shell.fileExists("vendor/electron-v" + version + "-modules.7z")) {

	Shell.mkdirRecursivelyIfNotExists("temp");

	runInPath("temp", function() {
		Shell.system("cmd /C \"call npm install electron-context-menu\"");
		Shell.rename("node_modules", "electron-modules");
		exitIf(Shell.system("7zr a -mx9 -mmt4 -r- -sse -w. -y -t7z ../vendor/electron-v" + version + "-modules.7z electron-modules"));
	});
};
