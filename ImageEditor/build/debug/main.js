(function(){var i;(i=class extends this.OS.application.BaseApplication{constructor(i){super("ImageEditor",i),this.currfile=void 0,this.args&&this.args.length>0&&this.args[0].path&&(this.currfile=i[0].path.asFileHandle())}main(){var i;return this.stage=this.find("stage"),this.stage.id=this.eid,i={path:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",name:"Blank"},this.currfile&&(i={path:this.currfile.getlink(),name:this.currfile.filename},this.scheme.apptitle=this.currfile.path),this.editor=new tui.ImageEditor(this.stage,{cssMaxWidth:700,cssMaxHeight:500,usageStatistics:!1,includeUI:{initMenu:"filter",menuBarPosition:"bottom",loadImage:i}}),this.on("resize",()=>this.editor.ui.resizeEditor()),this.editor.ui.resizeEditor(),this.bindKey("ALT-O",()=>this.actionFile("open")),this.bindKey("CTRL-S",()=>this.actionFile("save")),this.bindKey("ALT-W",()=>this.actionFile("saveas"))}open(){if(this.currfile)return this.editor.loadImageFromURL(this.currfile.getlink(),this.currfile.filename).then(i=>(this.scheme.apptitle=this.currfile.path,this.editor.ui.resizeEditor({imageSize:{oldWidth:i.oldWidth,oldHeight:i.oldHeight,newWidth:i.newWidth,newHeight:i.newHeight}})))}save(){if(this.currfile)return this.currfile.cache=this.editor.toDataURL(),this.currfile.write("base64").then(i=>i.error?this.error(__("Error saving file {0}: {1}",this.currfile.basename,i.error)):this.notify(__("File saved: {0}",this.currfile.path))).catch(i=>this.error(__("Unable to save file: {0}",this.currfile.path),i))}cleanup(){if(this.editor)return this.editor.destroy()}menu(){return[{text:"__(File)",nodes:[{text:"__(Open)",dataid:"open",shortcut:"A-O"},{text:"__(Save)",dataid:"save",shortcut:"C-S"},{text:"__(Save as)",dataid:"saveas",shortcut:"A-W"}],onchildselect:i=>this.actionFile(i.data.item.data.dataid)}]}actionFile(i){switch(i){case"open":return this.openDialog("FileDialog",{title:__("Open file"),mimes:["image/.*"]}).then(i=>(this.currfile=i.file.path.asFileHandle(),this.open()));case"save":return this.save();case"saveas":return this.openDialog("FileDialog",{title:__("Save as"),file:this.currfile}).then(i=>{var e;return e=i.file.path.asFileHandle(),"file"===i.file.type&&(e=e.parent()),this.currfile=`${e.path}/${i.name}`.asFileHandle(),this.save()})}}}).dependencies=["pkg://libfabric/main.js","pkg://ImageEditor/tui-image-ed-bundle.min.js"],this.OS.register("ImageEditor",i)}).call(this);