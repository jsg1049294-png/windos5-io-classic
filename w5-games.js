(function(){
"use strict";
function $(id){return document.getElementById(id);}
function toast(t,b,i){
  if(window.W5toast)return window.W5toast(t,b,i);
  var el=document.createElement("div");el.className="toast";
  el.textContent=(i||"")+" "+t+": "+b;
  document.body.appendChild(el);setTimeout(function(){el.remove();},2800);
}
var REAL_IO=[
  {name:"Slither.io",sub:"Snake Multiplayer",url:"https://slither.io",icon:"🐍"},
  {name:"Diep.io",sub:"Tank Multiplayer",url:"https://diep.io",icon:"🔫"},
  {name:"Krunker.io",sub:"FPS Multiplayer",url:"https://krunker.io",icon:"🎯"},
  {name:"Shell Shockers",sub:"Egg FPS",url:"https://shellshock.io",icon:"🥚"},
  {name:"Skribbl.io",sub:"Draw & Guess",url:"https://skribbl.io",icon:"✏️"},
  {name:"Mope.io",sub:"Animal Evolution",url:"https://mope.io",icon:"🦊"},
  {name:"Territorial.io",sub:"Strategy Map",url:"https://territorial.io",icon:"🗺️"},
  {name:"ZombsRoyale.io",sub:"Battle Royale",url:"https://zombsroyale.io",icon:"💥"},
  {name:"Smash Karts",sub:"Kart Combat",url:"https://smashkarts.io",icon:"🏎️"},
  {name:"Bloxd.io",sub:"Voxel Multiplayer",url:"https://bloxd.io",icon:"🧱"},
  {name:"Survev.io",sub:"Surviv BR",url:"https://survev.io",icon:"🎒"},
  {name:"Ev.io",sub:"Sci-fi FPS",url:"https://ev.io",icon:"🚀"},
  {name:"Paper.io 2",sub:"Territory",url:"https://paper-io.com",icon:"📄"},
  {name:"Hole.io",sub:"Black Hole",url:"https://hole-io.com",icon:"⚫"},
  {name:"Agar.io",sub:"Cell Multiplayer",url:"https://agar.io",icon:"🟢"},
  {name:"Bonk.io",sub:"Physics Arena",url:"https://bonk.io",icon:"⭕"},
  {name:"1v1.LOL",sub:"Build Fight",url:"https://1v1.lol",icon:"🏗️"},
  {name:"Florr.io",sub:"Petals Arena",url:"https://florr.io",icon:"🌸"}
];
var GD=[
  {name:"No Pain No Gain",sub:"Ragdoll Sandbox",url:"https://html5.gamedistribution.com/a8cc299a420147c08986ee18db66ca58/?gd_sdk_referrer_url=https://jsg1049294-png.github.io/windos-5/",icon:"🤕"},
  {name:"Worms Zone (GD)",sub:"Snake · embed",url:"https://html5.gamedistribution.com/5dd0b18fb81d49da82ff459f08737390/?gd_sdk_referrer_url=https://jsg1049294-png.github.io/windos-5/",icon:"🪱"}
];
function openGame(g){
  var wid="wg"+Date.now();
  var wins=$("wins");if(!wins)return;
  var win=document.createElement("div");
  win.className="win focus";win.id=wid;
  win.style.cssText="left:20px;top:16px;width:min(980px,98vw);height:min(700px,90vh);z-index:5000";
  win.innerHTML='<div class="wt" data-drag="1"><span>'+(g.icon||"🕹️")+'</span><span class="t"> '+g.name+'</span><div class="wc"><button class="wb" data-a="px" title="Proxy">🛡</button><button class="wb" data-a="max">□</button><button class="wb x">✕</button></div></div><div class="wbody" id="'+wid+'_c" style="position:relative;background:#111"></div>';
  wins.appendChild(win);
  win.querySelector(".x").onclick=function(){win.remove();};
  var mx=win.querySelector('[data-a="max"]');
  if(mx)mx.onclick=function(){win.classList.toggle("max");};
  var c=$(wid+"_c");
  var raw=g.url;
  function load(src){
    c.innerHTML="";
    var fr=document.createElement("iframe");
    fr.src=src;
    fr.allow="fullscreen; gamepad; autoplay; clipboard-write";
    fr.setAttribute("allowfullscreen","true");
    fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#000";
    fr.dataset.w5px="1";
    fr.dataset.w5game="1";
    c.appendChild(fr);
    setTimeout(function(){
      if(c.querySelector(".w5-io-help"))return;
      var help=document.createElement("div");
      help.className="w5-io-help";
      help.style.cssText="position:absolute;bottom:10px;left:10px;right:10px;z-index:6;background:rgba(0,0,0,.82);color:#eee;padding:10px 12px;border-radius:8px;font-size:13px;display:flex;gap:8px;align-items:center;flex-wrap:wrap";
      help.innerHTML='<span style="flex:1">Wenn schwarz/weiß: Spiel blockiert iframes. Proxy-Button oben versuchen.</span><button type="button" data-a="retry" style="padding:6px 10px;background:#ff1b2d;color:#fff;border:none;border-radius:6px;cursor:pointer">Proxy</button>';
      help.querySelector("[data-a=retry]").onclick=function(){load("https://translate.google.com/translate?hl=de&sl=auto&tl=de&u="+encodeURIComponent(raw));};
      c.appendChild(help);
      setTimeout(function(){if(help.parentNode)help.remove();},12000);
    },4000);
  }
  win.querySelector('[data-a="px"]').onclick=function(){
    load("https://translate.google.com/translate?hl=de&sl=auto&tl=de&u="+encodeURIComponent(raw));
  };
  load(raw);
}
function renderGamesFolder(c){
  c.innerHTML='<div class="gfolder"><h2>🕹️ Echte .io Spiele</h2><p class="desc">Offizielle Multiplayer-.io (Slither, Diep, Krunker…). Keine Fake-Snake-Klone.</p><div class="ggrid" id="w5gg"></div><h2 style="margin-top:18px">📦 Extra (immer embedbar)</h2><div class="ggrid" id="w5gg2"></div></div>';
  function fill(id,list){
    var grid=$(id);if(!grid)return;
    grid.innerHTML="";
    list.forEach(function(g){
      var b=document.createElement("button");
      b.type="button";b.className="gcard";
      b.innerHTML='<div class="gn">'+(g.icon?g.icon+" ":"")+g.name+'</div><div class="gs">'+g.sub+"</div>";
      b.onclick=function(){openGame(g);};
      grid.appendChild(b);
    });
  }
  fill("w5gg",REAL_IO);
  fill("w5gg2",GD);
}
function watchGamesWindows(){
  new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes&&m.addedNodes.forEach(function(n){
        if(!n.querySelectorAll&&!(n.classList&&n.classList.contains("win")))return;
        var wins=n.classList&&n.classList.contains("win")?[n]:(n.querySelectorAll?[].slice.call(n.querySelectorAll(".win")):[]);
        wins.forEach(function(win){
          var t=win.querySelector(".t");
          if(!t||(t.textContent||"").indexOf("Spiele")<0)return;
          var body=win.querySelector(".wbody");
          if(!body||body.dataset.w5games==="1")return;
          body.dataset.w5games="1";
          renderGamesFolder(body);
        });
      });
    });
  }).observe(document.body,{childList:true,subtree:true});
}
function waitDesk(cb){var n=0;(function tick(){var d=$("desk");if(d&&!d.classList.contains("hidden")){cb();return;}if(++n>300)return;setTimeout(tick,60);})();}
waitDesk(function(){watchGamesWindows();toast("Spiele",REAL_IO.length+" echte .io Spiele","🕹️");});
window.W5openGame=openGame;
})();
