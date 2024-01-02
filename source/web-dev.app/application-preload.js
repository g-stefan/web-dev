// Web Dev
// Copyright (c) 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

var contextBridge = require("electron").contextBridge;
var ipcRenderer = require("electron").ipcRenderer;
contextBridge.exposeInMainWorld("ipcRenderer", {
	send : (channel, data) => {
	        ipcRenderer.send(channel, data);
	},
	sendSync : (channel, data) => {
	        return ipcRenderer.sendSync(channel, data);
	},
	on : (channel, func) => {
	        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
	}
});
