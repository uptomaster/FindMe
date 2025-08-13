const canvas = document.createElement('canvas');
canvas.id = 'backgroundCanvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let time = 0;
let manualMode = null;
let stars = Array.from({ length: 200 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 1,
  alpha: Math.random()
}));
let sun = { x: 0, y: 0, radius: 60 };
let moon = { x: 0, y: 0, radius: 50 };

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gradient
  let topColor, bottomColor;
  if (time < 0.33) {
    topColor = '#87CEFA'; bottomColor = '#E0F7FF';
  } else if (time < 0.66) {
    topColor = '#FFD580'; bottomColor = '#FFB347';
  } else {
    topColor = '#0B0C2A'; bottomColor = '#1A1C4A';
  }
  let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sun
  if (time < 0.66) {
    sun.x = canvas.width * (time / 0.66) * 0.9;
    sun.y = canvas.height * 0.25;
    let sunGrad = ctx.createRadialGradient(sun.x, sun.y, 10, sun.x, sun.y, sun.radius);
    sunGrad.addColorStop(0, 'rgba(255, 230, 120, 1)');
    sunGrad.addColorStop(1, 'rgba(255, 230, 120, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Moon + stars
  if (time >= 0.66) {
    moon.x = canvas.width * ((time - 0.66) / 0.34) * 0.9;
    moon.y = canvas.height * 0.25;
    let moonGrad = ctx.createRadialGradient(moon.x, moon.y, 10, moon.x, moon.y, moon.radius);
    moonGrad.addColorStop(0, 'rgba(255, 255, 220, 1)');
    moonGrad.addColorStop(1, 'rgba(255, 255, 220, 0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
    ctx.fill();

    stars.forEach(s => {
      s.alpha += (Math.random() - 0.5) * 0.05;
      if (s.alpha > 1) s.alpha = 1;
      if (s.alpha < 0) s.alpha = 0;
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (!manualMode) time += 0.0004;
  if (time > 1) time = 0;

  updateHeaderFooterColors();
  requestAnimationFrame(drawBackground);
}

function updateHeaderFooterColors() {
  let header = document.querySelector('header');
  let footer = document.querySelector('footer');
  let title = document.querySelector('header h1');
  if (!header || !footer || !title) return;

  let bgColor, textColor;
  if (time < 0.33) {
    bgColor = '#FFFBF0'; textColor = '#1A237E';
  } else if (time < 0.66) {
    bgColor = '#FFD9B5'; textColor = '#FF7F50';
  } else {
    bgColor = '#2C2E36'; textColor = '#FFF475';
  }
  header.style.background = bgColor;
  footer.style.background = bgColor;
  title.style.color = textColor;
}

drawBackground();
