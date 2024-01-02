// Web Dev
// Copyright (c) 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

// --- set moule search paths
require("module").globalPaths.push(__dirname + "\\..\\electron-modules");

const globalPaths = require("module").globalPaths;
const Module = require("module");
const nodeModulePaths = Module._nodeModulePaths;
Module._nodeModulePaths = (from) => {
	return nodeModulePaths(from).concat(globalPaths);
};
// ---

var app = require("electron").app;
var BrowserWindow = require("electron").BrowserWindow;
var appLog = require("./application-log.js").log;

process.on("uncaughtException", function(e) {
	appLog(e.stack, "exception");
	app.quit();
});

var cwd = process.cwd();
var config = require("./application-config.js").config;

var appPath = cwd + "\\electron;";
appPath += cwd + "\\apache-httpd-server\\bin;";
appPath += cwd + "\\php;";
appPath += cwd + "\\maria-db\\bin;";
process.env["PATH"] = appPath + process.env["PATH"];

var path = require("path");
var fs = require("fs");
var ipcMain = require("electron").ipcMain;
var spawn = require("child_process").spawn;
var appData = path.join(cwd, "repository");

if (!fs.existsSync(appData)) {
	fs.mkdirSync(appData);
};

var appMainWindow = require("./application-mainwindow.js");

if (appMainWindow.secondInstance) {
	return;
};

var job = require("./application-job.js").newJob();
var util = require("./application-util.js");

if (!fs.existsSync(cwd + "/log")) {
	fs.mkdirSync(cwd + "/log");
};

if (!fs.existsSync(cwd + "/tmp")) {
	fs.mkdirSync(cwd + "/tmp");
};

// ---
var appMegaMenu = require("./application-megamenu.js");
var appMenu = require("./application-menu.js");
var appMenuData = require("./application-menu-data.js");
//
appMenuData.cmdShow = function() {
	appMainWindow.mainWindow.show();
};
//
appMenuData.cmdExit = function() {
	appMegaMenu.resetMenu();
	appMainWindow.mainWindow.destroy();
};
//
appMenuData.loadMenu(appMenu.Menu);
//
var Tray = require("electron").Tray;
//
var Screen = null;
var tray = null;
//
app.on("ready", function() {
	Screen = require("electron").screen;
	tray = new Tray(__dirname + "/application.ico");
	tray.setToolTip("Web Dev");
	tray.on("click", function(event) {
		showTrayMenu();
	});
	tray.on("right-click", function(event) {
		showTrayMenu();
	});
});

app.on("before-quit", function() {
	if (tray != null) {
		tray.destroy();
		tray = null;
	};
});

function showTrayMenu() {
	appMegaMenu.resetMenu();
	appMegaMenu.cursorScreenPoint = Screen.getCursorScreenPoint();
	appMegaMenu.screenSize = (Screen.getDisplayNearestPoint(appMegaMenu.cursorScreenPoint)).size;
	appMegaMenu.trayBounds = tray.getBounds();

	appMenu.Menu.updateItem(appMenu.Menu);
	appMegaMenu.showMenu(appMenu.Menu.getSimpleForm(appMenu.Menu));
};

ipcMain.on("megamenu-new-popup", (event, info) => {
	if (event.sender == null) {
		return;
	};
	var popup = BrowserWindow.fromWebContents(event.sender);
	if (popup == null) {
		return;
	};
	var bounds = popup.getBounds();
	appMegaMenu.cursorScreenPoint.x = bounds.x + 4;
	appMegaMenu.cursorScreenPoint.y = bounds.y + info.offsetY + 32;
	var item = appMenu.Menu.getItemFromId(appMenu.Menu, info.id);
	if (appMegaMenu.isOkToShowMenu(item)) {
		appMenu.Menu.updateItem(item);
		appMegaMenu.showMenu(appMenu.Menu.getSimpleForm(item));
	};
});

ipcMain.on("megamenu-close-popup", (event, info) => {
	if (event.sender == null) {
		return;
	};
	var popup = BrowserWindow.fromWebContents(event.sender);
	if (popup == null) {
		return;
	};
	var bounds = popup.getBounds();
	appMegaMenu.cursorScreenPoint.x = bounds.x + 4;
	appMegaMenu.cursorScreenPoint.y = bounds.y + info.offsetY + 32;
	appMegaMenu.hideMenu((appMenu.Menu.getItemFromId(appMenu.Menu, info.id)).level);
});

ipcMain.on("megamenu-do-cmd", (event, info) => {
	if (event.sender == null) {
		return;
	};
	var popup = BrowserWindow.fromWebContents(event.sender);
	if (popup == null) {
		return;
	};
	var bounds = popup.getBounds();
	appMegaMenu.cursorScreenPoint.x = bounds.x + 4;
	appMegaMenu.cursorScreenPoint.y = bounds.y + info.offsetY + 32;
	var item = appMenu.Menu.getItemFromId(appMenu.Menu, info.id);
	if (item.cmd != null) {
		setTimeout(function() {
			appMegaMenu.resetMenu();
		}, 100);
		setTimeout(function() {
			item.cmd();
		}, 100);
	};
});

// ---

var processApacheHTTPServer = null;
var processApacheHTTPServerTerminated = false;
var processMariaDB = null;
var processMariaDBTerminated = false;
var tmpConfigPath = util.replaceString(appData, "\\", "/");
var tmpApacheHTTPServerConfig = util.replaceString(appData + "/apache-http-server.conf", "\\", "/");
var tmpPHPConfig = util.replaceString(appData + "/php.ini", "\\", "/");
var tmpPHPErrorConfig = util.replaceString(appData + "/hypertext-preprocessor-error.php", "\\", "/");
var tmpMariaDBConfig = util.replaceString(appData + "/maria-db.ini", "\\", "/");
var tmpPHPMyAdminConfig = util.replaceString(appData + "/phpmyadmin.config.php", "\\", "/");

function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
};

appMainWindow.shutdownServices = async function() {
	if (tray != null) {
		tray.destroy();
		tray = null;
	};
	appMegaMenu.resetMenu();

	if (processApacheHTTPServer) {
		processApacheHTTPServer.kill("SIGTERM");
	};

	if (processMariaDB) {
		var cmdLine = [ "--host=127.0.0.1", "--user=" + config["maria-db.username"], "--port=" + config["maria-db.port"], "--protocol=TCP" ];
		if (config["maria-db.password"]) {
			cmdLine.push("--password=" + config["maria-db.password"]);
		};
		cmdLine.push("shutdown");
		spawn("mysqladmin", cmdLine, {
			cwd : cwd + "/library/maria-db/bin",
			windowsHide : true,
			stdio : "ignore",
			shell : false
		});
	};

	if (processApacheHTTPServer) {
		while (!processApacheHTTPServer) {
			await sleep(100);
		};
	};

	if (processMariaDB) {
		while (!processMariaDBTerminated) {
			await sleep(100);
		};
	};

	appLog("Shutdown ok");
	app.quit();
};

job.replaceTextInFile = function(source, target, replaceList, errorMessage) {
	util.jobReplaceTextInFile(this, source, target, replaceList, errorMessage);
};

var cwdX = util.replaceString(cwd, "\\", "/");

//
// Config Apache HTTP Server
//
job.replaceTextInFile(cwd + "/config/apache-http-server.template.conf",
                      tmpApacheHTTPServerConfig, [
	                      [ "$APPLICATION_PATH", cwdX ],
	                      [ "$SERVER_PATH", cwdX + "/library/apache-http-server" ],
	                      [ "$SERVER_PORT", config["apache-http-server-http.port"] ],
	                      [ "$PHP_PATH", cwdX + "/library/php" ],
	                      [ "$PHP_INI_PATH", tmpConfigPath ],
	                      [ "$PHPMYADMIN_PATH", cwdX + "/library/phpmyadmin" ],
	                      [ "$CONFIG_PATH", tmpConfigPath ],
	                      [ "$ADMIN_EMAIL", config["admin.email"] ]
                      ],
                      "error: config #1");

//
// Config PHP
//
job.replaceTextInFile(cwd + "/config/php.template.ini",
                      tmpPHPConfig, [
	                      [ "$APPLICATION_PATH", cwdX ],
	                      [ "$PHP_PATH", cwdX + "/library/php" ],
	                      [ "$MARIA_DB_PORT", config["maria-db.port"] ]
                      ],
                      "error: config #2");

//
// Config PHP Error
//
job.replaceTextInFile(cwd + "/config/hypertext-preprocessor-error.template.php",
                      tmpPHPErrorConfig, [
	                      [ "$APPLICATION_PATH", cwdX ]
                      ],
                      "error: config #3");

//
// Config Maria DB
//
job.replaceTextInFile(cwd + "/config/maria-db.template.ini",
                      tmpMariaDBConfig, [
	                      [ "$APPLICATION_PATH", cwdX ],
	                      [ "$CONFIG_PATH", tmpConfigPath ],
	                      [ "$SERVER_PATH", cwdX + "/library/maria-db" ],
	                      [ "$SERVER_PORT", config["maria-db.port"] ]
                      ],
                      "error: config #4");

//
// Config PHPMyAdmin #1
//
job.replaceTextInFile(cwd + "/config/phpmyadmin.config.inc.template.php",
                      cwdX + "/library/phpmyadmin/config.inc.php", [
	                      [ "$APPLICATION_PATH", cwdX ],
	                      [ "$PHPMYADMIN_CONFIG_FILE", tmpPHPMyAdminConfig ]
                      ],
                      "error: config #5");

//
// Config PHPMyAdmin #2
//
job.replaceTextInFile(cwd + "/config/phpmyadmin.config.template.php",
                      tmpPHPMyAdminConfig, [
	                      [ "$APPLICATION_PATH", cwdX ],
	                      [ "$MARIA_DB_PORT", config["maria-db.port"] ],
	                      [ "$MARIA_DB_USERNAME", config["maria-db.username"] ],
	                      [ "$MARIA_DB_PASSWORD", config["maria-db.password"] ],
	                      [ "$PHPMYADMIN_SECRET", config["phpmyadmin.secret"] ]
                      ],
                      "error: config #6");

//
// Start Apache HTTPD
//
job.add(function(job) {
	processApacheHTTPServer = spawn("httpd", [ "-f", tmpApacheHTTPServerConfig ], {
		cwd : cwd + "/library/apache-http-server/bin",
		windowsHide : true
	});
	processApacheHTTPServer.on("close", (code) => {
		appLog("Apache HTTP Server terminated");
		processApacheHTTPServerTerminated = true;
	});
	setTimeout(function() {
		if (processApacheHTTPServerTerminated) {
			job.setError("error: server #1");
			return;
		};
		appLog("Apache HTTP Server start");
		job.next();
	}, 1500);
});

//
// Start MariaDB
//
job.add(function(job) {
	processMariaDB = spawn("mysqld", [ "--defaults-file=" + tmpMariaDBConfig ], {
		cwd : cwd + "/library/maria-db/bin",
		windowsHide : true
	});
	processMariaDB.on("close", (code) => {
		appLog("Maria DB terminated");
		processMariaDBTerminated = true;
	});
	setTimeout(function() {
		if (processMariaDBTerminated) {
			job.setError("error: server #2");
			return;
		};
		appLog("Maria DB start");
		job.next();
	}, 3000);
});

ipcMain.on("start-application", (event) => {
	var count = job.count();
	job.onStep = function(job) {
		event.sender.send("set-procent", Math.floor((job.index() * 100) / count));
	};
	job.onError = function(job, errorMessage) {
		appLog(errorMessage, "error");
		event.sender.send("set-error", errorMessage);
	};
	job.onDone = function(job) {
		event.sender.send("set-procent", 100);
		event.sender.send("connect-application", "http://127.0.0.1:" + config["apache-http-server-http.port"]);
		appLog("Application start");
	};
	job.beginWork();
});
