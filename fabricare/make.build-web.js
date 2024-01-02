// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.build-web");

if (Shell.directoryExists("output/library")) {
	return;
};

Fabricare.include("make.build-web.apache-httpd");
Fabricare.include("make.build-web.hypertext-preprocessor");
Fabricare.include("make.build-web.mariadb");
Fabricare.include("make.build-web.phpmyadmin");
Fabricare.include("make.build-web.electron");

messageAction("make.build-web [config]");

Shell.copyDirRecursively("LICENSES", "output/LICENSES");
Shell.copyDirRecursively("source/web-dev.app", "output/library/web-dev");
Shell.copyDirRecursively("source/application", "output/application");
Shell.copyDirRecursively("source/config", "output/config");

// Init Database
Shell.chdir("output/library/maria-db/bin");
Shell.system("mysql_install_db --verbose-bootstrap --datadir=../../../database");
Shell.chdir("../../../../");
Shell.remove("output/database/my.ini");

//
var config = JSON.decode(Shell.fileGetContents("output/config/config.json"));
var dateTime = new DateTime();
// Make a unique password, change GUID from time to time
Console.writeLn("New Maria DB password");
config["maria-db.password"] = SHA512.hash("{747F733D-2CBA-4464-BE13-A9FE52DE375A}" + dateTime.toUnixTime());
Console.writeLn("New phpMyAdmin secret");
config["phpmyadmin.secret"] = SHA512.hash("{929C1928-7E7A-4CDD-97B6-3F00F9495E3B}" + dateTime.toUnixTime());
Shell.filePutContents("output/config/config.json", JSON.encodeWithIndentation(config));
//
Shell.mkdirRecursivelyIfNotExists("output/repository");
var cwdX = (Shell.getcwd() + "/output").replace("\\", "/");

// ---

var content = Shell.fileGetContents("output/config/maria-db.template.ini");
content = content.replace("$APPLICATION_PATH", cwdX);
content = content.replace("$CONFIG_PATH", cwdX + "/repository");
content = content.replace("$SERVER_PATH", cwdX + "/library/maria-db");
content = content.replace("$SERVER_PORT", config["maria-db.port"]);
Shell.filePutContents("output/repository/maria-db.ini", content);

var content = Shell.fileGetContents("output/config/maria-db.template.init.sql");
content = content.replace("$MARIA_DB_USERNAME", config["maria-db.username"]);
content = content.replace("$MARIA_DB_PASSWORD", config["maria-db.password"]);
content += "\r\n";
content += Shell.fileGetContents("output/library/phpmyadmin/sql/create_tables.sql");
content += "\r\n";
content += "SHUTDOWN;";
Shell.filePutContents("output/repository/maria-db.init.sql", content);

// ---
Shell.mkdirRecursivelyIfNotExists("output/log");
Shell.mkdirRecursivelyIfNotExists("output/tmp");
//
Console.writeLn("Set Maria DB password and phpMyAdmin tables");
//
Shell.chdir("output/library/maria-db/bin");
Shell.execute("mysqld --defaults-file=\"" + cwdX + "/repository/maria-db.ini" +
              "\" --skip-grant-tables --init-file=\"" + cwdX + "/repository/maria-db.init.sql" +
              "\" --verbose");
Shell.chdir("../../../../");
Shell.removeDirRecursively("output/repository");
Shell.removeDirRecursively("output/log");
Shell.removeDirRecursively("output/tmp");
//
Console.writeLn("Done");
