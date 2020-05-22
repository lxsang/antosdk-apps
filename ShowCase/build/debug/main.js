(function(){var t;(t=class extends this.OS.GUI.BaseApplication{constructor(t){super("ShowCase",t)}main(){var t,e,i,n,o,a,s,l,d;return this.find("bttest").set("onbtclick",t=>this.error("test error")),this.observable.on("btclick",t=>this.notify("button clicked")),this.observable.on("menuselect",t=>this.notify(t.id)),(o=this.find("list")).set("data",[{text:"some thing with avery long text"},{text:"some thing 1",closable:!0},{text:"some thing 2",iconclass:"fa fa-camera-retro fa-lg"},{text:"some thing 3"},{text:"some thing 4"},{text:"some thing 5"}]),o.unshift({text:"shifted el"}),o.set("onlistselect",t=>this.notify(t.data.items)),this.find("switch").set("onchange",t=>this.notify(t.data)),this.find("spin").set("onchange",t=>this.notify(t.data)),this.find("menu").set("items",this.menu()),o.contextmenuHandle=(t,e)=>(e.set("items",this.menu()),e.show(t)),(n=this.find("grid")).set("oncelldbclick",t=>this.notify("on dbclick",t)),n.set("onrowselect",t=>this.notify("on rowselect",t.data.items)),this.observable.on("cellselect",(function(t){return console.log("observable",t)})),n.set("header",[{text:"header1",width:80},{text:"header2"},{text:"header3"}]),n.set("rows",[[{text:"text 1"},{text:"text 2"},{text:"text 3"}],[{text:"text 4"},{text:"text 5"},{text:"text 6"}],[{text:"text 7"},{text:"text 8"},{text:"text 9"}],[{text:"text 7"},{text:"Subgrid on columns and rows. Subgrid on columns, implicit grid rows. Subgrid on rows, defined column tracks"},{text:"text 9"}],[{text:"text 7"},{text:"text 8"},{text:"text 9"}],[{text:"text 7"},{text:"text 8"},{text:"text 9"}],[{text:"text 7"},{text:"text 8"},{text:"text 9"}],[{text:"text 7"},{text:"text 8"},{text:"text 9"}],[{text:"text 7"},{text:"text 8"},{text:"text 9"}],[{text:"text 7"},{text:"text 8"},{text:"text 9"}],[{text:"text 7"},{text:"text 8"},{text:"text 9"}]]),s={name:"My Tree",nodes:[{name:"hello",iconclass:"fa fa-car"},{name:"wat"},{name:"child folder",nodes:[{name:"child folder",nodes:[{name:"hello"},{name:"wat"}]},{name:"hello"},{name:"wat"},{name:"child folder",nodes:[{name:"hello"},{name:"wat"}]}]}]},(l=this.find("tree")).set("data",s),l.set("ontreeselect",t=>this.notify(t.data.item.get("treepath"))),l.set("ontreedbclick",t=>this.notify("treedbclick",t)),this.observable.on("treedbclick",t=>this.notify("observable treedbclick",t)),this.find("slider").set("onchange",t=>this.notify(t)),this.find("cal").set("ondateselect",t=>this.notify(t)),(a=this.find("cpk")).set("oncolorselect",t=>this.notify(t)),a.set("oncolorselect",t=>this.notify(t)),(i=this.find("fileview")).set("fetch",(function(t){return new Promise((function(e,i){var n;return(n=t.asFileHandle()).read().then((function(t){var o;return(o=n.parent().asFileHandle()).filename="[..]",o.type="dir",t.error?i(t.error):(t.result.unshift(o),e(t.result))}))}))})),i.set("path","home:///"),(d=this.find("viewoption")).set("data",[{text:"icon"},{text:"list"},{text:"tree"}]),d.set("onlistselect",t=>(this.notify(t.data.item.get("data").text),i.set("view",t.data.item.get("data").text))),e=this.find("dialoglist"),t=this.find("btrundia"),e.set("data",[{text:"Prompt dialog",id:"prompt"},{text:"Calendar dialog",id:"calendar"},{text:"Color picker dialog",id:"colorpicker"},{text:"Info dialog",id:"info"},{text:"YesNo dialog",id:"yesno"},{text:"Selection dialog",id:"selection"},{text:"About dialog",id:"about"},{text:"File dialog",id:"file"},{text:"Text dialog",id:"text"}]),t.set("onbtclick",t=>{var i;if(i=e.get("selectedItem"))switch(i.get("data").id){case"prompt":return this.openDialog("PromptDialog",{title:"Prompt review",value:"txt data",label:"enter value"}).then(t=>this.notify(t));case"calendar":return this.openDialog("CalendarDialog",{title:"Calendar"}).then(t=>this.notify(t));case"colorpicker":return this.openDialog("ColorPickerDialog").then(t=>this.notify(t));case"info":return this.openDialog("InfoDialog",{title:"Info application",name:"Show case",date:"10/12/2014",description:"the brown fox jumps over the lazy dog"}).then((function(t){}));case"yesno":return this.openDialog("YesNoDialog",{title:"Question ?",text:"Do you realy want to delete file ?"}).then(t=>this.notify(t));case"selection":return this.openDialog("SelectionDialog",{title:"Select data ?",data:[{text:"Option 1"},{text:"Option 2"},{text:"Option 3",iconclass:"fa fa-camera-retro fa-lg"}]}).then(t=>this.notify(t.text));case"about":return this.openDialog("AboutDialog").then(t=>{});case"file":return this.openDialog("FileDialog",{title:"Select file ?",mimes:["text/*","dir"],file:"Untitled".asFileHandle()}).then((t,e)=>this.notify(t,e));case"text":return this.openDialog("TextDialog",{title:"Text dialog review",value:"txt data"}).then(t=>this.notify(t))}})}mnFile(){return{text:"__(File)",child:[{text:"__(New file)",dataid:this.name+"-mkf",shortcut:"C-F"},{text:"__(New folder)",dataid:this.name+"-mkdir",shortcut:"C-D"},{text:"__(Open with)",dataid:this.name+"-open",child:this.apps},{text:"__(Upload)",dataid:this.name+"-upload",shortcut:"C-U"},{text:"__(Download)",dataid:this.name+"-download"},{text:"__(Share file)",dataid:this.name+"-share",shortcut:"C-S"},{text:"__(Properties)",dataid:this.name+"-info",shortcut:"C-I"}],onchildselect:t=>this.notify("child",t)}}mnEdit(){return{text:"__(Edit)",child:[{text:"__(Rename)",dataid:this.name+"-mv",shortcut:"C-R"},{text:"__(Delete)",dataid:this.name+"-rm",shortcut:"C-M"},{text:"__(Cut)",dataid:this.name+"-cut",shortcut:"C-X"},{text:"__(Copy)",dataid:this.name+"-copy",shortcut:"C-C"},{text:"__(Paste)",dataid:this.name+"-paste",shortcut:"C-P"}],onchildselect:t=>console.log("child",t)}}menu(){return[this.mnFile(),this.mnEdit(),{text:"__(View)",child:[{text:"__(Refresh)",dataid:this.name+"-refresh",onmenuselect:function(t){return console.log("select",t)}},{text:"__(Sidebar)",switch:!0,checked:!0},{text:"__(Navigation bar)",switch:!0,checked:!1},{text:"__(Hidden files)",switch:!0,checked:!0,dataid:this.name+"-hidden"},{text:"__(Type)",child:[{text:"__(Icon view)",radio:!0,checked:!0,dataid:this.name+"-icon",type:"icon"},{text:"__(List view)",radio:!0,checked:!1,dataid:this.name+"-list",type:"list"},{text:"__(Tree view)",radio:!0,checked:!1,dataid:this.name+"-tree",type:"tree"}],onchildselect:function(t){return console.log("child",t)}}],onchildselect:t=>console.log("child",t)}]}}).singleton=!0,this.OS.register("ShowCase",t)}).call(this);