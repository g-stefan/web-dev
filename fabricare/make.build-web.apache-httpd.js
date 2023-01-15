// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.build-web [apache-httpd]");

var version = "2.4.54";

Shell.mkdirRecursivelyIfNotExists("output/library");

Shell.mkdirRecursivelyIfNotExists("temp");
Shell.system("7z x vendor/httpd-"+version+"-win64-VS17.zip -aoa -otemp");
Shell.rename("temp/Apache24","output/library/apache-http-server");
Shell.rename("temp/ReadMe.txt","output/library/apache-http-server/Distribution-ReadMe.txt");
Shell.removeDirRecursivelyForce("temp");

Shell.mkdirRecursivelyIfNotExists("temp");
Shell.system("7z x vendor/httpd-"+version+"-win64-msvc-2022.7z -aoa -otemp");
Shell.rename("temp/bin/rotatelogsw.exe","output/library/apache-http-server/bin/rotatelogsw.exe");
Shell.removeDirRecursivelyForce("temp");

Shell.copyFile("vendor/vc-2022-redist.x64.exe","output/library/vc-2022-redist.x64.exe");
Shell.copyFile("source/httpd.conf", "output/library/apache-http-server/conf/httpd.conf");

Shell.removeDirRecursivelyForce("output/library/apache-http-server/include");
Shell.removeDirRecursivelyForce("output/library/apache-http-server/lib");
