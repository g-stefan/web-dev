//
// Copyright (c) 2020-2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

module.exports = function(win) {

	var ipcMain=require("electron").ipcMain;
	var BrowserWindow=require("electron").BrowserWindow;
	var path=require("path");
	var url=require("url");

	var searchWindow=null;
	var searchWindowParent=null;

	ipcMain.on("find-text", (event, textToFind) => {
		if((""+textToFind).length>0) {
			if(searchWindowParent) {
				searchWindowParent.webContents.findInPage(textToFind);
			};
		};
	});

	ipcMain.on("find-text-next", (event, textToFind) => {
		if((""+textToFind).length>0) {
			if(searchWindowParent) {
				searchWindowParent.webContents.findInPage(textToFind, {
					findNext:true
				});
			};
		};
	});

	ipcMain.on("find-clear", (event) => {
		if(searchWindowParent!=null) {
			searchWindowParent.webContents.stopFindInPage("clearSelection");
		};
	});

	if(!searchWindow) {

		searchWindowParent=win;
		searchWindow=new BrowserWindow({
			width: 400,
			height: 96,
			icon: path.join(__dirname, "application.ico"),
			parent: win,
			title: "Find",
			webPreferences: {
				nodeIntegration: false,
				preload: __dirname+"/application-preload.js",
				plugins: false,
				webSecurity: true,
				allowDisplayingInsecureContent: false,
				allowRunningInsecureContent: false
			}
		});
		searchWindow.on("closed", () => {
			searchWindow = null;
			if(searchWindowParent!=null) {
				searchWindowParent.webContents.stopFindInPage("clearSelection");
			};
			searchWindowParent= null;
		});
		searchWindow.setMenu(null);
		//
		searchWindow.loadURL(url.format({
			protocol: "file",
			slashes: true,
			pathname: path.join(__dirname, "application-find.html")
		}));

	};

};

