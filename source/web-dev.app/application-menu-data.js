//
// Copyright (c) 2020-2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;
var Dialog=require("electron").dialog;
var appLog=require("./application-log.js").log;

function alert(msg){
	Dialog.showMessageBox({
		type: "info",
		title: "alert",
		message: msg
	});
};

this_.cmdExit=null;
this_.cmdShow=null;

this_.loadMenu=function(menu){

	menu.addItem("Open Web Dev",this_.cmdShow);
	menu.addSeparator();
	menu.addItem("Quit Web Dev",this_.cmdExit);

};
