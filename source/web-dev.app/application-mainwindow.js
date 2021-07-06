//
// Copyright (c) 2020-2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;

var appConfig=require("./application-config.js").config;
var app=require("electron").app;
var path=require("path");
var cwd=process.cwd();

app.setName(appConfig["application.name"]);
app.setPath("appData",path.join(cwd,"repository"));
app.setPath("userData",path.join(cwd,"repository/"+app.getName()));

this_.mainWindow=null;

this_.secondInstance=!app.requestSingleInstanceLock();

if(this_.secondInstance) {
	app.quit();
	return;
};

app.on("second-instance", function(event, commandLine, workingDirectory){
	if (this_.mainWindow) {
		if (this_.mainWindow.isMinimized()) {
			this_.mainWindow.restore();
		};
		this_.mainWindow.focus();
		return;
	};
});

var BrowserWindow=require("electron").BrowserWindow;
var ipcMain=require("electron").ipcMain;

app.on("window-all-closed", function() {
	if(this_.shutdownServices) {
		this_.shutdownServices();
	} else {
		app.quit();
	};
});

app.on("before-quit",function() {
	this_.mainWindow.removeAllListeners("close");
});

require("./application-context-menu.js");

app.on("ready", function() {
	this_.mainWindow = new BrowserWindow({
		width: 1366,
		height: 768,
		icon: path.join(__dirname, "application.ico"),
		backgroundColor: "#FFFFFF",
		webPreferences: {
			nodeIntegration: false,
			preload: __dirname+"/application-preload.js",
			plugins: true,
			webSecurity: true,
			allowDisplayingInsecureContent: false,
			allowRunningInsecureContent: false
		}
	});
	//
	this_.mainWindow.setMenu(null);
	//
	this_.mainWindow.on("close", function(event) {
		event.preventDefault();
		this_.mainWindow.hide();
	});
	//
	this_.mainWindow.on("closed", function() {
		this_.mainWindow = null;
	});
	//
	this_.mainWindow.loadURL(__dirname+"/application.html");
});

