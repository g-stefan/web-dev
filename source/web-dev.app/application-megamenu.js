// Web Dev
// Copyright (c) 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

var this_ = module.exports;
var BrowserWindow = require("electron").BrowserWindow;
var ipcMain = require("electron").ipcMain;
var appLog = require("./application-log.js").log;

this_.screenSize = {
	"width" : 800,
	"height" : 600
};

this_.cursorScreenPoint = {
	"x" : 0,
	"y" : 0
};

this_.trayBounds = {
	"x" : 0,
	"y" : 0,
	"width" : 24,
	"height" : 24
};

this_.listMenuWindow = [];

this_.resetMenu = function() {
	if (this_.listMenuWindow.length == 0) {
		return;
	};

	var popup;
	for (var k = 0; k < this_.listMenuWindow.length; ++k) {
		if (this_.listMenuWindow[k]) {
			popup = this_.listMenuWindow[k].popup;
			this_.listMenuWindow[k].popup = null;
			this_.listMenuWindow[k] = null;
			popup.close();
		};
	};
	this_.listMenuWindow = [];
};

this_.hideMenu = function(level) {
	var popup;
	for (var k = 0; k < this_.listMenuWindow.length; ++k) {
		if (this_.listMenuWindow[k]) {
			if (this_.listMenuWindow[k].megaMenuItems.level >= level) {
				popup = this_.listMenuWindow[k].popup;
				this_.listMenuWindow[k].popup = null;
				this_.listMenuWindow[k] = null;
				popup.close();
			};
		};
	};
};

this_.isOkToShowMenu = function(item) {
	var k;
	for (var k = 0; k < this_.listMenuWindow.length; ++k) {
		if (this_.listMenuWindow[k]) {
			if (item.id == this_.listMenuWindow[k].megaMenuItems.id) {
				this_.hideMenu(item.level + 1);
				if (this_.listMenuWindow[k]) {
					this_.listMenuWindow[k].popup.focus();
				};
				return false;
			};
		};
	};

	return true;
};

this_.showMenu = function(megaMenuItems) {
	if (!this_.isOkToShowMenu(megaMenuItems.id)) {
		return;
	};

	this_.hideMenu(megaMenuItems.level);

	// Not a popup item
	if (!megaMenuItems) {
		return;
	};
	if (megaMenuItems.length == 0) {
		return;
	};

	var listMenuWindowIndex = this_.listMenuWindow.length;
	for (k = 0; k < this_.listMenuWindow.length; ++k) {
		if (!this_.listMenuWindow[k]) {
			listMenuWindowIndex = k;
			break;
		};
	};

	var popupX = 0;
	var popupY = 0;
	var popupWidth = 240;
	var popupHeight = 320;

	popupX = this_.cursorScreenPoint.x - popupWidth + 4;
	popupY = this_.cursorScreenPoint.y - popupHeight + 4;

	var popup = new BrowserWindow({
		frame : false,
		transparent : true,
		alwaysOnTop : true,
		skipTaskbar : true,
		resizable : false,
		show : false,
		x : popupX,
		y : popupY,
		width : popupWidth,
		height : popupHeight,
		icon : __dirname + "/application.ico",
		webPreferences : {
			nodeIntegration : false,
			preload : __dirname + "/application-preload.js",
			plugins : false,
			webSecurity : true,
			allowDisplayingInsecureContent : false,
			allowRunningInsecureContent : false
		}
	});

	this_.listMenuWindow[listMenuWindowIndex] = {popup : popup, megaMenuItems : megaMenuItems, focus : true};

	popup.setMenu(null);

	// --- debug
	// popup.show();

	popup.loadURL(__dirname + "/application-megamenu.html");

	popup.on("blur", function(event) {
		if (this_.listMenuWindow[listMenuWindowIndex]) {
			this_.listMenuWindow[listMenuWindowIndex].focus = false;
		};
	});

	popup.on("focus", function(event) {
		if (this_.listMenuWindow[listMenuWindowIndex]) {
			this_.listMenuWindow[listMenuWindowIndex].focus = true;
		};
	});
};

this_.checkMenuIntervalCount = 0;
this_.checkMenuInterval = setInterval(function() {
	if (this_.listMenuWindow.length == 0) {
		return;
	};

	for (var k = 0; k < this_.listMenuWindow.length; ++k) {
		if (this_.listMenuWindow[k]) {
			if (this_.listMenuWindow[k].focus) {
				this_.checkMenuIntervalCount = 0;
				return;
			};
		};
	};

	++this_.checkMenuIntervalCount;
	if (this_.checkMenuIntervalCount >= 3) {
		this_.checkMenuIntervalCount = 0;
		this_.resetMenu();
	};
}, 100);

ipcMain.on("megamenu-get-items", (event) => {
	var popup = BrowserWindow.fromWebContents(event.sender);
	if (popup == null) {
		event.returnValue = false;
		return;
	};
	var found = false;
	var megaMenuItems = null;
	for (var k = 0; k < this_.listMenuWindow.length; ++k) {
		if (this_.listMenuWindow[k]) {
			if (this_.listMenuWindow[k].popup.id == popup.id) {
				megaMenuItems = this_.listMenuWindow[k].megaMenuItems;
				break;
			};
		};
	};
	event.returnValue = megaMenuItems;
});

ipcMain.on("megamenu-set-size", (event, size) => {
	var popup = BrowserWindow.fromWebContents(event.sender);
	if (popup == null) {
		event.returnValue = false;
		return;
	};
	var bounds = popup.getBounds();
	var newBounds = {
		"x" : bounds.x,
		"y" : bounds.y,
		"width" : bounds.width,
		"height" : bounds.height
	};
	var doResize = false;
	// => right down
	if (size.width != bounds.width) {
		newBounds.x += (bounds.width - size.width);
		newBounds.width = size.width;
	};
	if (size.height != bounds.height) {
		newBounds.y += (bounds.height - size.height);
		newBounds.height = size.height;
	};

	if (newBounds.x < 0) {
		newBounds.x = 16;
	};
	if (newBounds.y < 0) {
		newBounds.y = 16;
	};
	if ((newBounds.x + newBounds.width) >= this_.screenSize.width) {
		newBounds.width = this_.cursorScreenPoint.x + 4;
		newBounds.x = 8;
	};
	if ((newBounds.y + newBounds.height) >= this_.screenSize.height) {
		newBounds.height = this_.cursorScreenPoint.y + 4;
		newBounds.y = 8;
	};

	doResize = (bounds.x != newBounds.x) || (bounds.y != newBounds.y) || (bounds.width != newBounds.width) || (bounds.height != newBounds.height);

	if (doResize) {
		popup.setBounds(newBounds);
	} else {
		popup.show();
	};

	event.returnValue = {height : newBounds.height, resize : doResize};
});
