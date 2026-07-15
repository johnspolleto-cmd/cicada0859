function generateSignalGroups(count, groupSize) {
  const groups = [];
  for (let i = 0; i < count; i += 1) {
    let group = '';
    for (let d = 0; d < groupSize; d += 1) {
      group += Math.floor(Math.random() * 10).toString();
    }
    groups.push(group.match(/.{1,2}/g).join(' '));
  }
  return groups;
}

function initSignalWave(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const ticker = section.querySelector('.signal__ticker');
  if (ticker) {
    ticker.textContent = generateSignalGroups(24, 6).join('   //   ');
  }

  const canvas = section.querySelector('canvas.signal__bars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const barCount = 48;
  const bars = new Array(barCount).fill(0).map(() => Math.random());
  let width = 0;
  let height = 0;

  const resize = () => {
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = canvas.clientHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / barCount;
    bars.forEach((value, i) => {
      const barHeight = value * height;
      ctx.fillStyle = i % 7 === 0 ? '#ffb020' : '#4dffc4';
      ctx.fillRect(i * barWidth, height - barHeight, barWidth * 0.6, barHeight);
    });
  };

  if (window.CikadaReducedMotion) {
    draw();
    return;
  }

  gsap.ticker.add(() => {
    for (let i = 0; i < bars.length; i += 1) {
      bars[i] += (Math.random() - 0.5) * 0.15;
      bars[i] = Math.min(1, Math.max(0.05, bars[i]));
    }
    draw();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateSignalGroups, initSignalWave };
}
if (typeof window !== 'undefined') {
  window.CikadaSignalWave = { generateSignalGroups, initSignalWave };
}
