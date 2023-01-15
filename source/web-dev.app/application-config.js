// Web Dev
// Copyright (c) 2020-2023 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

var this_ = module.exports;

var cwd = process.cwd();
var fs = require("fs");
var appLog = require("./application-log.js").log;

//
// Default config values
//

this_.config = {
	"application.name" : "Web-Dev",
	"apache-http-server-http.port" : 80,
	"maria-db.port" : 3306,
	"maria-db.username" : "root",
	"maria-db.password" : "[error-not-generated]",
	"phpmyadmin.secret" : "[error-not-generated]",
	"admin.email" : "admin@localhost",
	"developer" : false
};

var configData = null;
var config = {};

try {
	configData = fs.readFileSync(cwd + "/config/config.json", {encoding : "utf-8"});
	config = JSON.parse(configData);
} catch (e) {
	appLog(e.stack, "config.exception");
	return;
};

for (var k in this_.config) {
	if (k in config) {
		this_.config[k] = config[k];
	};
};
