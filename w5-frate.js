(function(){
"use strict";
function $(id){return document.getElementById(id);}
function toast(t,b,i){
  if(window.W5toast)return window.W5toast(t,b,i);
  var el=document.createElement("div");el.className="toast";
  el.textContent=(i||"")+" "+t+": "+b;
  document.body.appendChild(el);setTimeout(function(){el.remove();},2800);
}
function proxy(u){
  if(window.W5proxy)return window.W5proxy(u);
  return "https://translate.google.com/translate?hl=de&sl=auto&tl=de&u="+encodeURIComponent(u);
}
function buildDevTools(host, ctx){
  host.innerHTML=
    '<div style="display:flex;flex-direction:column;height:100%;background:#1e1e1e;color:#d4d4d4;font-family:Consolas,monospace;font-size:12px">'+
    '<div style="display:flex;gap:0;border-bottom:1px solid #333;background:#252526">'+
    '<button data-tab="console" class="dt-tab on" style="padding:8px 14px;background:#1e1e1e;color:#fff;border:none;border-bottom:2px solid #ff1b2d;cursor:pointer">Console</button>'+
    '<button data-tab="elements" class="dt-tab" style="padding:8px 14px;background:transparent;color:#aaa;border:none;cursor:pointer">Elements</button>'+
    '<button data-tab="network" class="dt-tab" style="padding:8px 14px;background:transparent;color:#aaa;border:none;cursor:pointer">Network</button>'+
    '<button data-tab="sources" class="dt-tab" style="padding:8px 14px;background:transparent;color:#aaa;border:none;cursor:pointer">Sources</button>'+
    '<button data-tab="app" class="dt-tab" style="padding:8px 14px;background:transparent;color:#aaa;border:none;cursor:pointer">Application</button>'+
    '</div>'+
    '<div id="dt_panel" style="flex:1;overflow:auto;padding:8px"></div></div>';
  var panel=host.querySelector("#dt_panel");
  var tabs=host.querySelectorAll(".dt-tab");
  function setTab(name){
    tabs.forEach(function(t){
      var on=t.getAttribute("data-tab")===name;
      t.classList.toggle("on",on);
      t.style.background=on?"#1e1e1e":"transparent";
      t.style.color=on?"#fff":"#aaa";
      t.style.borderBottom=on?"2px solid #ff1b2d":"none";
    });
    if(name==="console") showConsole();
    else if(name==="elements") showElements();
    else if(name==="network") showNetwork();
    else if(name==="sources") showSources();
    else if(name==="app") showApp();
  }
  function showConsole(){
    panel.innerHTML='<div id="dt_log" style="white-space:pre-wrap;line-height:1.5;min-height:60%"></div><div style="display:flex;gap:6px;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span style="color:#9cdcfe">></span><input id="dt_in" style="flex:1;background:#111;color:#d4d4d4;border:1px solid #444;padding:6px;border-radius:4px;outline:none" placeholder="JS eingeben…"><button id="dt_run" style="padding:6px 12px;background:#0e639c;color:#fff;border:none;border-radius:4px;cursor:pointer">Run</button></div>';
    var log=panel.querySelector("#dt_log");
    var inp=panel.querySelector("#dt_in");
    function writeln(s,col){log.innerHTML+='<div style="color:'+(col||'#d4d4d4')+'">'+s+'</div>';log.scrollTop=1e9;}
    writeln("Frate DevTools · Console bereit","#6a9955");
    writeln("Host: "+location.href,"#888");
    function run(){
      var code=inp.value;if(!code)return;
      writeln("> "+code,"#9cdcfe");
      try{var r=(0,eval)(code);writeln(String(r),"#ce9178");}
      catch(e){writeln(e.message,"#f14c4c");}
      inp.value="";
    }
    panel.querySelector("#dt_run").onclick=run;
    inp.onkeydown=function(e){e.stopPropagation();if(e.key==="Enter"){e.preventDefault();run();}};
  }
  function showElements(){
    var html=document.documentElement.outerHTML.slice(0,8000);
    panel.innerHTML='<div style="color:#808080;margin-bottom:6px">DOM Snapshot (Windos 5 Host)</div><pre style="margin:0;white-space:pre-wrap;word-break:break-all;color:#9cdcfe;font-size:11px"></pre>';
    panel.querySelector("pre").textContent=html+(html.length>=8000?"\n…":"");
  }
  function showNetwork(){
    var rows=[["GET",ctx&&ctx.url||"minefun.io","200","document"],["GET","assets/style.css","200","stylesheet"],["GET","pc-boot.js","200","script"],["GET","w5-games.js","200","script"]];
    var h='<table style="width:100%;border-collapse:collapse"><tr style="text-align:left;color:#888"><th>Method</th><th>Name</th><th>Status</th><th>Type</th></tr>';
    rows.forEach(function(r){h+='<tr style="border-top:1px solid #333"><td style="padding:4px;color:#4ec9b0">'+r[0]+'</td><td style="padding:4px">'+r[1]+'</td><td style="padding:4px;color:#6a9955">'+r[2]+'</td><td style="padding:4px;color:#888">'+r[3]+'</td></tr>';});
    panel.innerHTML=h+"</table>";
  }
  function showSources(){
    panel.innerHTML='<div style="margin-bottom:6px;color:#888">Code Editor · speichert als .js in VFS</div><textarea id="dt_src" style="width:100%;height:55%;background:#111;color:#d4d4d4;border:1px solid #444;padding:8px;font-family:Consolas,monospace;resize:vertical">// Frate Sources\nconsole.log("hello from Frate");\n</textarea><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><input id="dt_fname" value="script.js" style="background:#111;color:#fff;border:1px solid #444;padding:6px;border-radius:4px"><button id="dt_save" style="padding:6px 12px;background:#0e639c;color:#fff;border:none;border-radius:4px;cursor:pointer">Speichern</button><button id="dt_runsrc" style="padding:6px 12px;background:#16825d;color:#fff;border:none;border-radius:4px;cursor:pointer">Ausführen</button></div>';
    panel.querySelector("#dt_save").onclick=function(){
      var name=panel.querySelector("#dt_fname").value||"script.js";
      var code=panel.querySelector("#dt_src").value;
      try{
        if(window.W5FS&&window.W5FS.write)window.W5FS.write("/Desktop/"+name,code);
        else localStorage.setItem("w5_file_"+name,code);
        toast("Sources",name+" gespeichert","💾");
      }catch(e){toast("Fehler",e.message,"⚠️");}
    };
    panel.querySelector("#dt_runsrc").onclick=function(){
      try{(0,eval)(panel.querySelector("#dt_src").value);toast("Sources","OK","✅");}
      catch(e){toast("Fehler",e.message,"⚠️");}
    };
  }
  function showApp(){
    var ls=[];
    try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);ls.push(k+" ("+String(localStorage.getItem(k)).length+" B)");}}catch(e){}
    panel.innerHTML='<div style="color:#888;margin-bottom:6px">localStorage / VFS</div><pre style="margin:0;white-space:pre-wrap;color:#ce9178">'+ls.slice(0,40).join("\n")+'</pre>';
  }
  tabs.forEach(function(t){t.onclick=function(){setTab(t.getAttribute("data-tab"));};});
  setTab("console");
}
function frateApp(c,wid,startUrl){
  var url0=startUrl||"https://minefun.io";
  c.innerHTML='<div style="display:flex;flex-direction:column;height:100%;background:#0d0d0d"><div style="display:flex;gap:6px;padding:6px 8px;background:#1a1a1a;align-items:center;border-bottom:1px solid #333"><span style="color:#ff1b2d;font-weight:700;font-size:13px;letter-spacing:.5px">FRATE</span><button type="button" data-a="back" style="background:#222;color:#fff;border:1px solid #444;border-radius:6px;padding:4px 8px;cursor:pointer">←</button><button type="button" data-a="home" style="background:#222;color:#fff;border:1px solid #444;border-radius:6px;padding:4px 8px;cursor:pointer">⌂</button><input id="'+wid+'_url" value="'+url0+'" style="flex:1;background:#111;color:#eee;border:1px solid #444;border-radius:6px;padding:6px 10px;outline:none"><button type="button" data-a="go" style="background:#ff1b2d;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:600">Los</button><button type="button" data-a="px" style="background:#222;color:#fff;border:1px solid #444;border-radius:6px;padding:4px 8px;cursor:pointer" title="Proxy">🛡</button><button type="button" data-a="dt" style="background:#0e639c;color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;font-weight:600">🛠️ DevTools</button></div><div style="flex:1;display:flex;min-height:0"><div id="'+wid+'_pane" style="flex:1;position:relative;background:#000;min-width:0"></div><div id="'+wid+'_dt" style="width:0;overflow:hidden;border-left:1px solid #333;transition:width .2s"></div></div></div>';
  var pane=$(wid+"_pane"), dt=$(wid+"_dt"), inp=$(wid+"_url");
  var useProxy=false, hist=[], hi=-1, dtOpen=false;
  function nav(u, push){
    u=(u||"").trim();
    if(!u)return;
    if(!/^https?:\/\//i.test(u))u="https://"+u;
    inp.value=u;
    if(push!==false){hist=hist.slice(0,hi+1);hist.push(u);hi=hist.length-1;}
    pane.innerHTML="";
    var fr=document.createElement("iframe");
    var src=useProxy?proxy(u):u;
    if(/minefun\.io/i.test(u))src=u;
    fr.src=src;
    fr.allow="fullscreen; gamepad; autoplay";
    fr.setAttribute("allowfullscreen","true");
    fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#000";
    fr.dataset.w5px="1";
    fr.dataset.w5game="1";
    pane.appendChild(fr);
  }
  c.querySelector('[data-a="go"]').onclick=function(){nav(inp.value);};
  c.querySelector('[data-a="home"]').onclick=function(){nav("https://minefun.io");};
  c.querySelector('[data-a="back"]').onclick=function(){if(hi>0){hi--;nav(hist[hi],false);}};
  c.querySelector('[data-a="px"]').onclick=function(){useProxy=!useProxy;toast("Frate",useProxy?"Proxy an":"Proxy aus","🛡");nav(inp.value,false);};
  c.querySelector('[data-a="dt"]').onclick=function(){
    dtOpen=!dtOpen;
    dt.style.width=dtOpen?"42%":"0";
    if(dtOpen)buildDevTools(dt,{url:inp.value});
  };
  inp.onkeydown=function(e){e.stopPropagation();if(e.key==="Enter"){e.preventDefault();nav(inp.value);}};
  setTimeout(function(){
    dtOpen=true;dt.style.width="42%";
    buildDevTools(dt,{url:url0});
  },200);
  nav(url0);
}
function makeWindow(title, icon, w, h, builder){
  var wid="fr"+Date.now()+Math.floor(Math.random()*999);
  var wins=$("wins");if(!wins)return;
  var win=document.createElement("div");
  win.className="win focus";win.id=wid;
  win.style.cssText="left:18px;top:14px;width:min("+w+"px,98vw);height:min("+h+"px,92vh);z-index:5000";
  win.innerHTML='<div class="wt" data-drag="1"><span>'+icon+'</span><span class="t"> '+title+'</span><div class="wc"><button class="wb" data-a="max">□</button><button class="wb x">✕</button></div></div><div class="wbody" id="'+wid+'_c"></div>';
  wins.appendChild(win);
  win.querySelector(".x").onclick=function(){win.remove();};
  var mx=win.querySelector('[data-a="max"]');
  if(mx)mx.onclick=function(){win.classList.toggle("max");};
  builder($(wid+"_c"),wid);
  return wid;
}
function openFrate(url){
  makeWindow("Frate Web — "+(url||"minefun.io"),"🌐",980,680,function(c,wid){frateApp(c,wid,url||"https://minefun.io");});
}
function openMinefun(){openFrate("https://minefun.io");}
function openDevToolsOnly(){
  makeWindow("DevTools","🛠️",720,520,function(c){buildDevTools(c,{url:location.href});});
}
function addDesktopIcon(id,name,icon,fn){
  var cont=$("icons");if(!cont)return;
  if(cont.querySelector('[data-app="'+id+'"]'))return;
  var el=document.createElement("div");
  el.className="icon";
  el.dataset.app=id;
  el.innerHTML='<div class="ii">'+icon+'</div><div class="il">'+name+"</div>";
  el.style.pointerEvents="auto";
  var t=0;
  function open(){fn();}
  el.onclick=function(e){
    e.stopPropagation();
    if(el.dataset.skipOpen==="1")return;
    var n=Date.now();
    if(n-t<400){open();t=0;}
    else if(el.classList.contains("on"))open();
    else{document.querySelectorAll(".icon").forEach(function(x){x.classList.remove("on");});el.classList.add("on");t=n;}
  };
  el.ondblclick=open;
  cont.appendChild(el);
  if(window.W5enableIconFreeMove)setTimeout(window.W5enableIconFreeMove,50);
}
function waitDesk(cb){
  var n=0;
  (function tick(){
    var d=$("desk");
    if(d&&!d.classList.contains("hidden")){cb();return;}
    if(++n>400)return;
    setTimeout(tick,50);
  })();
}
waitDesk(function(){
  addDesktopIcon("frate","Frate Web","🌐",function(){openFrate("https://minefun.io");});
  addDesktopIcon("minefun","MineFun.io","⛏️",openMinefun);
  document.querySelectorAll(".icon").forEach(function(el){
    var lab=el.querySelector(".il");
    if(lab&&/DevTools/i.test(lab.textContent||"")){
      el.ondblclick=function(e){e.stopPropagation();openDevToolsOnly();};
      var t0=0;
      el.onclick=function(e){
        e.stopPropagation();
        if(el.dataset.skipOpen==="1")return;
        var n=Date.now();
        if(n-t0<400){openDevToolsOnly();t0=0;}
        else if(el.classList.contains("on"))openDevToolsOnly();
        else{document.querySelectorAll(".icon").forEach(function(x){x.classList.remove("on");});el.classList.add("on");t0=n;}
      };
    }
  });
  if(typeof window.openApp==="function"){
    var _oa=window.openApp;
    window.openApp=function(id,extra){
      if(id==="frate"||id==="minefun"){openFrate("https://minefun.io");return;}
      if(id==="devtools"){openDevToolsOnly();return;}
      return _oa.apply(this,arguments);
    };
  }
  toast("Frate","MineFun.io + DevTools bereit","🌐");
});
window.W5openFrate=openFrate;
window.W5openDevTools=openDevToolsOnly;
})();
