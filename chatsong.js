/* ChatSong Widgets v4.2 - Clean Edition */
(function(){
"use strict";

var SHEETS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSBfrBwdDUUwAOnaPOGt40tuYTDUpncsMImAl7stPuRgDu5h6LViDhrZfAqJm6vvbXoBQl9i3pDAonwlEAZxxfRPvhQgj-MbBWZi24oCAEi_za2K73PrQW55zeh1zNwRldc_Wg1MPbxUGaoXBhgeoPCJ3PX7oG7ceO1ZbT7PtPxKI9svDaMigCgq71nMAdqOr6iogRxBT7VDIueMIeGpGv0UhJhKaOkTv9yCGvCx8maKQZ-04zKMQv-rOF_13bQ6qFJByuV8-dWoUpaYiloTkXQY9Ihcw&lib=MqzuHtAm83C3BSyHE9A5j0E-DGdiQLF-5";
var AU = ["soundcloud.com","clyp.it","vocaroo.com","hearthis.at","audiomack.com","bandcamp.com","mixcloud.com","deezer.com"];
var YU = ["youtube.com","youtu.be","vimeo.com","dailymotion.com"];

console.log("[ChatSong] v4.2 loaded");

function sheetGet(action, artist) {
  return fetch(SHEETS_URL + "?action=" + action + "&artist=" + encodeURIComponent(artist)).then(function(r){return r.json();});
}

function sheetPost(data) {
  return fetch(SHEETS_URL, {
    method: "POST",
    headers: {"Content-Type": "text/plain"}, // Veilig voor Google Apps Script
    body: JSON.stringify(data)
  }).then(function(r){return r.json();});
}

function addVoiceBtn() {
  var areas = document.querySelectorAll(".Composer, .PostStream-reply, .reply-form, .Post-actions");
  areas.forEach(function(ar) {
    if (ar.dataset.voice === "1") return;
    ar.dataset.voice = "1";
    var btn = document.createElement("button");
    btn.innerHTML = "🎙️";
    btn.title = "Voice note (30sec)";
    btn.style.cssText = "background:rgba(29,185,84,.15);border:1px solid #1DB954;color:#1DB954;border-radius:20px;padding:4px 10px;font-size:13px;cursor:pointer;margin-left:8px;font-weight:700;";
    btn.onclick = function(e) { e.preventDefault(); toggleVoice(btn, ar); };
    var actions = ar.querySelector(".Composer-actions, .form-controls, .PostStream-actions, ul");
    if (actions) actions.appendChild(btn); else ar.appendChild(btn);
  });
}

var mr = null, ms = null;
function toggleVoice(btn, ar) {
  if (mr && mr.state === "recording") {
    mr.stop(); btn.innerHTML = "🎙️"; btn.style.background = "rgba(29,185,84,.15)";
    return;
  }
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(s) {
    ms = s; mr = new MediaRecorder(s);
    var chunks = [];
    mr.ondataavailable = function(e) { if (e.data.size) chunks.push(e.data); };
    mr.onstop = function() {
      var blob = new Blob(chunks, {type:"audio/webm"});
      var url = URL.createObjectURL(blob);
      var ta = ar.querySelector("textarea, .ComposerBody");
      if (ta) ta.value = (ta.value ? ta.value + "
" : "") + "[Voice note: " + url + "]";
      ms.getTracks().forEach(function(t) { t.stop(); });
    };
    mr.start(); btn.innerHTML = "⏹️"; btn.style.background = "#FF4444";
    setTimeout(function() { if (mr && mr.state === "recording") mr.stop(); }, 30000);
  }).catch(function() { alert("Microfoon nodig"); });
}

function enrichAudio() {
  document.querySelectorAll(".Post-body a, .Post-content a, .CommentPost a, .UserBio a").forEach(function(a) {
    if (a.dataset.enriched === "1") return;
    var h = a.href.toLowerCase();
    var pl = AU.find(function(d) { return h.indexOf(d) !== -1; });
    var vi = YU.find(function(d) { return h.indexOf(d) !== -1; });
    if (!pl && !vi) return;
    a.dataset.enriched = "1";
    if (pl) {
      var wrap = document.createElement("div");
      wrap.style.cssText = "background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 14px;margin:8px 0;display:flex;align-items:center;gap:12px;max-width:400px;";
      wrap.innerHTML = '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1DB954,#8A2BE2);display:flex;align-items:center;justify-content:center;font-size:16px">🎵</div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.textContent.substring(0,40) + '</div><div style="font-size:10px;color:#888;text-transform:uppercase">' + pl + '</div></div><button style="background:#1DB954;border:none;border-radius:50%;width:32px;height:32px;color:#fff;cursor:pointer;font-size:14px">▶</button>';
      var btn = wrap.querySelector("button");
      btn.onclick = function() { window.open(a.href, "_blank", "width=500,height=300"); };
      a.parentNode.insertBefore(wrap, a.nextSibling);
      a.style.display = "none";
    }
    if (vi) {
      var wrap2 = document.createElement("div");
      wrap2.style.cssText = "background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 14px;margin:8px 0;display:flex;align-items:center;gap:12px;max-width:400px;";
      wrap2.innerHTML = '<div style="width:36px;height:36px;border-radius:50%;background:#FF0000;display:flex;align-items:center;justify-content:center;font-size:16px">▶️</div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.textContent.substring(0,40) + '</div><div style="font-size:10px;color:#888;text-transform:uppercase">Video</div></div><a href="' + a.href + '" target="_blank" style="background:rgba(255,0,0,.2);border:1px solid #FF0000;color:#FF4444;border-radius:20px;padding:4px 12px;font-size:11px;text-decoration:none;font-weight:700">Bekijk</a>';
      a.parentNode.insertBefore(wrap2, a.nextSibling);
      a.style.display = "none";
    }
  });
}

function addMusicTags() {
  document.querySelectorAll(".DiscussionListItem-title, .DiscussionTitle, .PostStream-item .Post-header h3, .PostUser-name").forEach(function(el) {
    if (el.dataset.tagged === "1") return;
    el.dataset.tagged = "1";
    var t = el.textContent;
    var bpm = t.match(/(\d{2,3})\s?BPM/i);
    var key = t.match(/([A-G][#b]?(?:\s?(?:maj|min|major|minor|m))?)/i);
    var tags = [];
    if (bpm) tags.push({t:"🎵 " + bpm[1] + " BPM", c:"#1DB954"});
    if (key) tags.push({t:"🎹 " + key[1], c:"#8A2BE2"});
    if (tags.length) {
      var wrap = document.createElement("div");
      wrap.style.cssText = "display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;";
      tags.forEach(function(tag) {
        var sp = document.createElement("span");
        sp.style.cssText = "background:" + tag.c + "22;border:1px solid " + tag.c + "44;color:" + tag.c + ";border-radius:20px;padding:2px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px";
        sp.textContent = tag.t;
        wrap.appendChild(sp);
      });
      el.parentNode.insertBefore(wrap, el.nextSibling);
    }
  });
}

function enrichProfile() {
  var prof = document.querySelector(".UserCard, .UserPage");
  if (!prof || prof.dataset.audio === "1") return;
  prof.dataset.audio = "1";
  var bio = prof.querySelector(".UserBio, .UserCard-bio, .item-bio");
  if (!bio) return;
  var links = bio.querySelectorAll("a");
  var audioLink = null;
  links.forEach(function(a) {
    var h = a.href.toLowerCase();
    if (AU.some(function(d) { return h.indexOf(d) !== -1; })) audioLink = a.href;
  });
  if (!audioLink) return;
  var box = document.createElement("div");
  box.style.cssText = "background:linear-gradient(135deg,rgba(29,185,84,.1),rgba(138,43,226,.1));border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:14px;margin:10px 0;";
  box.innerHTML = '<div style="display:flex;align-items:center;gap:12px"><div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#1DB954,#8A2BE2);display:flex;align-items:center;justify-content:center;font-size:20px;animation:csPulse 2s infinite">🎵</div><div style="flex:1"><div style="font-weight:700;font-size:14px">Audio Bio</div><div style="font-size:11px;color:#888">Klik om te beluisteren</div></div><a href="' + audioLink + '" target="_blank" style="background:#1DB954;border:none;border-radius:20px;padding:6px 16px;color:#fff;font-size:12px;font-weight:700;text-decoration:none">▶️ Play</a></div><style>@keyframes csPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}</style>';
  var info = prof.querySelector(".UserCard-info, .UserPage-content");
  if (info && info.firstChild) info.insertBefore(box, info.firstChild);
  else bio.parentNode.insertBefore(box, bio);
}

function addProfileEndorsements() {
  var prof = document.querySelector(".UserPage, .UserCard");
  if (!prof) { console.log("[ChatSong] No profile found"); return; }
  if (prof.dataset.endorsements === "1") { console.log("[ChatSong] Already added"); return; }
  var bioItem = prof.querySelector(".item-bio, .UserBio");
  if (!bioItem) { console.log("[ChatSong] No bio found"); return; }
  prof.dataset.endorsements = "1";
  console.log("[ChatSong] Building wall...");

  var usernameEl = prof.querySelector(".username");
  var username = usernameEl ? usernameEl.textContent.trim() : "user";
  var visitorId = localStorage.getItem("cs-visitor") || "v_" + Math.random().toString(36).substr(2,9);
  localStorage.setItem("cs-visitor", visitorId);
  var myRating = parseInt(localStorage.getItem("cs-my-rating-" + username)) || 0;
  var myEmojis = JSON.parse(localStorage.getItem("cs-my-emojis-" + username) || "[]");

  var emojis = [
    {e:"🔥",n:"Fire",c:"#ff5500"},
    {e:"❤️",n:"Love",c:"#ff4444"},
    {e:"🎵",n:"Banger",c:"#1DB954"},
    {e:"👏",n:"Respect",c:"#8A2BE2"},
    {e:"🎤",n:"Vocals",c:"#ff69b4"},
    {e:"🎧",n:"Producer",c:"#00bfff"},
    {e:"🚀",n:"Next Level",c:"#ffd700"}
  ];

  var wall = document.createElement("div");
  wall.className = "cs-endorsement-wall";
  wall.style.cssText = "margin-top:16px;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;overflow:hidden;";

  var header = document.createElement("div");
  header.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;";
  header.innerHTML = '<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:20px;">🏆</span><div><div style="font-weight:800;font-size:15px;color:#fff;">Artist Endorsements</div><div style="font-size:11px;color:#888;">Community powered</div></div></div>';
  wall.appendChild(header);

  // Star rating
  var starSection = document.createElement("div");
  starSection.style.cssText = "margin-bottom:16px;padding:14px;background:rgba(0,0,0,.2);border-radius:12px;";
  starSection.innerHTML = '<div style="display:flex;align-items:center;gap:14px;"><div style="text-align:center;min-width:60px;"><div style="font-size:32px;font-weight:900;color:#FFD700;line-height:1;" id="cs-avg-' + username + '">—</div><div style="font-size:10px;color:#888;margin-top:2px;" id="cs-count-' + username + '">loading...</div></div><div style="flex:1;"><div style="display:flex;gap:3px;font-size:24px;margin-bottom:6px;" id="cs-stars-' + username + '"><span class="cs-star" data-val="1" style="cursor:pointer;transition:all .15s;color:#444;user-select:none;">★</span><span class="cs-star" data-val="2" style="cursor:pointer;transition:all .15s;color:#444;user-select:none;">★</span><span class="cs-star" data-val="3" style="cursor:pointer;transition:all .15s;color:#444;user-select:none;">★</span><span class="cs-star" data-val="4" style="cursor:pointer;transition:all .15s;color:#444;user-select:none;">★</span><span class="cs-star" data-val="5" style="cursor:pointer;transition:all .15s;color:#444;user-select:none;">★</span></div><div style="font-size:12px;color:#aaa;" id="cs-rating-label-' + username + '">Click stars to rate</div></div></div>';
  wall.appendChild(starSection);

  // Emoji reactions
  var emojiSection = document.createElement("div");
  emojiSection.style.cssText = "margin-bottom:16px;";
  var emojiHTML = '<div style="font-size:12px;color:#aaa;margin-bottom:10px;font-weight:600;">Community Badges:</div><div style="display:flex;flex-wrap:wrap;gap:8px;" id="cs-emoji-bar-' + username + '">';
  emojis.forEach(function(em) {
    emojiHTML += '<button class="cs-emoji-btn" data-emoji="' + em.e + '" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#ddd;border-radius:24px;padding:7px 14px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .2s;font-weight:700;font-family:inherit;"><span style="font-size:18px;">' + em.e + '</span><span>' + em.n + '</span><span style="background:rgba(0,0,0,.3);padding:2px 7px;border-radius:10px;font-size:11px;min-width:18px;text-align:center;color:#fff;" id="cs-ec-' + username + '-' + em.e + '">—</span></button>';
  });
  emojiHTML += '</div>';
  emojiSection.innerHTML = emojiHTML;
  wall.appendChild(emojiSection);

  // Shoutouts
  var shoutSection = document.createElement("div");
  shoutSection.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;"><div style="font-size:12px;color:#aaa;font-weight:600;">Fan Shoutouts:</div><button id="cs-shout-btn-' + username + '" style="background:rgba(29,185,84,.15);border:1px solid #1DB954;color:#1DB954;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">+ Drop a shout</button></div><div id="cs-shout-grid-' + username + '" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;max-height:220px;overflow-y:auto;padding-right:4px;"><div style="text-align:center;color:#666;font-size:12px;padding:20px;">Loading...</div></div><div id="cs-shout-form-' + username + '" style="display:none;margin-top:12px;"><div style="display:flex;gap:8px;align-items:stretch;"><input type="text" id="cs-shout-input-' + username + '" maxlength="60" placeholder="Say something nice..." style="flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;font-family:inherit;outline:none;"><button id="cs-shout-submit-' + username + '" style="background:#1DB954;border:none;border-radius:10px;padding:10px 16px;color:#fff;font-weight:800;cursor:pointer;font-size:13px;font-family:inherit;">Post</button></div><div style="font-size:10px;color:#666;margin-top:4px;">Max 60 characters</div></div>';
  wall.appendChild(shoutSection);

  bioItem.parentNode.insertBefore(wall, bioItem.nextSibling);
  console.log("[ChatSong] Wall inserted for " + username);

  // Load data
  loadData(username, myRating, myEmojis, emojis, visitorId);

  // Star clicks
  var stars = wall.querySelectorAll(".cs-star");
  stars.forEach(function(star) {
    star.addEventListener("click", function() {
      var val = parseInt(this.dataset.val);
      sheetPost({action:"rate", artist:username, visitor_id:visitorId, rating:val}).then(function(){
        localStorage.setItem("cs-my-rating-" + username, val);
        myRating = val;
        stars.forEach(function(s, idx) {
          s.style.color = idx < val ? "#FFD700" : "#444";
          s.style.textShadow = idx < val ? "0 0 8px rgba(255,215,0,.4)" : "none";
        });
        document.getElementById("cs-rating-label-" + username).textContent = "You rated: " + val + "★";
        return sheetGet("getRatings", username);
      }).then(function(data){
        document.getElementById("cs-avg-" + username).textContent = data.avg;
        document.getElementById("cs-count-" + username).textContent = data.count + " ratings";
      });
    });
    star.addEventListener("mouseenter", function() {
      var val = parseInt(this.dataset.val);
      stars.forEach(function(s, idx) { s.style.color = idx < val ? "#FFD700" : "#444"; });
    });
    star.addEventListener("mouseleave", function() {
      stars.forEach(function(s, idx) { s.style.color = idx < myRating ? "#FFD700" : "#444"; });
    });
  });

  // Emoji clicks
  var emojiBtns = wall.querySelectorAll(".cs-emoji-btn");
  emojiBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      var em = this.dataset.emoji;
      var emData = emojis.find(function(e) { return e.e === em; });
      if (!emData) return;
      var idx = myEmojis.indexOf(em);
      var countSpan = document.getElementById("cs-ec-" + username + "-" + em);
      var count = parseInt(countSpan.textContent) || 0;
      if (idx > -1) {
        myEmojis.splice(idx, 1);
        this.style.background = "rgba(255,255,255,.04)";
        this.style.borderColor = "rgba(255,255,255,.08)";
        this.style.color = "#ddd";
        count = Math.max(0, count - 1);
        sheetPost({action:"unreact", artist:username, visitor_id:visitorId, emoji:em});
      } else {
        myEmojis.push(em);
        this.style.background = emData.c + "25";
        this.style.borderColor = emData.c + "60";
        this.style.color = emData.c;
        count++;
        this.style.transform = "scale(1.15)";
        setTimeout(function() { btn.style.transform = "scale(1)"; }, 200);
        sheetPost({action:"react", artist:username, visitor_id:visitorId, emoji:em});
      }
      localStorage.setItem("cs-my-emojis-" + username, JSON.stringify(myEmojis));
      countSpan.textContent = count;
    });
  });

  // Shoutout
  var shoutBtn = document.getElementById("cs-shout-btn-" + username);
  var shoutForm = document.getElementById("cs-shout-form-" + username);
  if (shoutBtn) {
    shoutBtn.addEventListener("click", function() {
      shoutForm.style.display = shoutForm.style.display === "none" ? "block" : "none";
    });
  }
  var shoutSubmit = document.getElementById("cs-shout-submit-" + username);
  var shoutInput = document.getElementById("cs-shout-input-" + username);
  var shoutGrid = document.getElementById("cs-shout-grid-" + username);
  if (shoutSubmit && shoutInput) {
    shoutSubmit.addEventListener("click", function() {
      var text = shoutInput.value.trim();
      if (!text) return;
      sheetPost({action:"shoutout", artist:username, visitor_id:visitorId, text:text}).then(function(){
        var div = document.createElement("div");
        div.style.cssText = "background:#1DB95412;border:1px solid #1DB95425;border-radius:10px;padding:10px;font-size:12px;color:#ddd;";
        div.innerHTML = '<div style="font-weight:700;color:#fff;margin-bottom:4px;line-height:1.3;">' + text + '</div><div style="font-size:10px;color:#1DB954;display:flex;align-items:center;gap:4px;"><span style="width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#1DB954,#8A2BE2);display:inline-block;"></span>You • Just now</div>';
        if (shoutGrid.children.length === 1 && shoutGrid.children[0].textContent.indexOf("Loading") !== -1) shoutGrid.innerHTML = "";
        shoutGrid.appendChild(div);
        shoutGrid.scrollTop = shoutGrid.scrollHeight;
        shoutInput.value = "";
        shoutForm.style.display = "none";
      });
    });
    shoutInput.addEventListener("keypress", function(e) { if (e.key === "Enter") shoutSubmit.click(); });
  }
}

function loadData(username, myRating, myEmojis, emojis, visitorId) {
  console.log("[ChatSong] Loading data for " + username);
  sheetGet("getRatings", username).then(function(ratingData) {
    document.getElementById("cs-avg-" + username).textContent = ratingData.avg;
    document.getElementById("cs-count-" + username).textContent = ratingData.count + " ratings";
    return sheetGet("getReactions", username);
  }).then(function(reactionData) {
    emojis.forEach(function(em) {
      var el = document.getElementById("cs-ec-" + username + "-" + em.e);
      if (el) el.textContent = reactionData[em.e] || 0;
    });
    return sheetGet("getShoutouts", username);
  }).then(function(shoutData) {
    var grid = document.getElementById("cs-shout-grid-" + username);
    if (grid) {
      if (shoutData.length === 0) {
        grid.innerHTML = '<div style="text-align:center;color:#666;font-size:12px;padding:20px;">No shoutouts yet. Be the first!</div>';
      } else {
        grid.innerHTML = shoutData.map(function(s) {
          var colors = ["#ff550015","#1DB95415","#8A2BE215","#FF444415","#FFD70015","#00BFFF15"];
          return '<div style="background:' + colors[Math.abs(s.visitor.length)%6] + ';border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:10px;font-size:12px;color:#ddd;"><div style="font-weight:700;color:#fff;margin-bottom:4px;line-height:1.3;">' + s.text + '</div><div style="font-size:10px;color:#888;display:flex;align-items:center;gap:4px;"><span style="width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#1DB954,#8A2BE2);display:inline-block;"></span>' + s.visitor + ' • ' + s.date + '</div></div>';
        }).join("");
      }
    }
    if (myRating > 0) {
      var stars = document.querySelectorAll("#cs-stars-" + username + " .cs-star");
      stars.forEach(function(s, idx) {
        s.style.color = idx < myRating ? "#FFD700" : "#444";
        s.style.textShadow = idx < myRating ? "0 0 8px rgba(255,215,0,.4)" : "none";
      });
      document.getElementById("cs-rating-label-" + username).textContent = "You rated: " + myRating + "★";
    }
    myEmojis.forEach(function(em) {
      var btn = document.querySelector('.cs-emoji-btn[data-emoji="' + em + '"]');
      var emData = emojis.find(function(e) { return e.e === em; });
      if (btn && emData) {
        btn.style.background = emData.c + "25";
        btn.style.borderColor = emData.c + "60";
        btn.style.color = emData.c;
      }
    });
    console.log("[ChatSong] Data loaded OK");
  }).catch(function(e) {
    console.error("[ChatSong] Load error:", e);
    document.getElementById("cs-count-" + username).textContent = "Error loading";
  });
}

function init() {
  console.log("[ChatSong] init() running...");
  addVoiceBtn();
  enrichAudio();
  addMusicTags();
  enrichProfile();
  addProfileEndorsements();
}

// SPA route detection
var lastUrl = location.href;
new MutationObserver(function() {
  var url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log("[ChatSong] Route changed: " + url);
    document.querySelectorAll(".UserPage, .UserCard").forEach(function(el) {
      delete el.dataset.endorsements;
      delete el.dataset.audio;
    });
    setTimeout(init, 500);
  }
}).observe(document, {subtree: true, childList: true});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
setTimeout(init, 1000);
setTimeout(init, 3000);

console.log("[ChatSong] v4.2 ready");
})();
