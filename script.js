  // ---- Settings you can change ----
  var CONFIG = {
    
    // whatsappNumber: "",                      // e.g. "919876543210" (country code, no +). Empty = guest picks the chat.
    muhurtham: "2026-12-14T03:30:00+05:30"
  };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  

  // Garland of flowers along the curve y = 14 + 53*(1 - ((x-170)/160)^2)
  var gar = "", cols = ["#e9a23b", "#f4b6c2", "#c22a38"];
  for (var i = 0; i <= 16; i++) {
    var gx = 10 + i * 20, t = (gx - 170) / 160, gy = 14 + 53 * (1 - t * t);
    gar += '<circle cx="' + gx + '" cy="' + gy.toFixed(1) + '" r="8" fill="' + cols[i % 3] + '" opacity=".9"/>' +
           '<circle cx="' + gx + '" cy="' + gy.toFixed(1) + '" r="3" fill="#fbe6a6"/>';
  }
  

  // Open cover
  document.body.style.overflow = "hidden";
  document.getElementById("openBtn").addEventListener("click", function () {
    document.getElementById("cover").classList.add("open");
    document.body.style.overflow = "";
    if (!reduced) { for (var i = 0; i < 10; i++) setTimeout(petal, i * 180); setInterval(petal, 1100); }
  });

  // Falling petals
  var kinds = ["rose", "rose", "blossom", "leaf"];
  function petal() {
    if (document.hidden) return;
    var el = document.createElement("div");
    el.className = "petal " + kinds[Math.random() * kinds.length | 0];
    el.style.left = Math.random() * 100 + "vw";
    el.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
    el.style.setProperty("--rot", (300 + Math.random() * 500) + "deg");
    var dur = 6 + Math.random() * 5;
    el.style.animationDuration = dur + "s";
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, dur * 1000);
  }

  // Scratch to reveal
  (function () {
    var c = document.getElementById("scratch"), ctx = c.getContext("2d"), down = false, done = false, moves = 0;
    function paint() {
      var r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      if (!r.width) return;
      c.width = r.width * d; c.height = r.height * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      var g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, "#8c1823"); g.addColorStop(.5, "#c22a38"); g.addColorStop(1, "#8c1823");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
      ctx.fillStyle = "#f3d9a4"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "600 14px Georgia, serif";
      try { ctx.letterSpacing = "3px"; } catch (e) {}
      ctx.fillText("✦  SCRATCH TO REVEAL  ✦", r.width / 2, r.height / 2);
    }
    function finish() {
      done = true; c.style.opacity = 0; c.style.pointerEvents = "none";
      document.getElementById("hint").textContent = "We can't wait to celebrate with you";
      if (!reduced) for (var i = 0; i < 14; i++) setTimeout(petal, i * 90);
    }
    function scratch(e) {
      if (!down || done) return;
      var r = c.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, 7); ctx.fill();
      if (++moves % 12 === 0) {
        var px = ctx.getImageData(0, 0, c.width, c.height).data, clear = 0, n = 0;
        for (var i = 3; i < px.length; i += 160) { n++; if (px[i] < 40) clear++; }
        if (clear / n > .45) finish();
      }
    }
    c.addEventListener("pointerdown", function (e) { down = true; c.setPointerCapture(e.pointerId); scratch(e); });
    c.addEventListener("pointermove", scratch);
    c.addEventListener("pointerup", function () { down = false; });
    c.addEventListener("pointercancel", function () { down = false; });
    paint();
    window.addEventListener("load", function () { if (!moves) paint(); });
    window.addEventListener("resize", function () { if (!moves && !done) paint(); });
  })();

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // Countdown
  var target = new Date(CONFIG.muhurtham).getTime();
  function tick() {
    var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    document.getElementById("cd-d").textContent = Math.floor(s / 86400);
    document.getElementById("cd-h").textContent = Math.floor(s % 86400 / 3600);
    document.getElementById("cd-m").textContent = Math.floor(s % 3600 / 60);
    document.getElementById("cd-s").textContent = s % 60;
  }
  tick(); setInterval(tick, 1000);
