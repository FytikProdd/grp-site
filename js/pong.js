/* GRP Pong — против бота · золотая арена 2026
   Механика прежняя, визуал прокачан: шлейф мяча, искры, тряска экрана */
(function () {
  var canvas = document.getElementById("pongCanvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var scorePlayerEl = document.getElementById("scorePlayer");
  var scoreBotEl = document.getElementById("scoreBot");
  var statusEl = document.getElementById("pongStatus");
  var startBtn = document.getElementById("pongStart");
  var resetBtn = document.getElementById("pongReset");
  var stage = document.getElementById("pongStage");

  var W = canvas.width;
  var H = canvas.height;
  var WIN = 7;

  var paddle = { w: 14, h: 90 };
  var player = { x: 28, y: H / 2 - paddle.h / 2, glow: 0 };
  var bot = { x: W - 28 - paddle.w, y: H / 2 - paddle.h / 2, glow: 0 };
  var ball = { x: W / 2, y: H / 2, r: 16, vx: 0, vy: 0, speed: 5.2 };

  var scoreP = 0;
  var scoreB = 0;
  var running = false;
  var raf = null;
  var targetY = H / 2;

  /* FX state */
  var trail = [];
  var particles = [];
  var flash = 0;

  /* medium bot: tracks with lag + slight error */
  var BOT_SPEED = 4.2;
  var BOT_REACT = 0.12;
  var BOT_ERROR = 18;

  function shakeStage() {
    if (!stage) return;
    stage.classList.remove("is-shaking");
    void stage.offsetWidth;
    stage.classList.add("is-shaking");
  }

  function burst(x, y, n, spread) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var s = 1 + Math.random() * (spread || 4);
      particles.push({
        x: x, y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 1,
        decay: 0.02 + Math.random() * 0.03,
        r: 1.5 + Math.random() * 2.5,
        bright: Math.random() > 0.5,
      });
    }
  }

  function resetBall(dir) {
    ball.x = W / 2;
    ball.y = H / 2;
    trail.length = 0;
    var angle = (Math.random() * 0.6 - 0.3) * Math.PI;
    var d = dir || (Math.random() > 0.5 ? 1 : -1);
    ball.vx = Math.cos(angle) * ball.speed * d;
    ball.vy = Math.sin(angle) * ball.speed;
  }

  function stopGame(msg) {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    if (statusEl) statusEl.textContent = msg || "Пауза";
  }

  function startGame() {
    if (scoreP >= WIN || scoreB >= WIN) {
      scoreP = 0;
      scoreB = 0;
      updateScore();
    }
    running = true;
    if (statusEl) statusEl.textContent = "Игра идёт";
    if (!ball.vx && !ball.vy) resetBall(-1);
    loop();
  }

  function fullReset() {
    stopGame("Нажми «Старт»");
    scoreP = 0;
    scoreB = 0;
    player.y = H / 2 - paddle.h / 2;
    bot.y = H / 2 - paddle.h / 2;
    ball.vx = 0;
    ball.vy = 0;
    ball.x = W / 2;
    ball.y = H / 2;
    trail.length = 0;
    particles.length = 0;
    updateScore();
    draw();
  }

  function updateScore() {
    if (scorePlayerEl) scorePlayerEl.textContent = String(scoreP);
    if (scoreBotEl) scoreBotEl.textContent = String(scoreB);
  }

  function clampPaddle(p) {
    p.y = Math.max(8, Math.min(H - paddle.h - 8, p.y));
  }

  function update() {
    /* player follows pointer */
    var desired = targetY - paddle.h / 2;
    player.y += (desired - player.y) * 0.35;
    clampPaddle(player);

    /* bot medium AI */
    var aim = ball.y + (Math.random() * 2 - 1) * BOT_ERROR * 0.15;
    var botCenter = bot.y + paddle.h / 2;
    var delta = aim - botCenter;
    bot.y += Math.sign(delta) * Math.min(Math.abs(delta) * BOT_REACT + 0.5, BOT_SPEED);
    if (ball.vx < 0) {
      bot.y += (H / 2 - paddle.h / 2 - bot.y) * 0.01;
    }
    clampPaddle(bot);

    ball.x += ball.vx;
    ball.y += ball.vy;

    /* trail */
    trail.push({ x: ball.x, y: ball.y });
    if (trail.length > 16) trail.shift();

    /* glow decay */
    player.glow *= 0.9;
    bot.glow *= 0.9;
    flash *= 0.88;

    /* walls */
    if (ball.y - ball.r < 0) {
      ball.y = ball.r;
      ball.vy *= -1;
      burst(ball.x, 4, 8, 3);
    } else if (ball.y + ball.r > H) {
      ball.y = H - ball.r;
      ball.vy *= -1;
      burst(ball.x, H - 4, 8, 3);
    }

    /* paddles */
    if (hitPaddle(player)) {
      ball.x = player.x + paddle.w + ball.r;
      bounceFrom(player);
      player.glow = 1;
      burst(ball.x - ball.r, ball.y, 14, 5);
    } else if (hitPaddle(bot)) {
      ball.x = bot.x - ball.r;
      bounceFrom(bot);
      bot.glow = 1;
      burst(ball.x + ball.r, ball.y, 14, 5);
    }

    /* particles */
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }

    /* score */
    if (ball.x + ball.r < 0) {
      scoreB++;
      updateScore();
      shakeStage();
      flash = 1;
      burst(10, ball.y, 26, 6);
      if (scoreB >= WIN) {
        resetBall(0);
        ball.vx = 0;
        ball.vy = 0;
        stopGame("Бот победил. Ещё раунд?");
        return;
      }
      resetBall(-1);
      if (statusEl) statusEl.textContent = "Очко боту";
    } else if (ball.x - ball.r > W) {
      scoreP++;
      updateScore();
      shakeStage();
      flash = 1;
      burst(W - 10, ball.y, 26, 6);
      if (scoreP >= WIN) {
        resetBall(0);
        ball.vx = 0;
        ball.vy = 0;
        stopGame("Ты победил! GRP гордится.");
        return;
      }
      resetBall(1);
      if (statusEl) statusEl.textContent = "Очко тебе!";
    }
  }

  function hitPaddle(p) {
    return (
      ball.x - ball.r < p.x + paddle.w &&
      ball.x + ball.r > p.x &&
      ball.y + ball.r > p.y &&
      ball.y - ball.r < p.y + paddle.h
    );
  }

  function bounceFrom(p) {
    var rel = (ball.y - (p.y + paddle.h / 2)) / (paddle.h / 2);
    var angle = rel * 0.7;
    var dir = p === player ? 1 : -1;
    var speed = Math.min(9.5, Math.hypot(ball.vx, ball.vy) * 1.05 + 0.15);
    ball.vx = Math.cos(angle) * speed * dir;
    ball.vy = Math.sin(angle) * speed;
  }

  function drawCourt() {
    var g = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * 0.7);
    g.addColorStop(0, "#151008");
    g.addColorStop(0.6, "#0c0804");
    g.addColorStop(1, "#070402");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* score flash */
    if (flash > 0.02) {
      ctx.fillStyle = "rgba(212,175,55," + (flash * 0.12).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
    }

    /* outer frame */
    ctx.strokeStyle = "rgba(212,175,55,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, W - 8, H - 8);

    /* corner ticks */
    ctx.strokeStyle = "rgba(246,226,122,0.55)";
    ctx.lineWidth = 2;
    var c = 18;
    [[4, 4, 1, 1], [W - 4, 4, -1, 1], [4, H - 4, 1, -1], [W - 4, H - 4, -1, -1]].forEach(function (k) {
      ctx.beginPath();
      ctx.moveTo(k[0] + c * k[2], k[1]);
      ctx.lineTo(k[0], k[1]);
      ctx.lineTo(k[0], k[1] + c * k[3]);
      ctx.stroke();
    });

    /* center line */
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 10);
    ctx.lineTo(W / 2, H - 10);
    ctx.strokeStyle = "rgba(212,175,55,0.35)";
    ctx.stroke();
    ctx.setLineDash([]);

    /* center circle */
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 58, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(212,175,55,0.18)";
    ctx.stroke();

    /* center logo watermark */
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 72px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GRP", W / 2, H / 2);
    ctx.restore();
  }

  function drawPaddle(p) {
    var grd = ctx.createLinearGradient(p.x, p.y, p.x + paddle.w, p.y + paddle.h);
    grd.addColorStop(0, "#ffe9a0");
    grd.addColorStop(0.5, "#d4af37");
    grd.addColorStop(1, "#8b6914");
    ctx.fillStyle = grd;
    ctx.shadowColor = "rgba(246,226,122," + (0.5 + p.glow * 0.5).toFixed(2) + ")";
    ctx.shadowBlur = 12 + p.glow * 26;
    roundRect(p.x, p.y, paddle.w, paddle.h, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawTrail() {
    for (var i = 0; i < trail.length; i++) {
      var t = trail[i];
      var k = i / trail.length;
      ctx.beginPath();
      ctx.arc(t.x, t.y, ball.r * k * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212,175,55," + (k * 0.16).toFixed(3) + ")";
      ctx.fill();
    }
  }

  function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.bright
        ? "rgba(246,226,122," + p.life.toFixed(2) + ")"
        : "rgba(212,175,55," + (p.life * 0.8).toFixed(2) + ")";
      ctx.fill();
    }
  }

  function drawBall() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.closePath();

    var grd = ctx.createRadialGradient(ball.x - 4, ball.y - 4, 2, ball.x, ball.y, ball.r);
    grd.addColorStop(0, "#fff4c4");
    grd.addColorStop(0.45, "#d4af37");
    grd.addColorStop(1, "#6b5210");
    ctx.fillStyle = grd;
    ctx.shadowColor = "rgba(212,175,55,0.8)";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(255,233,160,0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#1a1408";
    ctx.font = "bold 11px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GRP", ball.x, ball.y + 0.5);
    ctx.restore();
  }

  function draw() {
    drawCourt();
    drawTrail();
    drawParticles();
    drawPaddle(player);
    drawPaddle(bot);
    drawBall();
  }

  function loop() {
    if (!running) return;
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  function setTargetFromEvent(e) {
    var rect = canvas.getBoundingClientRect();
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var scale = H / rect.height;
    targetY = (clientY - rect.top) * scale;
  }

  canvas.addEventListener("mousemove", setTargetFromEvent);
  canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    setTargetFromEvent(e);
  }, { passive: false });
  canvas.addEventListener("touchstart", setTargetFromEvent, { passive: true });

  if (startBtn) startBtn.addEventListener("click", function () {
    if (running) return;
    startGame();
  });
  if (resetBtn) resetBtn.addEventListener("click", fullReset);

  fullReset();
})();
