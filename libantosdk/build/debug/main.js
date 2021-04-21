var OS;!function(e){let t;!function(t){class r{constructor(t){this.worker=new Worker(t.asFileHandle().getlink()),this.jobs={},this.worker.onmessage=e=>{let t=e.data,r=this.jobs[t.id];r?"log"===t.type?r.logger&&(t.error?r.logger.error(t.result):r.logger.info(t.result)):(r.callback(t),delete this.jobs[t.id]):console.log("Unable to identify result of job",t.id,t)};const r={};for(const t in e.setting.system.packages){const o=e.setting.system.packages[t];r[t]={path:o.path,name:o.pkgname}}this.submit("sdk-setup",{REST:e.API.REST,pkgs:r})}newJobID(){return"job_"+Math.random().toString(36).replace(".","")}exectue_job(e,t,r,o,s){const n=this.newJobID(),i={id:n,cmd:e,data:t,root:r};this.jobs[n]={callback:o,logger:s},this.worker.postMessage(i)}submit(e,t,r,o){return new Promise((s,n)=>{this.exectue_job(e,t,r,e=>{if(e.error)return n(e.error);s(e.result)},o)})}terminate(){this.worker.terminate()}}class o{constructor(e,t){this.root=t,this.logger=e,o.worker||(o.worker=new r("pkg://libantosdk/core/worker.js"))}require(e){return this.run("sdk-import",e.map(e=>e+".worker.js"))}compile(e,t){return new Promise(async(r,o)=>{try{await this.require([e]),r(await this.run(e+"-compile",t))}catch(e){o(__e(e))}})}run(t,r){return"sdk-run-app"===t?new Promise(async(t,o)=>{try{let o=r;1==o.split("://").length&&(o=`${this.root}/${r}`);const s=await(o+"/package.json").asFileHandle().read("json");return s.text=s.name,s.path=o,s.filename=s.pkgname,s.type="app",s.mime="antos/app",s.icon&&(s.icon=`${s.path}/${s.icon}`),s.iconclass||s.icon||(s.iconclass="fa fa-adn"),this.logger.info(__("Installing...")),e.setting.system.packages[s.pkgname]=s,s.app?(this.logger.info(__("Running {0}...",s.app)),e.GUI.forceLaunch(s.app,[])):this.logger.error(__("{0} is not an application",s.pkgname)),t(void 0)}catch(e){o(e)}}):o.worker.submit(t,r,this.root,this.logger)}batch(e,t){return t.root&&(this.root=t.root),new Promise(async(r,o)=>{try{t.targets||o("No target found");for(const r of e){const e=t.targets[r];if(!e)return o(__("No target: "+r));if(e.depend&&await this.batch(e.depend,t),e.require&&await this.require(e.require),this.logger&&this.logger.info(__(`### RUNNING STAGE: ${r}###`).__()),e.jobs)for(const t of e.jobs)await this.run(t.name,t.data)}r(void 0)}catch(e){o(e)}})}}let s;t.AntOSDKBuilder=o,function(e){class t extends e.RemoteFileHandle{constructor(e){super(e);const t="pkg://libantosdk/"+this.genealogy.join("/");this.setPath(t.asFileHandle().path)}}e.SDKFileHandle=t,e.register("^sdk$",t)}(s=t.VFS||(t.VFS={}))}(t=e.API||(e.API={}))}(OS||(OS={}));