var OS;!function(t){let i,e;i=t.API||(t.API={}),function(t){class e extends t.BaseApplication{constructor(t){super("GitGraph",t),t&&t[0]&&(this.curr_repo=t[0].path.asFileHandle(),"file"===t[0].type&&(this.curr_repo=this.curr_repo.parent()))}main(){this.graph=new i.LibGitGraph({target:this.find("git-graph")}),this.graph.on_open_diff=t=>{this._gui.launch("Antedit",[]).then(i=>{i.observable.one("launched",()=>i.openDiff(t))}).catch(t=>this.error(__("Unable to open diff with Antedit: {0}",t.toString()),t))},this.find("btn-open").onbtclick=t=>{this.openDialog("FileDialog",{title:__("Select a repository"),type:"dir"}).then(t=>{this.setRepo(t.file)})},this.setRepo(this.curr_repo)}setRepo(t){t&&(this.find("txt-repo").text=t.path,this.curr_repo=t,this.graph.base_dir=t)}}t.GitGraph=e,e.dependencies=["pkg://GitGraph/libgitgraph.js"]}(e=t.application||(t.application={}))}(OS||(OS={}));