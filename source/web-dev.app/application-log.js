//
// Copyright (c) 2020-2022 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;

var cwd=process.cwd();
var fs=require("fs");

this_.log=function(message,level,core) {
	var timestamp=new Date().toISOString().slice(0,19).replace("T", " ");
	var fileDate=timestamp.slice(0,10);
	if(level==null) {
		level="message";
	};
	if(core==null) {
		core="web-dev";
	};
	fs.appendFileSync(cwd+"/log/"+fileDate+"."+core+".log", timestamp+" ["+level+"]: "+message+"\r\n");
};

