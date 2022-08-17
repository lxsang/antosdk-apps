(function(){var e,t,n,s;(e=class e extends this.OS.GUI.BasicDialog{constructor(){super("ConnectionDialog",e.scheme)}main(){return super.main(),this.find("jq").value=40,this.find("bt-ok").onbtclick=e=>{var t;if(this.handle)return t={wvnc:this.find("txtWVNC").value,server:this.find("txtServer").value,quality:this.find("jq").value},this.handle(t),this.quit()},this.find("bt-cancel").onbtclick=e=>this.quit()}}).scheme='<afx-app-window width=\'350\' height=\'220\'>\n    <afx-hbox>\n        <div data-width="5"></div>\n        <afx-vbox>\n            <afx-label text="__(WVNC Websocket)" data-height="25" class="header" ></afx-label>\n            <input data-height="25" data-id="txtWVNC" value="wss://app.iohub.dev/wbs/wvnc"></input>\n            <afx-label text="__(VNC Server)" data-height="25" class="header" ></afx-label>\n            <input data-height="25" data-id="txtServer" value="192.168.1.27:5900"></input>\n            <div data-height="5"></div>\n            <afx-label text="__(JPEG quality)" data-height="25" class="header" ></afx-label>\n            <afx-slider data-id ="jq" data-height="25" ></afx-slider>\n            <afx-hbox data-height = \'30\'>\n                <div  style=\' text-align:right;\'>\n                    <afx-button data-id = "bt-ok" text = "__(Connect)"></afx-button>\n                    <afx-button data-id = "bt-cancel" text = "__(Cancel)"></afx-button>\n                </div>\n                <div data-width="5"></div>\n            </afx-hbox>\n        </afx-vbox>\n        <div data-width="5"></div>\n    </afx-hbox>\n</afx-app-window>\n',(t=class e extends this.OS.GUI.BasicDialog{constructor(){super("CredentialDialog",e.scheme)}main(){return this.find("bt-ok").onbtclick=()=>{var e;return this.handle?(e={username:this.find("txtUser").value,password:this.find("txtPass").value},this.handle(e),this.quit()):this.quit()},this.find("bt-cancel").onbtclick=()=>this.quit()}}).scheme='<afx-app-window width=\'350\' height=\'150\'>\n    <afx-vbox>\n        <afx-label text="__(Username)" data-height="25" class="header" ></afx-label>\n        <input data-height="30" data-id="txtUser"></input>\n        <afx-label text="__(Password)" data-height="25" class="header" ></afx-label>\n        <input type="password" data-height="30" data-id="txtPass"></input>\n        <afx-hbox data-height = \'30\'>\n            <div  style=\' text-align:right;\'>\n                <afx-button data-id = "bt-ok" text = "__(Ok)"></afx-button>\n                <afx-button data-id = "bt-cancel" text = "__(Cancel)"></afx-button>\n            </div>\n            <div data-width="5"></div>\n        </afx-hbox>\n    </afx-vbox>\n</afx-app-window>',n=class extends this.OS.application.BaseApplication{constructor(e){super("RemoteDesktop",e)}main(){return this.canvas=this.find("screen"),this.container=this.find("container"),this.client=new s({element:this.canvas}),this.bindKey("CTRL-SHIFT-V",e=>this.pasteText()),this.client.onerror=e=>(this.error(e),this.showConnectionDialog()),this.client.onresize=()=>this.setScale(),this.client.onpassword=()=>new Promise((e,t)=>this.openDialog("PromptDialog",{title:__("VNC password"),label:__("VNC password"),value:"password",type:"password"}).then((function(t){return e(t)}))),this.client.oncopy=e=>this._api.setClipboard(e),this.client.oncredential=()=>new Promise((e,n)=>this.openDialog(new t,{title:__("User credential")}).then((function(t){return e(t.username,t.password)}))),this.on("resize",e=>this.setScale()),this.on("focus",e=>$(this.canvas).focus()),this.client.init().then(()=>this.showConnectionDialog())}pasteText(){var e;if(this.client)return e=e=>{if(e&&""!==e)return this.client.sendTextAsClipboard(e)},this._api.getClipboard().then(t=>e(t)).catch(t=>(this.error(__("Unable to paste"),t),this.openDialog("TextDialog",{title:"Paste text"}).then(t=>e(t)).catch(e=>this.error(e.toString(),e))))}setScale(){var e,t,n,s;if(this.client&&this.client.resolution)return s=$(this.container).width(),e=$(this.container).height(),(t=s/this.client.resolution.w)>(n=e/this.client.resolution.h)?this.client.setScale(n):this.client.setScale(t)}menu(){return[{text:"__(Connection)",nodes:[{text:"__(New Connection)",dataid:this.name+"-new"},{text:"__(Disconnect)",dataid:this.name+"-close"}],onchildselect:e=>this.actionConnection()}]}actionConnection(e){return this.client&&this.client.disconnect(!1),this.showConnectionDialog()}showConnectionDialog(){return this.openDialog(new e,{title:__("Connection")}).then(e=>(this.client.ws=e.wvnc,this.client.connect(e.server,e)))}cleanup(){if(this.client)return this.client.disconnect(!0)}},this.OS.register("RemoteDesktop",n),s=class{constructor(e){var t,n;this.socket=void 0,this.ws=void 0,this.canvas=void 0,n="pkg://RemoteDesktop/decoder_asm.js".asFileHandle().getlink(),this.scale=1,e.ws&&(this.ws=e.ws),this.canvas=e.element,"string"==typeof this.canvas&&(this.canvas=document.getElementById(this.canvas)),this.decoder=new Worker(n),this.enableEvent=!1,this.pingto=!1,t=this,this.mouseMask=0,this.decoder.onmessage=function(e){return t.process(e.data)}}init(){var e;return e=this,new Promise((function(t,n){return e.canvas?($(e.canvas).attr("tabindex","1"),$(e.canvas).on("focus",()=>e.resetModifierKeys()),e.initInputEvent(),t()):n("Canvas is not set")}))}initInputEvent(){var e,t,n,s;if(n=this,this.canvas&&(t=function(e){var t;return t=n.canvas.getBoundingClientRect(),{x:Math.floor((e.clientX-t.left)/n.scale),y:Math.floor((e.clientY-t.top)/n.scale)}},s=function(e){var s;if(n.enableEvent)return s=t(e),n.sendPointEvent(s.x,s.y,n.mouseMask)},n.canvas))return n.canvas.oncontextmenu=function(e){return e.preventDefault(),!1},n.canvas.onmousemove=function(e){return s(e)},n.canvas.onmousedown=function(e){var t;return t=1<<e.button,n.mouseMask=n.mouseMask|t,s(e)},n.canvas.onmouseup=function(e){var t;return t=1<<e.button,n.mouseMask=n.mouseMask&~t,s(e)},n.canvas.onkeydown=n.canvas.onkeyup=function(e){var t;switch(e.keyCode){case 8:t=65288;break;case 9:t=65289;break;case 13:t=65293;break;case 27:t=65307;break;case 46:t=65535;break;case 38:t=65362;break;case 40:t=65364;break;case 37:t=65361;break;case 39:t=65363;break;case 91:t=65511;break;case 93:t=65512;break;case 16:t=65505;break;case 17:t=65507;break;case 18:t=65513;break;case 20:t=65509;break;case 113:t=65471;break;case 112:t=65470;break;case 114:t=65472;break;case 115:t=65473;break;case 116:t=65474;break;case 117:t=65475;break;case 118:t=65476;break;case 119:t=65477;break;case 120:t=65478;break;case 121:t=65479;break;case 122:t=65480;break;case 123:t=65481;break;default:t=e.key.charCodeAt(0)}if(e.preventDefault(),t)return"keydown"===e.type?n.sendKeyEvent(t,1):"keyup"===e.type?n.sendKeyEvent(t,0):void 0},this.canvas.addEventListener("wheel",(function(e){var s;if(n.enableEvent)return s=t(e),e.preventDefault(),e.deltaY<0?(n.sendPointEvent(s.x,s.y,8),void n.sendPointEvent(s.x,s.y,0)):(n.sendPointEvent(s.x,s.y,16),n.sendPointEvent(s.x,s.y,0))})),this.canvas.onpaste=function(e){var t;if(n.enableEvent)return t=void 0,window.clipboardData&&window.clipboardData.getData?t=window.clipboardData.getData("Text"):e.clipboardData&&e.clipboardData.getData&&(t=e.clipboardData.getData("text/plain")),!!t&&(e.preventDefault(),n.sendTextAsClipboard(t))},e=e=>this.disconnect(!0),window.addEventListener("unload",e),window.addEventListener("beforeunload",e)}initCanvas(e,t,n){return this.depth=n,this.canvas.width=e,this.canvas.height=t,this.resolution={w:e,h:t,depth:this.depth},this.decoder.postMessage(this.resolution),this.setScale(this.scale)}process(e){var t,n,s;if(this.socket)return n=new Uint8Array(e.pixels),(s=(t=this.canvas.getContext("2d",{alpha:!1})).createImageData(e.w,e.h)).data.set(n),t.putImageData(s,e.x,e.y)}setScale(e){if(this.scale=e,this.canvas)return this.canvas.style.transformOrigin="0 0",this.canvas.style.transform="scale("+e+")"}connect(e,t){var n;if(n=this,this.disconnect(!1),this.ws)return this.socket=new WebSocket(this.ws),this.socket.binaryType="arraybuffer",this.socket.onopen=function(){return console.log("socket opened"),n.initConnection(e,t)},this.socket.onmessage=function(e){return n.consume(e)},this.socket.onclose=function(){return n.socket=null,n.canvas.style.cursor="auto",n.canvas&&n.resolution&&n.canvas.getContext("2d").clearRect(0,0,n.resolution.w,n.resolution.h),n.pingto&&clearTimeout(n.pingto),n.pingto=void 0,console.log("socket closed")}}disconnect(e){return this.socket&&this.socket.close(),this.socket=void 0,e&&this.decoder.terminate(),this.enableEvent=!1}initConnection(e,t){var n;return(n=new Uint8Array(e.length+1))[0]=50,t&&t.quality&&(n[0]=t.quality),n.set((new TextEncoder).encode(e),1),this.socket.send(this.buildCommand(1,n))}resetModifierKeys(){if(this.socket&&this.enableEvent)return this.sendKeyEvent(65511,0),this.sendKeyEvent(65512,0),this.sendKeyEvent(65505,0),this.sendKeyEvent(65507,0),this.sendKeyEvent(65513,0)}sendPointEvent(e,t,n){var s;if(this.socket&&this.enableEvent)return(s=new Uint8Array(5))[0]=255&e,s[1]=e>>8,s[2]=255&t,s[3]=t>>8,s[4]=n,this.socket.send(this.buildCommand(5,s))}sendKeyEvent(e,t){var n;if(this.socket&&this.enableEvent)return(n=new Uint8Array(3))[0]=255&e,n[1]=e>>8&255,n[2]=t,this.socket.send(this.buildCommand(6,n))}sendPing(){if(this.socket)return this.socket.send(this.buildCommand(8,"PING WVNC"))}buildCommand(e,t){var n,s;switch(s=void 0,typeof t){case"string":s=(new TextEncoder).encode(t);break;case"number":s=new Uint8Array([t]);break;default:s=t}return(n=new Uint8Array(s.length+3))[0]=e,n[2]=s.length>>8,n[1]=15&s.length,n.set(s,3),n.buffer}oncopy(e){return console.log("Get clipboard text: "+e)}onpassword(){return new Promise((function(e,t){return t("onpassword is not implemented")}))}sendTextAsClipboard(e){var t;if(this.socket)return this.socket.send(this.buildCommand(7,e)),t="v".charCodeAt(0),this.sendKeyEvent(65507,1),this.sendKeyEvent(t,1),this.sendKeyEvent(t,0),this.sendKeyEvent(65507,0)}oncredential(){return new Promise((function(e,t){return t("oncredential is not implemented")}))}onerror(e){return console.log("Error",e)}onresize(){return console.log("resize")}consume(e){var t,n,s,i,a,o,r;switch(t=(n=new Uint8Array(e.data))[0],o=this,t){case 254:return n=n.subarray(1,n.length-1),s=new TextDecoder("utf-8"),this.onerror(s.decode(n));case 129:return console.log("Request for password"),this.enableEvent=!1,this.onpassword().then((function(e){return o.socket.send(o.buildCommand(2,e)),o.enableEvent=!0}));case 130:return console.log("Request for login"),this.enableEvent=!1,this.oncredential().then((function(e,t){var n;return(n=new Uint8Array(e.length+t.length+1)).set((new TextEncoder).encode(e),0),n.set(["\0"],e.length),n.set((new TextEncoder).encode(t),e.length+1),o.socket.send(o.buildCommand(3,n)),o.enableEvent=!0}));case 131:if(r=n[1]|n[2]<<8,a=n[3]|n[4]<<8,this.initCanvas(r,a,32),this.socket.send(this.buildCommand(4,1)),this.enableEvent=!0,this.onresize(),this.pingto)return;return i=()=>(this.sendPing(),this.pingto=setTimeout(i,5e3)),this.pingto=setTimeout(i,5e3);case 132:return this.decoder.postMessage(n.buffer,[n.buffer]),this.socket.send(this.buildCommand(4,1));case 133:return n=n.subarray(1),s=new TextDecoder("utf-8"),this.oncopy(s.decode(n)),this.socket.send(this.buildCommand(4,1));default:return console.log(t)}}},window.WVNC=s}).call(this);