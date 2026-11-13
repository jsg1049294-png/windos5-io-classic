(function(){
"use strict";
function $(id){return document.getElementById(id);}
function toast(t,b,i){
  if(window.W5toast)return window.W5toast(t,b,i);
  var el=document.createElement("div");el.className="toast";
  el.textContent=(i||"")+" "+t+": "+b;
  document.body.appendChild(el);setTimeout(function(){el.remove();},2800);
}
var FALLBACK=[
  {name:"No Pain No Gain",sub:"Ragdoll · GD",url:"https://html5.gamedistribution.com/a8cc299a420147c08986ee18db66ca58/?gd_sdk_referrer_url=https://jsg1049294-png.github.io/windos-5/"},
  {name:"Worms Zone",sub:"Snake · GD",url:"https://html5.gamedistribution.com/5dd0b18fb81d49da82ff459f08737390/?gd_sdk_referrer_url=https://jsg1049294-png.github.io/windos-5/"},
  {name:"Ant Colony",sub:"io-style · GD",url:"https://html5.gamedistribution.com/fad887c9ef904dd080d3f38dcad90dbb/?gd_sdk_referrer_url=https://jsg1049294-png.github.io/windos-5/"},
  {name:"Sandboxels",sub:"Sandbox",url:"https://sandboxels.r74n.com"},
  {name:"Infinite Craft",sub:"Craft",url:"https://neal.fun/infinite-craft/"},
  {name:"Little Alchemy 2",sub:"Puzzle",url:"https://littlealchemy2.com"}
];
var gameList=null;
function loadCatalog(){
  if(gameList)return Promise.resolve(gameList);
  return fetch("https://playkovo.com/api/embed-games?format=json")
    .then(function(r){return r.json();})
    .then(function(data){
      var list=[];
      (data.games||[]).forEach(function(g){
        var url=g.embedUrl||"";
        if(!url)return;
        list.push({name:g.title||g.gameName||"Game",sub:"PlayKovo · HTML5",url:url,preview:g.thumbnailUrl||g.thumbnail||""});
      });
      list.sort(function(a,b){
        var ai=/io|snake|worm|tank|blob|hex/i.test(a.name)?0:1;
        var bi=/io|snake|worm|tank|blob|hex/i.test(b.name)?0:1;
        return ai-bi;
      });
      FALLBACK.forEach(function(f){list.unshift(f);});
      gameList=list;return list;
    })
    .catch(function(){gameList=FALLBACK.slice();return gameList;});
}
function openGame(g){
  var wid="wg"+Date.now();
  var wins=$("wins");if(!wins)return;
  var win=document.createElement("div");
  win.className="win focus";win.id=wid;
  win.style.cssText="left:24px;top:20px;width:min(960px,97vw);height:min(680px,88vh);z-index:5000";
  win.innerHTML='<div class="wt" data-drag="1"><span>🕹️</span><span class="t"> '+g.name+'</span><div class="wc"><button class="wb" data-a="max">□</button><button class="wb x">✕</button></div></div><div class="wbody" id="'+wid+'_c" style="position:relative;background:#000"></div>';
  wins.appendChild(win);
  win.querySelector(".x").onclick=function(){win.remove();};
  var mx=win.querySelector('[data-a="max"]');
  if(mx)mx.onclick=function(){win.classList.toggle("max");};
  var c=$(wid+"_c");
  var url=g.url;
  if(/^(https?:\/\/)?(www\.)?(agar|slither|diep|krunker|poki)\./i.test(url)){
    c.innerHTML='<div style="padding:20px;color:#eee">Original blockiert iframes. Wähle ein PlayKovo-.io aus der Liste.</div>';
    return;
  }
  var fr=document.createElement("iframe");
  fr.src=url;
  fr.allow="fullscreen; gamepad; autoplay";
  fr.setAttribute("allowfullscreen","true");
  fr.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;background:#000";
  fr.dataset.w5px="1";
  fr.dataset.w5game="1";
  c.innerHTML="";
  c.appendChild(fr);
}
function renderGamesFolder(c){
  c.innerHTML='<div class="gfolder"><h2>🕹️ Spiele</h2><p class="desc">Lade Katalog…</p><div class="ggrid" id="w5gg"></div></div>';
  loadCatalog().then(function(list){
    var desc=c.querySelector(".desc");
    if(desc)desc.textContent=list.length+" einbettbare Spiele (PlayKovo + GD)";
    var grid=c.querySelector("#w5gg")||c.querySelector(".ggrid");
    if(!grid)return;
    grid.innerHTML="";
    list.forEach(function(g){
      var b=document.createElement("button");
      b.type="button";b.className="gcard";
      var img=g.preview?'<img src="'+g.preview+'" loading="lazy" onerror="this.style.display=\'none\'">':'';
      b.innerHTML=img+'<div class="gn">'+g.name+'</div><div class="gs">'+g.sub+"</div>";
      b.onclick=function(){openGame(g);};
      grid.appendChild(b);
    });
  });
}
function watchGamesWindows(){
  new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes&&m.addedNodes.forEach(function(n){
        if(!n.querySelectorAll)return;
        var wins=n.classList&&n.classList.contains("win")?[n]:n.querySelectorAll(".win");
        wins.forEach(function(win){
          var t=win.querySelector(".t");
          if(!t)return;
          var title=(t.textContent||"").trim();
          if(title.indexOf("Spiele")<0)return;
          var body=win.querySelector(".wbody");
          if(!body||body.dataset.w5games==="1")return;
          body.dataset.w5games="1";
          renderGamesFolder(body);
        });
      });
    });
  }).observe(document.body,{childList:true,subtree:true});
}
function waitDesk(cb){
  var n=0;
  (function tick(){
    var d=$("desk");
    if(d&&!d.classList.contains("hidden")){cb();return;}
    if(++n>300)return;
    setTimeout(tick,60);
  })();
}
waitDesk(function(){
  watchGamesWindows();
  loadCatalog().then(function(list){toast("Spiele",list.length+" Spiele bereit","🕹️");});
});
window.W5openGame=openGame;
window.W5loadGameCatalog=loadCatalog;
})();
