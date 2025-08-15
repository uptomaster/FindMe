window.onload = () => {
    const canvas = document.createElement('canvas');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';

    // 파티클 생성
    const particles = [];
    const particleCount = 200; // 별 개수 증가

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            baseRadius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.3,
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2,
            color: `rgba(${255 - Math.random()*30}, ${240 - Math.random()*20}, ${200 - Math.random()*50}, `
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.beginPath();
            // 반짝임 효과: radius 변화를 줌
            p.radius = p.baseRadius + Math.sin(Date.now() * 0.002 + p.x + p.y) * 0.5;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ")";
            ctx.fill();

            // 부드럽게 움직이기
            p.x += p.dx;
            p.y += p.dy;

            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
            if (p.y > canvas.height) p.y = 0;
            if (p.y < 0) p.y = canvas.height;

            // alpha 조금 변해서 반짝임 강화
            p.alpha += (Math.random() - 0.5) * 0.02;
            if (p.alpha > 0.9) p.alpha = 0.9;
            if (p.alpha < 0.2) p.alpha = 0.2;
        });

        requestAnimationFrame(drawParticles);
    }

    drawParticles();
};
