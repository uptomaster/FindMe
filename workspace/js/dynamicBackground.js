const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 시간 변수
let time = 0; // 0~1 범위: 0=morning, 0.33=afternoon, 0.66=night
let manualMode = null; // 버튼 클릭 시 즉시 선택

// 별 배열
let stars = [];
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    alpha: Math.random()
  });
}

// 해/달 객체
let sun = { x: 0, y: 0, radius: 60 };
let moon = { x: 0, y: 0, radius: 50 };

// 버튼 즉시 선택 이벤트
document.querySelectorAll('.bg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const selected = btn.dataset.mode;
    manualMode = selected;
    document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (selected === 'morning') time = 0;
    else if (selected === 'afternoon') time = 0.33;
    else if (selected === 'night') time = 0.66;
  });
});

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 배경 색상
  let topColor, bottomColor;
  if (time < 0.33) { // Morning
    topColor = '#87CEFA';
    bottomColor = '#E0F7FF';
  } else if (time < 0.66) { // Afternoon
    topColor = '#FFAD33';
    bottomColor = '#FFD9B5';
  } else { // Night
    topColor = '#0B0C2A';
    bottomColor = '#1A1C4A';
  }
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

// 해/달 높이 통일
const sunMoonY = canvas.height * 0.25; // 모든 시간대 y좌표 통일

// 해 위치
if (time < 0.66) { // Morning & Afternoon
    if (time < 0.33) { // Morning
        sun.x = canvas.width * 0.1 + (time / 0.33) * canvas.width * 0.3;
    } else { // Afternoon
        const afternoonProgress = (time - 0.33) / 0.33;
        sun.x = canvas.width * 0.1 + afternoonProgress * canvas.width * 0.25; // 왼쪽 이동
    }
    sun.y = sunMoonY;

    // 해 색상 (노을일 때 더 노란색)
    let sunColor = (time < 0.33) ? 'rgba(255,255,150,1)' : 'rgba(255, 210, 100,1)';
    let sunGrad = ctx.createRadialGradient(sun.x, sun.y, 10, sun.x, sun.y, sun.radius);
    sunGrad.addColorStop(0, sunColor);
    sunGrad.addColorStop(1, 'rgba(255,255,150,0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI*2);
    ctx.fill();
}

// 달 + 별
if (time >= 0.66) {
    const nightProgress = (time - 0.66) / 0.34;
    moon.x = canvas.width * 0.15 + nightProgress * canvas.width * 0.25; // 왼쪽 이동
    moon.y = sunMoonY;

    let moonGrad = ctx.createRadialGradient(moon.x, moon.y, 10, moon.x, moon.y, moon.radius);
    moonGrad.addColorStop(0, 'rgba(255, 255, 220, 1)');
    moonGrad.addColorStop(1, 'rgba(255, 255, 220, 0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI*2);
    ctx.fill();
}

  // 시간 흐름
  if (!manualMode) time += 0.0003; // 매우 느리게
  if (time > 1) time = 0;

  // Header / Footer / FindMe 글씨 색 업데이트
  updateHeaderFooterColors();

  requestAnimationFrame(drawBackground);
}

function updateHeaderFooterColors() {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const title = document.querySelector('header h1');

  let bgColor, textColor;
  if (time < 0.33) { // Morning
    bgColor = '#FFFBF0';
    textColor = '#1A237E';
  } else if (time < 0.66) { // Afternoon
    bgColor = '#FFD9B5';
    textColor = '#FF5E3A';
  } else { // Night
    bgColor = '#2C2E36';
    textColor = '#FFF475';
  }

  header.style.background = bgColor;
  footer.style.background = bgColor;
  title.style.color = textColor;
  title.style.transition = 'color 1s linear';
}

drawBackground();
