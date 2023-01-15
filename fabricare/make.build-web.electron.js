// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.build-web [electron]");

version = "21.3.4";

Shell.mkdirRecursivelyIfNotExists("output/library");

Shell.system("7z x vendor/electron-v"+version+"-win32-x64.zip -aoa -ooutput/library/electron");
Shell.system("7z x vendor/electron-v"+version+"-modules.7z -aoa -ooutput/library");
