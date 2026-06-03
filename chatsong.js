/* ChatSong Widgets v4.9 - PWA Mobile Optimized & Native Embeds */
(function(){
"use strict";

var SHEETS_URL = "https://script.google.com/macros/s/AKfycbx8Cg-TxX1zhMooAeNimFevcyT-ginZN-lKBLxSzgHFQnVzPDHwUcNClfR505ZKiRil/exec";

var AU = ["soundcloud.com","clyp.it","vocaroo.com","hearthis.at","audiomack.com","bandcamp.com","mixcloud.com","deezer.com"];
var YU = ["youtube.com","youtu.be","vimeo.com","dailymotion.com"];

console.log("[ChatSong] v4.9 engine ready - Mobile PWA & Native Player Update.");

function sheetGet(action, artist) {
  return fetch(SHEETS_URL + "?action=" + action + "&artist=" + encodeURIComponent(artist))
    .then(function(r){return r.json();})
    .catch(function(e){ console.error("[ChatSong] Get error:", e); });
}

function sheetPost(data) {
  return fetch(SHEETS_URL, {
    method: "POST",
    headers: {"Content-Type": "text/plain"},
    body: JSON.stringify(data)
  })
  .then(function(r){return r.json();})
  .catch(function(e){ console.error("[ChatSong] Post error:", e); });
}

function addVoiceBtn() {
  var areas = document.querySelectorAll(".Composer, .PostStream-reply, .reply-form, .Post-actions");
  areas.forEach(function(ar) {
    if (ar.querySelector(".cs-voice-btn")) return;
    var btn = document.createElement("button");
    btn.className = "cs-voice-btn";
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
      if (ta) ta.value = (ta.value ? ta.value + "\n" : "") + "[Voice note: " + url + "]";
      ms.getTracks().forEach(function(t) { t.stop(); });
    };
    mr.start(); btn.innerHTML = "⏹️"; btn.style.background = "#FF4444";
    setTimeout(function() { if (mr && mr.state === "recording") mr.stop(); }, 30000);
  }).catch(function() { alert("Microphone access required"); });
}

function enrichAudio() {
  document.querySelectorAll(".Post-body a, .Post-content a, .CommentPost a, .UserBio a").forEach(function(a) {
    if (a.dataset.enriched === "1" || (a.nextSibling && a.nextSibling.classList && a.nextSibling.classList.contains("cs-audio-wrap"))) return;
    var h = a.href.toLowerCase();
    var pl = AU.find(function(d) { return h.indexOf(d) !== -1; });
    var vi = YU.find(function(d) { return h.indexOf(d) !== -1; });
    if (!pl && !vi) return;
    a.dataset.enriched = "1";
    
    if (pl) {
      var wrap = document.createElement("div");
      wrap.className = "cs-audio-wrap";
      wrap.style.cssText = "background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 14px;margin:8px 0;display:flex;align-items:center;gap:12px;max-width:100%;box-sizing:border-box;";
      wrap.innerHTML = '<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#1DB954,#8A2BE2);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">🎵</div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.textContent.substring(0,30) + '</div><div style="font-size:10px;color:#888;text-transform:uppercase">' + pl + '</div></div><button class="cs-play-embed-btn" style="background:#1DB954;border:none;border-radius:50%;width:32px;height:32px;color:#fff;cursor:pointer;font-size:12px;flex-shrink:0;">▶</button>';
      
      var btn = wrap.querySelector(".cs-play-embed-btn");
      btn.onclick = function(e) {
        e.preventDefault();
        // POPUP VERVANGEN DOOR NATIVE SOUNDCLOUD IFRAME EMBED (PWA FRIENDLY!)
        var embedUrl = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(a.href) + "&color=%231db954&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false";
        var iframe = document.createElement("iframe");
        iframe.style.cssText = "width:100%;height:120px;border:none;margin-top:8px;border-radius:12px;display:block;";
        iframe.src = embedUrl;
        iframe.scrolling = "no";
        wrap.parentNode.insertBefore(iframe, wrap.nextSibling);
        wrap.remove(); // Verberg de compacte knop als de speler laadt
      };
      
      a.parentNode.insertBefore(wrap, a.nextSibling);
      a.style.display = "none";
    }
    if (vi) {
      var wrap2 = document.createElement("div");
      wrap2.className = "cs-audio-wrap";
      wrap2.style.cssText = "background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 14px;margin:8px 0;display:flex;align-items:center;gap:12px;max-width:100%;box-sizing:border-box;";
      wrap2.innerHTML = '<div style="width:34px;height:34px;border-radius:50%;background:#FF0000;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">▶️</div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.textContent.substring(0,30) + '</div><div style="font-size:10px;color:#888;text-transform:uppercase">Video</div></div><a href="' + a.href + '" target="_blank" style="background:rgba(255,0,0,.2);border:1px solid #FF0000;color:#FF4444;border-radius:20px;padding:4px 10px;font-size:11px;text-decoration:none;font-weight:700;flex-shrink:0;">Watch</a>';
      a.parentNode.insertBefore(wrap2, a.nextSibling);
      a.style.display = "none";
    }
  });
}

function addMusicTags() {
  document.querySelectorAll(".DiscussionListItem-title, .DiscussionTitle, .PostStream-item .Post-header h3, .PostUser-name").forEach(function(el) {
    if (el.dataset.tagged === "1" || (el.nextSibling && el.nextSibling.classList && el.nextSibling.classList.contains("cs-tags-wrap"))) return;
    var t = el.textContent;
    var bpm = t.match(/(\d{2,3})\s?BPM/i);
    var key = t.match(/\b([A-G][#b]?(?:\s?(?:maj|min|major|minor|m))?)\b/i);
    var tags = [];
    if (bpm) tags.push({t:"🎵 " + bpm[1] + " BPM", c:"#1DB954"});
    if (key) tags.push({t:"🎹 " + key[1], c:"#8A2BE2"});
    if (tags.length) {
      el.dataset.tagged = "1";
      var wrap = document.createElement("div");
      wrap.className = "cs-tags-wrap";
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
  var profs = document.querySelectorAll(".UserCard, .UserPage");
  profs.forEach(function(prof) {
    if (prof.querySelector(".cs-audio-bio-box")) return;
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
    box.className = "cs-audio-bio-box";
    box.style.cssText = "background:linear-gradient(135deg,rgba(29,185,84,.1),rgba(138,43,226,.1));border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:12px;margin:10px 0;box-sizing:border-box;width:100%;";
    box.innerHTML = '<div style="display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1DB954,#8A2BE2);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;animation:csPulse 2s infinite">🎵</div><div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:13px;color:#fff;">Audio Bio</div><div style="font-size:10px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Click to listen</div></div><a href="' + audioLink + '" target="_blank" style="background:#1DB954;border:none;border-radius:20px;padding:5px 12px;color:#fff;font-size:11px;font-weight:700;text-decoration:none;flex-shrink:0;">▶️ Play</a></div><style>@keyframes csPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}</style>';
    var info = prof.querySelector(".UserCard-info, .UserPage-content");
    if (info && info.firstChild) info.insertBefore(box, info.firstChild);
    else bio.parentNode.insertBefore(box, bio);
  });
}

function addProfileEndorsements() {
  var profs = document.querySelectorAll(".UserPage, .UserCard");
  profs.forEach(function(prof) {
    var usernameEl = prof.querySelector(".username");
    if (!usernameEl) return;
    var username = usernameEl.textContent.trim();

    var existingWall = prof.querySelector(".cs-endorsement-wall");
    if (existingWall) {
      if (existingWall.dataset.forUser !== username) { existingWall.remove(); } else { return; }
    }

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
      {e:"🎧",n:"Prod",c:"#00bfff"},
      {e:"🚀",n:"Next Level",c:"#ffd700"}
    ];

    var wall = document.createElement("div");
    wall.className = "cs-endorsement-wall";
    wall.dataset.forUser = username;
    // PWA RESPONSIVE CSS INJECTIE VIA STYLE TAG OM HARDCODED BREEDTES TE VOORKOMEN
    wall.style.cssText = "margin:12px 0;background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01));border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;box-sizing:border-box;width:100%;clear:both;text-align:left;font-family:inherit;";

    var header = document.createElement("div");
    header.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;";
    header.innerHTML = '<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">🏆</span><div><div style="font-weight:800;font-size:14px;color:#fff;line-height:1.2;">Artist Endorsements</div><div style="font-size:10px;color:#777;">Community powered</div></div></div>';
    wall.appendChild(header);

    // STAR SECTION: RESPONSIVE FLEXBOX (STAPELT OP SMALLE MOBIEL/PWA)
    var starSection = document.createElement("div");
    starSection.className = "cs-star-section";
    starSection.style.cssText = "margin-bottom:12px;padding:10px;background:rgba(0,0,0,.25);border-radius:10px;";
    starSection.innerHTML = '<div class="cs-flex-responsive" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;"><div style="text-align:center;min-width:55px;flex-grow:0;"><div style="font-size:28px;font-weight:900;color:#FFD700;line-height:1;" id="cs-avg-' + username + '">—</div><div style="font-size:9px;color:#777;margin-top:2px;white-space:nowrap;" id="cs-count-' + username + '">loading...</div></div><div style="flex:1;min-width:140px;"><div style="display:flex;gap:4px;font-size:22px;margin-bottom:4px;line-height:1;" id="cs-stars-' + username + '"><span class="cs-star" data-val="1" style="cursor:pointer;color:#333;user-select:none;">★</span><span class="cs-star" data-val="2" style="cursor:pointer;color:#333;user-select:none;">★</span><span class="cs-star" data-val="3" style="cursor:pointer;color:#333;user-select:none;">★</span><span class="cs-star" data-val="4" style="cursor:pointer;color:#333;user-select:none;">★</span><span class="cs-star" data-val="5" style="cursor:pointer;color:#333;user-select:none;">★</span></div><div style="font-size:11px;color:#aaa;" id="cs-rating-label-' + username + '">Click stars to rate profile</div></div></div>';
    wall.appendChild(starSection);

    // BADGES/EMOJI SECTION: ENGELSTALIG & KLEINERE COMPACTE PWA BUTTONS
    var emojiSection = document.createElement("div");
    emojiSection.style.cssText = "margin-bottom:12px;";
    var emojiHTML = '<div style="font-size:11px;color:#aaa;margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Community Badges:</div><div style="display:flex;flex-wrap:wrap;gap:6px;" id="cs-emoji-bar-' + username + '">';
    emojis.forEach(function(em) {
      emojiHTML += '<button class="cs-emoji-btn" data-emoji="' + em.e + '" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:#ddd;border-radius:20px;padding:5px 10px;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all .15s;font-weight:700;font-family:inherit;box-sizing:border-box;"><span style="font-size:14px;">' + em.e + '</span><span>' + em.n + '</span><span style="background:rgba(0,0,0,.4);padding:1px 5px;border-radius:8px;font-size:10px;min-width:12px;text-align:center;color:#fff;" id="cs-ec-' + username + '-' + em.e + '">—</span></button>';
    });
    emojiHTML += '</div>';
    emojiSection.innerHTML = emojiHTML;
    wall.appendChild(emojiSection);

    // SHOUTOUT SECTION: VOLLEDIG ENGELS
    var shoutSection = document.createElement("div");
    shoutSection.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;"><div style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Fan Shoutouts:</div><button id="cs-shout-btn-' + username + '" style="background:rgba(29,185,84,.15);border:1px solid #1DB954;color:#1DB954;border-radius:20px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">+ Drop a shout</button></div><div id="cs-shout-grid-' + username + '" style="display:grid;grid-template-columns:1fr;gap:6px;max-height:160px;overflow-y:auto;padding-right:2px;"><div style="text-align:center;color:#555;font-size:11px;padding:15px;">Loading...</div></div><div id="cs-shout-form-' + username + '" style="display:none;margin-top:8px;"><div style="display:flex;gap:6px;align-items:stretch;width:100%;box-sizing:border-box;"><input type="text" id="cs-shout-input-' + username + '" maxlength="60" placeholder="Type something nice..." style="flex:1;min-width:0;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 10px;color:#fff;font-size:12px;font-family:inherit;outline:none;"><button id="cs-shout-submit-' + username + '" style="background:#1DB954;border:none;border-radius:8px;padding:8px 12px;color:#fff;font-weight:800;cursor:pointer;font-size:12px;font-family:inherit;flex-shrink:0;">Post</button></div><div style="font-size:9px;color:#555;margin-top:3px;">Max 60 characters</div></div>';
    wall.appendChild(shoutSection);

    var bioItem = prof.querySelector(".item-bio, .UserBio");
    if (bioItem) { bioItem.parentNode.insertBefore(wall, bioItem.nextSibling); } 
    else {
      var fallback = prof.querySelector(".UserCard-info, .UserPage-content, .UserCard-profile");
      if (fallback) fallback.appendChild(wall); else prof.appendChild(wall);
    }

    loadData(username, myRating, myEmojis, emojis, visitorId);

    var stars = wall.querySelectorAll(".cs-star");
    stars.forEach(function(star) {
      star.addEventListener("click", function() {
        var val = parseInt(this.dataset.val);
        sheetPost({action:"rate", artist:username, visitor_id:visitorId, rating:val}).then(function(){
          localStorage.setItem("cs-my-rating-" + username, val);
          myRating = val;
          stars.forEach(function(s, idx) { s.style.color = idx < val ? "#FFD700" : "#333"; });
          var lbl = document.getElementById("cs-rating-label-" + username);
          if (lbl) lbl.textContent = "You rated this profile " + val + "★";
          return sheetGet("getRatings", username);
        }).then(function(data){
          var avgEl = document.getElementById("cs-avg-" + username);
          var countEl = document.getElementById("cs-count-" + username);
          if (avgEl) avgEl.textContent = data.avg;
          if (countEl) countEl.textContent = data.count + " ratings";
        });
      });
      star.addEventListener("mouseenter", function() {
        var val = parseInt(this.dataset.val);
        stars.forEach(function(s, idx) { s.style.color = idx < val ? "#FFD700" : "#333"; });
      });
      star.addEventListener("mouseleave", function() {
        stars.forEach(function(s, idx) { s.style.color = idx < myRating ? "#FFD700" : "#333"; });
      });
    });

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
          this.style.borderColor = "rgba(255,255,255,.07)";
          this.style.color = "#ddd";
          count = Math.max(0, count - 1);
          sheetPost({action:"unreact", artist:username, visitor_id:visitorId, emoji:em});
        } else {
          myEmojis.push(em);
          this.style.background = emData.c + "25";
          this.style.borderColor = emData.c + "60";
          this.style.color = emData.c;
          count++;
          sheetPost({action:"react", artist:username, visitor_id:visitorId, emoji:em});
        }
        localStorage.setItem("cs-my-emojis-" + username, JSON.stringify(myEmojis));
        if (countSpan) countSpan.textContent = count;
      });
    });

    var shoutSubmit = document.getElementById("cs-shout-submit-" + username);
    var shoutInput = document.getElementById("cs-shout-input-" + username);
    var shoutGrid = document.getElementById("cs-shout-grid-" + username);
    var shoutForm = document.getElementById("cs-shout-form-" + username);
    var shoutBtn = document.getElementById("cs-shout-btn-" + username);
    
    if (shoutBtn && shoutForm) {
      shoutBtn.onclick = function() { shoutForm.style.display = shoutForm.style.display === "none" ? "block" : "none"; };
    }
    if (shoutSubmit && shoutInput && shoutGrid) {
      shoutSubmit.onclick = function() {
        var text = shoutInput.value.trim();
        if (!text) return;
        sheetPost({action:"shoutout", artist:username, visitor_id:visitorId, text:text}).then(function(){
          var div = document.createElement("div");
          div.style.cssText = "background:#1DB95412;border:1px solid #1DB95425;border-radius:8px;padding:8px;font-size:11px;color:#ddd;";
          div.innerHTML = '<div style="font-weight:700;color:#fff;margin-bottom:3px;line-height:1.2;">' + text + '</div><div style="font-size:9px;color:#1DB954;">You • just now</div>';
          if (shoutGrid.children.length === 1 && shoutGrid.children[0].textContent.indexOf("Loading") !== -1) shoutGrid.innerHTML = "";
          shoutGrid.appendChild(div);
          shoutGrid.scrollTop = shoutGrid.scrollHeight;
          shoutInput.value = "";
          if (shoutForm) shoutForm.style.display = "none";
        });
      };
      shoutInput.onkeypress = function(e) { if (e.key === "Enter") shoutSubmit.click(); };
    }
  });
}

function loadData(username, myRating, myEmojis, emojis, visitorId) {
  sheetGet("getRatings", username).then(function(ratingData) {
    if (!ratingData) return;
    var avgEl = document.getElementById("cs-avg-" + username);
    var countEl = document.getElementById("cs-count-" + username);
    if (avgEl) avgEl.textContent = ratingData.avg || "—";
    if (countEl) countEl.textContent = (ratingData.count || 0) + " ratings";
    return sheetGet("getReactions", username);
  }).then(function(reactionData) {
    if (!reactionData) return;
    emojis.forEach(function(em) {
      var el = document.getElementById("cs-ec-" + username + "-" + em.e);
      if (el) el.textContent = reactionData[em.e] || 0;
    });
    return sheetGet("getShoutouts", username);
  }).then(function(shoutData) {
    var grid = document.getElementById("cs-shout-grid-" + username);
    if (grid) {
      if (!shoutData || shoutData.length === 0) {
        grid.innerHTML = '<div style="text-align:center;color:#555;font-size:11px;padding:15px;">No shoutouts yet. Be the first!</div>';
      } else {
        grid.innerHTML = shoutData.map(function(s) {
          var vName = s.visitor || "Fan";
          return '<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:8px;font-size:11px;color:#ddd;"><div style="font-weight:700;color:#fff;margin-bottom:3px;line-height:1.2;">' + (s.text || "") + '</div><div style="font-size:9px;color:#666;">' + vName + ' • ' + (s.date || "") + '</div></div>';
        }).join("");
      }
    }
    if (myRating > 0) {
      var stars = document.querySelectorAll("#cs-stars-" + username + " .cs-star");
      stars.forEach(function(s, idx) { s.style.color = idx < myRating ? "#FFD700" : "#333"; });
      var lbl = document.getElementById("cs-rating-label-" + username);
      if (lbl) lbl.textContent = "You rated this profile " + myRating + "★";
    }
    myEmojis.forEach(function(em) {
      var btn = document.querySelector('#cs-emoji-bar-' + username + ' .cs-emoji-btn[data-emoji="' + em + '"]');
      var emData = emojis.find(function(e) { return e.e === em; });
      if (btn && emData) {
        btn.style.background = emData.c + "25";
        btn.style.borderColor = emData.c + "60";
        btn.style.color = emData.c;
      }
    });
  }).catch(function(e) {
    console.error("[ChatSong] Database load error:", e);
    var countEl = document.getElementById("cs-count-" + username);
    if (countEl) countEl.textContent = "Load error";
  });
}

function init() {
  addVoiceBtn();
  enrichAudio();
  addMusicTags();
  enrichProfile();
  addProfileEndorsements();
}

var initTimeout = null;
new MutationObserver(function() {
  clearTimeout(initTimeout);
  initTimeout = setTimeout(init, 200);
}).observe(document.body, {subtree: true, childList: true});

if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
