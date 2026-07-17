/**
 * ЦИКАДА 0859 — hero-заглушка "живая цикада из зелёной матрицы цифр".
 * Активируется, только пока assets/video/night-road.mp4 отсутствует/не грузится.
 * Не зависит от GSAP/Lenis — работает и при недоступном CDN.
 */

const MATRIX_DIGITS = '0123456789';

/* ===== Чистые функции (покрыты тестами) ===== */

function computeGrid(width, height, cell) {
  if (cell <= 0 || width <= 0 || height <= 0) return { cols: 0, rows: 0 };
  return { cols: Math.ceil(width / cell), rows: Math.ceil(height / cell) };
}

/** Дыхание: плавный множитель яркости в диапазоне [0.82, 1]. */
function breathPulse(timeSec, period = 4.6) {
  return 0.91 + 0.09 * Math.sin((timeSec / period) * Math.PI * 2);
}

/**
 * Бегущая волна сканирования вдоль тела (голова -> хвост).
 * normPos в [0,1]; возвращает интенсивность гребня в (0,1].
 */
function scanBand(normPos, timeSec, period = 5.2, width = 0.09) {
  const span = 1 + width * 4;
  const center = ((timeSec % period) / period) * span - width * 2;
  const d = (normPos - center) / width;
  return Math.exp(-d * d);
}

/** Моргание глаз: u в [0,1], 1 = открыт по краям, 0 = закрыт в середине. */
function blinkEnvelope(u) {
  if (u <= 0 || u >= 1) return 1;
  return Math.pow(Math.abs(Math.cos(Math.PI * u)), 0.65);
}

/** Пауза до следующей смены цифры в ячейке, мс. rand в [0,1). */
function nextFlipDelay(rand) {
  return 350 + rand * 2400;
}

/* ===== Силуэт цикады (вид сверху, сложенные крылья) =====
 * Рисуется в градациях серого: яркость пикселя = базовая интенсивность цифры.
 * Глаза — единственные зоны с яркостью 1.0 (порог >0.97 = "глазные" ячейки).
 * Дизайн-пространство 100x160, центрировано, вписывается в (w, h).
 */
function drawCicadaSilhouette(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  const s = Math.min(w / 100, h / 160);
  ctx.translate(w / 2, h / 2);
  ctx.scale(s, s);

  const lum = (v) => {
    const c = Math.round(v * 255);
    return 'rgb(' + c + ',' + c + ',' + c + ')';
  };
  const ellipse = (x, y, rx, ry, rot, v) => {
    ctx.fillStyle = lum(v);
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  };
  const line = (x1, y1, x2, y2, v, width) => {
    ctx.strokeStyle = lum(v);
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  /* Крылья (полупрозрачные, рисуются первыми — тело поверх). */
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 13, 16);
    ctx.rotate(side * 0.15);
    ellipse(0, 0, 15, 56, 0, 0.4);
    // Контур крыла
    ctx.strokeStyle = lum(0.68);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 56, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Жилки: радиальные от плеча к краю
    ctx.strokeStyle = lum(0.6);
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 4; i += 1) {
      const tx = -12 + i * 8;
      ctx.beginPath();
      ctx.moveTo(side * -2, -50);
      ctx.quadraticCurveTo(tx * 0.4, 0, tx, 50);
      ctx.stroke();
    }
    // Поперечные ячейки у вершины крыла
    for (let i = 0; i < 3; i += 1) {
      const y = 26 + i * 11;
      ctx.beginPath();
      ctx.moveTo(-11 + i * 2, y);
      ctx.lineTo(9 - i * 2, y + 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* Ноги (3 пары, выглядывают из-под крыльев). */
  for (const side of [-1, 1]) {
    line(side * 15, -46, side * 27, -53, 0.8, 2.4);
    line(side * 16, -40, side * 29, -40, 0.8, 2.4);
    line(side * 15, -33, side * 27, -24, 0.8, 2.4);
  }

  /* Тело. */
  // Брюшко: сужающаяся капля
  ctx.fillStyle = lum(0.88);
  ctx.beginPath();
  ctx.moveTo(-14, -28);
  ctx.quadraticCurveTo(-13, 20, 0, 46);
  ctx.quadraticCurveTo(13, 20, 14, -28);
  ctx.closePath();
  ctx.fill();
  // Сегменты брюшка — тёмные полосы
  ctx.fillStyle = lum(0.55);
  for (let i = 0; i < 4; i += 1) {
    const y = -12 + i * 13;
    const half = 13 - i * 2.4;
    ctx.fillRect(-half, y, half * 2, 2.2);
  }
  // Грудь и переднеспинка
  ellipse(0, -38, 16, 11, 0, 0.92);
  ellipse(0, -52, 19, 8.5, 0, 0.9);
  // Голова
  ellipse(0, -66, 17, 9, 0, 0.95);
  // Усики
  line(-6, -73, -13, -79, 0.85, 1.6);
  line(6, -73, 13, -79, 0.85, 1.6);
  // Глаза — маркерная яркость 1.0
  ellipse(-16.5, -66, 4.6, 4.6, 0, 1);
  ellipse(16.5, -66, 4.6, 4.6, 0, 1);

  ctx.restore();
}

/* ===== Движок (только браузер) ===== */

function createMatrixEngine(canvas, options) {
  const opts = options || {};
  const reducedMotion = Boolean(opts.reducedMotion);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const styles = getComputedStyle(document.documentElement);
  const colorSignal = (styles.getPropertyValue('--color-signal') || '').trim() || '#4dffc4';
  const colorBright = '#d9ffef';

  let width = 0;
  let height = 0;
  let cell = 14;
  let cols = 0;
  let rows = 0;
  let base = null; // Float32Array базовых интенсивностей
  let normY = null; // нормализованная позиция вдоль тела для scanBand
  let eyes = []; // индексы глазных ячеек
  let digits = null; // Uint8Array индексов цифр
  let flipAt = null; // Float64Array времени следующей смены цифры
  let phase = null; // Float32Array фаз мерцания
  let sparkUntil = null; // Float64Array вспышек
  let rain = []; // фоновый "дождь" по колонкам
  let atlasGreen = null;
  let atlasBright = null;
  let rafId = 0;
  let running = false;
  let destroyed = false;
  let blinkStart = -1;
  let nextBlinkAt = 0;
  let glitch = { until: 0, nextAt: 0, rows: [], offset: 0 };

  function buildAtlas(color) {
    const size = cell * dpr;
    const atlas = document.createElement('canvas');
    atlas.width = size * MATRIX_DIGITS.length;
    atlas.height = size;
    const actx = atlas.getContext('2d');
    actx.fillStyle = color;
    actx.font = Math.floor(size * 0.82) + "px 'JetBrains Mono', ui-monospace, monospace";
    actx.textAlign = 'center';
    actx.textBaseline = 'middle';
    for (let i = 0; i < MATRIX_DIGITS.length; i += 1) {
      actx.fillText(MATRIX_DIGITS[i], i * size + size / 2, size * 0.56);
    }
    return atlas;
  }

  function buildMask() {
    const mask = document.createElement('canvas');
    mask.width = cols;
    mask.height = rows;
    const mctx = mask.getContext('2d', { willReadFrequently: true });
    const pad = 0.05;
    mctx.fillStyle = '#000';
    mctx.fillRect(0, 0, cols, rows);
    mctx.save();
    mctx.translate(cols * pad, rows * pad);
    drawCicadaSilhouette(mctx, cols * (1 - pad * 2), rows * (1 - pad * 2));
    mctx.restore();

    const data = mctx.getImageData(0, 0, cols, rows).data;
    base = new Float32Array(cols * rows);
    eyes = [];
    let minY = rows;
    let maxY = 0;
    for (let i = 0; i < cols * rows; i += 1) {
      const v = data[i * 4] / 255;
      base[i] = v;
      if (v > 0.03) {
        const y = Math.floor(i / cols);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (v > 0.97) eyes.push(i);
      }
    }
    const spanY = Math.max(1, maxY - minY);
    normY = new Float32Array(cols * rows);
    for (let i = 0; i < cols * rows; i += 1) {
      if (base[i] > 0.03) normY[i] = (Math.floor(i / cols) - minY) / spanY;
    }
  }

  function buildCells(now) {
    const n = cols * rows;
    digits = new Uint8Array(n);
    flipAt = new Float64Array(n);
    phase = new Float32Array(n);
    sparkUntil = new Float64Array(n);
    for (let i = 0; i < n; i += 1) {
      digits[i] = Math.floor(Math.random() * MATRIX_DIGITS.length);
      flipAt[i] = now + nextFlipDelay(Math.random());
      phase[i] = Math.random() * Math.PI * 2;
    }
  }

  function buildRain() {
    rain = [];
    for (let c = 0; c < cols; c += 1) {
      if (Math.random() < 0.45) {
        rain.push({
          col: c,
          head: Math.random() * rows,
          speed: 6 + Math.random() * 8,
          len: 5 + Math.floor(Math.random() * 6),
        });
      }
    }
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cell = Math.max(11, Math.round(Math.min(width, height) / 64));
    const grid = computeGrid(width, height, cell);
    cols = grid.cols;
    rows = grid.rows;
    atlasGreen = buildAtlas(colorSignal);
    atlasBright = buildAtlas(colorBright);
    buildMask();
    buildCells(performance.now());
    buildRain();
  }

  function drawGlyph(atlas, digit, col, row, alpha, shiftCols) {
    ctx.globalAlpha = alpha;
    const size = cell * dpr;
    ctx.drawImage(
      atlas,
      digit * size, 0, size, size,
      (col + (shiftCols || 0)) * cell, row * cell, cell, cell
    );
  }

  function render(now) {
    const t = now / 1000;
    ctx.clearRect(0, 0, width, height);

    /* Фоновый дождь — очень тусклый, за силуэтом. */
    if (!reducedMotion) {
      for (const drop of rain) {
        for (let k = 0; k < drop.len; k += 1) {
          const row = Math.floor(drop.head) - k;
          if (row < 0 || row >= rows) continue;
          const idx = row * cols + drop.col;
          const fade = 1 - k / drop.len;
          drawGlyph(atlasGreen, digits[idx], drop.col, row, 0.05 + 0.11 * fade * fade, 0);
        }
      }
    }

    /* Моргание глаз. */
    let blink = 1;
    if (!reducedMotion) {
      if (blinkStart < 0 && t >= nextBlinkAt) blinkStart = t;
      if (blinkStart >= 0) {
        const u = (t - blinkStart) / 0.26;
        if (u >= 1) {
          blinkStart = -1;
          nextBlinkAt = t + 3.5 + Math.random() * 4.5;
        } else {
          blink = blinkEnvelope(u);
        }
      }
    }

    /* Редкий глитч: пара строк уезжает на ячейку в сторону. */
    if (!reducedMotion) {
      if (t >= glitch.nextAt && t >= glitch.until) {
        glitch = {
          until: t + 0.16,
          nextAt: t + 7 + Math.random() * 6,
          rows: [
            Math.floor(rows * (0.15 + Math.random() * 0.7)),
            Math.floor(rows * (0.15 + Math.random() * 0.7)),
          ],
          offset: Math.random() < 0.5 ? -1 : 1,
        };
      }
    }
    const glitchActive = t < glitch.until;

    const breath = reducedMotion ? 1 : breathPulse(t);

    for (let i = 0; i < cols * rows; i += 1) {
      const b = base[i];
      if (b <= 0.03) continue;
      const row = (i / cols) | 0;
      const col = i - row * cols;

      let v = b * breath;
      if (!reducedMotion) {
        v *= 0.86 + 0.14 * Math.sin(t * 1.7 + phase[i]);
        v += scanBand(normY[i], t) * 0.35 * Math.min(1, b * 1.6);
        if (now >= flipAt[i]) {
          digits[i] = Math.floor(Math.random() * MATRIX_DIGITS.length);
          flipAt[i] = now + nextFlipDelay(Math.random());
          if (Math.random() < 0.04) sparkUntil[i] = now + 140;
        }
      }
      if (b > 0.97) v *= blink;
      const spark = sparkUntil[i] > now;
      const shifted = glitchActive && glitch.rows.indexOf(row) !== -1;
      if (spark || shifted) v = Math.max(v, 0.95);
      if (v <= 0.02) continue;
      const bright = v > 0.9;
      drawGlyph(bright ? atlasBright : atlasGreen, digits[i], col, row, Math.min(1, v), shifted ? glitch.offset : 0);
    }
    ctx.globalAlpha = 1;
  }

  let lastTick = 0;
  function tick(now) {
    if (destroyed || !running) return;
    const dt = lastTick ? Math.min((now - lastTick) / 1000, 0.1) : 1 / 60;
    lastTick = now;
    for (const drop of rain) {
      drop.head += drop.speed * dt;
      if (drop.head - drop.len > rows) {
        drop.head = -Math.random() * rows * 0.5;
        drop.speed = 6 + Math.random() * 8;
      }
    }
    render(now);
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (destroyed || running) return;
    running = true;
    if (reducedMotion) {
      running = false;
      render(performance.now());
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (destroyed) return;
      resize();
      if (reducedMotion) render(performance.now());
    }, 150);
  };
  window.addEventListener('resize', onResize);

  /* Не гоняем rAF, пока hero вне вьюпорта. */
  let observer = null;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    });
    observer.observe(canvas.parentElement);
  }

  resize();
  nextBlinkAt = performance.now() / 1000 + 2.5;
  start();

  /* Веб-шрифт может догрузиться позже атласов — перерисовать глифы. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (destroyed) return;
      atlasGreen = buildAtlas(colorSignal);
      atlasBright = buildAtlas(colorBright);
      if (reducedMotion) render(performance.now());
    });
  }

  return {
    destroy() {
      destroyed = true;
      stop();
      window.removeEventListener('resize', onResize);
      if (observer) observer.disconnect();
      ctx.clearRect(0, 0, width, height);
    },
  };
}

function initMatrixCicada(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const canvas = section.querySelector('canvas.hero-matrix');
  if (!canvas) return;
  const video = section.querySelector('video');

  const reducedMotion =
    typeof window.CikadaReducedMotion === 'boolean'
      ? window.CikadaReducedMotion
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let engine = null;
  const activate = () => {
    if (engine) return;
    section.classList.add('section--matrix-active');
    engine = createMatrixEngine(canvas, { reducedMotion });
  };
  const deactivate = () => {
    if (!engine) return;
    engine.destroy();
    engine = null;
    section.classList.remove('section--matrix-active');
  };

  if (!video || !video.getAttribute('src')) {
    activate();
    return;
  }
  if (video.error) activate();
  video.addEventListener('error', activate);
  video.addEventListener('loadedmetadata', deactivate);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    computeGrid,
    breathPulse,
    scanBand,
    blinkEnvelope,
    nextFlipDelay,
    drawCicadaSilhouette,
    initMatrixCicada,
  };
}
if (typeof window !== 'undefined') {
  window.CikadaMatrixCicada = {
    computeGrid,
    breathPulse,
    scanBand,
    blinkEnvelope,
    nextFlipDelay,
    drawCicadaSilhouette,
    initMatrixCicada,
  };
}
