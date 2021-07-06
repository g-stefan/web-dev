//
// Copyright (c) 2020-2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;

var appLog=require("./application-log.js").log;

var Menu={};

Menu.Type={
	Item: 0,
	Separator: 1,
	Popup: 2
};

Menu.type=Menu.Type.Popup;
Menu.text="ROOT";
Menu.checked=false;
Menu.cmd=null;
Menu.items=[];
Menu.index=0;
Menu.id="";
Menu.level=0;
Menu.updateItem=null;
Menu.updatePopup=null;
Menu.icon=null;
Menu.cssClass=null;

Menu.createItem=function(text,cmd,checked,updateItem,icon,cssClass){
	var item={};

	item.type=Menu.Type.Item;
	item.text=text;
	item.cmd=cmd;
	item.checked=checked;
	item.index=0;
	item.id="";
	item.level=0;
	item.updateItem=updateItem;
	item.updatePopup=null;
	item.icon=icon;
	item.cssClass=cssClass;

	return item;
};

Menu.createSeparator=function(){
	var item={};

	item.type=Menu.Type.Separator;
	item.index=0;
	item.id="";
	item.level=0;

	return item;
};

Menu.createPopup=function(text,cmd,checked,updatePopup,updateItem,icon,cssClass){
	var item=Menu.createItem(text,cmd,checked,updateItem,icon,cssClass);

	item.type=Menu.Type.Popup;
	item.items=[];

	item.addItem=Menu.addItem;
	item.addSeparator=Menu.addSeparator;
	item.addPopup=Menu.addPopup;
	item.index=0;
	item.id="";
	item.updatePopup=updatePopup;
	item.reset=function(){
		this.items=[];
	};

	return item;
};

Menu.addItem=function(text,cmd,checked,updateItem,icon,cssClass){
	if(this.type!=Menu.Type.Popup){
		return false;
	};

	var item=Menu.createItem(text,cmd,checked,updateItem,icon,cssClass);

	this.items.push(item);
	item.index=this.items.length-1;

	item.id=this.id;
	if(item.id.length>0){
		item.id+=".";
	};
	item.id+=item.index;
	item.level=this.level+1;

	return true;
};

Menu.addSeparator=function(){
	if(this.type!=Menu.Type.Popup){
		return false;
	};

	var item=Menu.createSeparator();

	this.items.push(item);
	item.index=this.items.length-1;

	item.id=this.id;
	if(item.id.length>0){
		item.id+=".";
	};
	item.id+=item.index;
	item.level=this.level+1;

	return true;
};

Menu.addPopup=function(text,cmd,checked,updatePopup,updateItem,icon,cssClass){
	if(this.type!=Menu.Type.Popup){
		return false;
	};

	var item=Menu.createPopup(text,cmd,checked,updatePopup,updateItem,icon,cssClass);

	this.items.push(item);
	item.index=this.items.length-1;

	item.id=this.id;
	if(item.id.length>0){
		item.id+=".";
	};
	item.id+=item.index;
	item.level=this.level+1;

	return item;
};

Menu.getItemFromId=function(item,id){
	var list=id.split(".");
	for(var k=0;k<list.length;++k){
		item=item.items[list[k]];
	};
	return item;
};

Menu.updateItem=function(item){
	if(item.updatePopup!=null){
		item.updatePopup();
	};
	for(var k=0;k<item.items.length;++k){
		if(item.items[k].updateItem!=null){
			item.items[k].updateItem();
		};
	};
};

Menu.getSimpleForm=function(item){
	var itemSimpleForm={};
	itemSimpleForm.id=item.id;
	itemSimpleForm.level=item.level;
	itemSimpleForm.items=[];
	for(var k=0;k<item.items.length;++k){
		itemSimpleForm.items[k]={};
		itemSimpleForm.items[k].type=item.items[k].type;
		itemSimpleForm.items[k].text=item.items[k].text;
		itemSimpleForm.items[k].checked=item.items[k].checked;
		itemSimpleForm.items[k].id=item.items[k].id;
		itemSimpleForm.items[k].icon=item.items[k].icon;
		itemSimpleForm.items[k].cssClass=item.items[k].cssClass;
	};
	return itemSimpleForm;
};

this_.Menu=Menu;

