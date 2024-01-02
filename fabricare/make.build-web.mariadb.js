// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.build-web [mariadb]");

version = "10.6.11";

Shell.mkdirRecursivelyIfNotExists("output/library");

Shell.removeDirRecursivelyForce("temp");

Shell.mkdirRecursivelyIfNotExists("temp");
Shell.system("7z x \"vendor/mariadb-" + version + "-winx64.zip\" -aoa -otemp");
Shell.rename("temp/mariadb-" + version + "-winx64", "output/library/maria-db");
Shell.removeDirRecursivelyForce("temp");

Shell.removeDirRecursivelyForce("output/library/maria-db/include");
Shell.removeFile("output/library/maria-db/bin/*.pdb");
Shell.removeFile("output/library/maria-db/bin/*.lib");
Shell.removeFile("output/library/maria-db/lib/*.pdb");
Shell.removeFile("output/library/maria-db/lib/*.lib");
