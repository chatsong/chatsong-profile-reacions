(function(){
var SHEETS_URL = "https://script.google.com/macros/s/AKfycbx8Cg-TxX1zhMooAeNimFevcyT-ginZN-lKBLxSzgHFQnVzPDHwUcNClfR505ZKiRil/exec";
var em = [{e:"🔥",n:"Fire",c:"#ff5500"},{e:"❤️",n:"Love",c:"#ff4444"},{e:"🎵",n:"Banger",c:"#1DB954"},{e:"👏",n:"Respect",c:"#8A2BE2"},{e:"🎤",n:"Vocals",c:"#ff69b4"},{e:"🎧",n:"Producer",c:"#00bfff"},{e:"🚀",n:"Next Level",c:"#ffd700"}];

function jsonp(url){
  return new Promise(function(resolve){
    var cb = "cs" + Date.now() + Math.random().toString(36).substr(2,4);
    window[cb] = function(d){ delete window[cb]; resolve(d || []); };
    var s = document.createElement("script");
    s.src = url + "&callback=" + cb;
    s.onerror = function(){ delete window[cb]; resolve([]); };
    document.head.appendChild(s);
    setTimeout(function(){ delete window[cb]; resolve([]); }, 10000);
  });
}

function init(){
  var prof = document.querySelector(".UserPage,.UserCard");
  if(!prof || prof.dataset.cs) return;
  var bio = prof.querySelector(".item-bio,.UserBio");
  if(!bio) return;
  prof.dataset.cs = "1";
  
  var un = prof.querySelector(".username");
  var user = un ? un.textContent.trim() : "user";
  var vid = localStorage.getItem("cs-v") || "v" + Math.random().toString(36).substr(2,6);
  localStorage.setItem("cs-v", vid);
  var myR = parseInt(localStorage.getItem("cs-r-"+user)) || 0;
  var myE = JSON.parse(localStorage.getItem("cs-e-"+user) || "[]");
  var localShouts = JSON.parse(localStorage.getItem("cs-s-"+user) || "[]");

  var w = document.createElement("div");
  w.style = "margin-top:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px;";
  w.innerHTML = '<div style="font-weight:800;font-size:15px;color:#fff;margin-bottom:12px;">🏆 Artist Endorsements</div><div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;"><div style="text-align:center;min-width:50px;"><div style="font-size:28px;font-weight:900;color:#FFD700;" id="ca-'+user+'">—</div><div style="font-size:10px;color:#888;" id="cn-'+user+'">loading</div></div><div style="flex:1;display:flex;gap:2px;font-size:22px;" id="st-'+user+'"></div></div><div style="font-size:11px;color:#aaa;margin-bottom:12px;">Community Badges:</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;" id="eb-'+user+'"></div><div style="font-size:11px;color:#aaa;margin-bottom:8px;">Fan Shoutouts:</div><div id="sg-'+user+'" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;max-height:180px;overflow-y:auto;"></div><div style="display:flex;gap:6px;margin-top:10px;"><input id="si-'+user+'" maxlength="60" placeholder="Drop a shout..." style="flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 10px;color:#fff;font-size:12px;"><button id="sb-'+user+'" style="background:#1DB954;border:none;border-radius:8px;padding:8px 12px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;">Post</button></div>';
  bio.parentNode.insertBefore(w, bio.nextSibling);

  var st = document.getElementById("st-"+user);
  for(var i=1;i<=5;i++){
    var s = document.createElement("span");
    s.textContent = "★";
    s.style = "cursor:pointer;color:"+(i<=myR?"#FFD700":"#444")+";";
    s.onclick = (function(v){return function(){
      localStorage.setItem("cs-r-"+user,v); myR=v;
      for(var j=0;j<5;j++) st.children[j].style.color = j<v?"#FFD700":"#444";
      jsonp(SHEETS_URL+"?action=rate&artist="+encodeURIComponent(user)+"&vid="+vid+"&rating="+v);
      document.getElementById("ca-"+user).textContent = v+".0";
    };})(i);
    st.appendChild(s);
  }

  var eb = document.getElementById("eb-"+user);
  em.forEach(function(m){
    var b = document.createElement("button");
    var on = myE.indexOf(m.e)>-1;
    b.style = "background:"+(on?m.c+"25":"rgba(255,255,255,.04)")+";border:1px solid "+(on?m.c+"60":"rgba(255,255,255,.08)")+";color:"+(on?m.c:"#ddd")+";border-radius:20px;padding:5px 12px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:4px;font-weight:700;font-family:inherit;";
    b.innerHTML = '<span style="font-size:16px;">'+m.e+'</span><span>'+m.n+'</span><span style="background:rgba(0,0,0,.3);padding:1px 6px;border-radius:8px;font-size:10px;color:#fff;" id="ec-'+user+'-'+m.e+'">—</span>';
    b.onclick = function(){
      var ix = myE.indexOf(m.e);
      if(ix>-1){myE.splice(ix,1);b.style.background="rgba(255,255,255,.04)";b.style.borderColor="rgba(255,255,255,.08)";b.style.color="#ddd";jsonp(SHEETS_URL+"?action=unreact&artist="+encodeURIComponent(user)+"&vid="+vid+"&emoji="+encodeURIComponent(m.e));}
      else{myE.push(m.e);b.style.background=m.c+"25";b.style.borderColor=m.c+"60";b.style.color=m.c;jsonp(SHEETS_URL+"?action=react&artist="+encodeURIComponent(user)+"&vid="+vid+"&emoji="+encodeURIComponent(m.e));}
      localStorage.setItem("cs-e-"+user,JSON.stringify(myE));
    };
    eb.appendChild(b);
  });

  var sg = document.getElementById("sg-"+user);
  
  function renderShouts(shouts){
    if(!shouts || !shouts.length) sg.innerHTML = '<div style="color:#666;font-size:11px;text-align:center;padding:10px;">No shoutouts yet. Be the first!</div>';
    else sg.innerHTML = shouts.map(function(s){return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:8px;font-size:11px;color:#ddd;"><div style="font-weight:700;color:#fff;margin-bottom:3px;">'+s.text+'</div><div style="font-size:9px;color:#888;">'+(s.visitor||"Fan")+' • '+(s.date||"recent")+'</div></div>';}).join("");
  }
  
  renderShouts(localShouts);
  
  document.getElementById("sb-"+user).onclick = function(){
    var inp = document.getElementById("si-"+user);
    var txt = inp.value.trim(); if(!txt) return;
    jsonp(SHEETS_URL+"?action=shoutout&artist="+encodeURIComponent(user)+"&vid="+vid+"&text="+encodeURIComponent(txt));
    localShouts.push({text:txt, visitor:"You", date:"Just now"});
    localStorage.setItem("cs-s-"+user, JSON.stringify(localShouts));
    renderShouts(localShouts);
    inp.value = "";
  };

  jsonp(SHEETS_URL+"?action=getRatings&artist="+encodeURIComponent(user)).then(function(d){
    document.getElementById("ca-"+user).textContent = (d && d.avg) ? d.avg : "0.0";
    document.getElementById("cn-"+user).textContent = (d && d.count) ? d.count+" ratings" : "0 ratings";
  });
  jsonp(SHEETS_URL+"?action=getReactions&artist="+encodeURIComponent(user)).then(function(d){
    em.forEach(function(m){
      var el = document.getElementById("ec-"+user+"-"+m.e);
      if(el && d) el.textContent = d[m.e] || 0;
    });
  });
  jsonp(SHEETS_URL+"?action=getShoutouts&artist="+encodeURIComponent(user)).then(function(d){
    if(d && d.length) {
      var merged = d.concat(localShouts.filter(function(ls){ return !d.some(function(ds){ return ds.text === ls.text; }); }));
      localStorage.setItem("cs-s-"+user, JSON.stringify(merged));
      renderShouts(merged);
    }
  });
}

// SPA fix
var _lastPath = "";

function tryInit() {
  var old = document.querySelector(".UserPage[data-cs], .UserCard[data-cs]");
  if (old) delete old.dataset.cs;
  init();
}

setInterval(function(){
  var path = window.location.pathname;
  if (path !== _lastPath) {
    _lastPath = path;
    setTimeout(tryInit, 500);
    setTimeout(tryInit, 1200);
    setTimeout(tryInit, 2500);
  }
}, 300);

setTimeout(init, 1500);
setTimeout(init, 3000);
console.log("[ChatSong] v6 loaded");
})();
