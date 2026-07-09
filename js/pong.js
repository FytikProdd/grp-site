/* GRP Pong — против бота, средняя сложность, мяч = лого GRP */
(function () {
  const canvas = document.getElementById("pongCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const scorePlayerEl = document.getElementById("scorePlayer");
  const scoreBotEl = document.getElementById("scoreBot");
  const statusEl = document.getElementById("pongStatus");
  const startBtn = document.getElementById("pongStart");
  const resetBtn = document.getElementById("pongReset");

  const W = canvas.width;
  const H = canvas.height;
  const WIN = 7;

  const paddle = { w: 14, h: 90 };
  const player = { x: 28, y: H / 2 - paddle.h / 2, speed: 0 };
  const bot = { x: W - 28 - paddle.w, y: H / 2 - paddle.h / 2 };
  const ball = {
    x: W / 2,
    y: H / 2,
    r: 16,
    vx: 0,
    vy: 0,
    speed: 5.2,
  };

  let scoreP = 0;
  let scoreB = 0;
  let running = false;
  let raf = null;
  let targetY = H / 2;

  /* medium bot: tracks with lag + slight error */
  const BOT_SPEED = 4.2;
  const BOT_REACT = 0.12;
  const BOT_ERROR = 18;

  function resetBall(dir) {
    ball.x = W / 2;
    ball.y = H / 2;
    const angle = (Math.random() * 0.6 - 0.3) * Math.PI;
    const d = dir || (Math.random() > 0.5 ? 1 : -1);
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
    const desired = targetY - paddle.h / 2;
    player.y += (desired - player.y) * 0.35;
    clampPaddle(player);

    /* bot medium AI */
    const aim = ball.y + (Math.random() * 2 - 1) * BOT_ERROR * 0.15;
    const botCenter = bot.y + paddle.h / 2;
    const delta = aim - botCenter;
    bot.y += Math.sign(delta) * Math.min(Math.abs(delta) * BOT_REACT + 0.5, BOT_SPEED);
    /* slight delay when ball goes away */
    if (ball.vx < 0) {
      bot.y += (H / 2 - paddle.h / 2 - bot.y) * 0.01;
    }
    clampPaddle(bot);

    ball.x += ball.vx;
    ball.y += ball.vy;

    /* walls */
    if (ball.y - ball.r < 0) {
      ball.y = ball.r;
      ball.vy *= -1;
    } else if (ball.y + ball.r > H) {
      ball.y = H - ball.r;
      ball.vy *= -1;
    }

    /* paddles */
    if (hitPaddle(player)) {
      ball.x = player.x + paddle.w + ball.r;
      bounceFrom(player);
    } else if (hitPaddle(bot)) {
      ball.x = bot.x - ball.r;
      bounceFrom(bot);
    }

    /* score */
    if (ball.x + ball.r < 0) {
      scoreB++;
      updateScore();
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
    const rel = (ball.y - (p.y + paddle.h / 2)) / (paddle.h / 2);
    const angle = rel * 0.7;
    const dir = p === player ? 1 : -1;
    const speed = Math.min(9.5, Math.hypot(ball.vx, ball.vy) * 1.05 + 0.15);
    ball.vx = Math.cos(angle) * speed * dir;
    ball.vy = Math.sin(angle) * speed;
  }

  function drawCourt() {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#0a0a0a");
    g.addColorStop(0.5, "#111008");
    g.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(212,175,55,0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, W - 8, H - 8);

    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 10);
    ctx.lineTo(W / 2, H - 10);
    ctx.strokeStyle = "rgba(212,175,55,0.35)";
    ctx.stroke();
    ctx.setLineDash([]);

    /* center logo watermark */
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 72px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GRP", W / 2, H / 2);
    ctx.restore();
  }

  function drawPaddle(p) {
    const grd = ctx.createLinearGradient(p.x, p.y, p.x + paddle.w, p.y + paddle.h);
    grd.addColorStop(0, "#ffe9a0");
    grd.addColorStop(0.5, "#d4af37");
    grd.addColorStop(1, "#8b6914");
    ctx.fillStyle = grd;
    roundRect(p.x, p.y, paddle.w, paddle.h, 6);
    ctx.fill();
    ctx.shadowColor = "rgba(212,175,55,0.5)";
    ctx.shadowBlur = 12;
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

  function drawBall() {
    /* circular GRP logo ball */
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.closePath();

    const grd = ctx.createRadialGradient(
      ball.x - 4,
      ball.y - 4,
      2,
      ball.x,
      ball.y,
      ball.r
    );
    grd.addColorStop(0, "#fff4c4");
    grd.addColorStop(0.45, "#d4af37");
    grd.addColorStop(1, "#6b5210");
    ctx.fillStyle = grd;
    ctx.shadowColor = "rgba(212,175,55,0.7)";
    ctx.shadowBlur = 16;
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
    const rect = canvas.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scale = H / rect.height;
    targetY = (clientY - rect.top) * scale;
  }

  canvas.addEventListener("mousemove", setTargetFromEvent);
  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      setTargetFromEvent(e);
    },
    { passive: false }
  );
  canvas.addEventListener("touchstart", setTargetFromEvent, { passive: true });

  startBtn?.addEventListener("click", () => {
    if (running) return;
    startGame();
  });
  resetBtn?.addEventListener("click", fullReset);

  fullReset();
})();
