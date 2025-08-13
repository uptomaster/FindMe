window.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.bg-btn');
    let currentBg = 'morning';

    function setBackground(mode) {
        currentBg = mode;
        document.body.style.background = '';
        if (mode === 'morning') {
            document.body.style.background = 'linear-gradient(to bottom, #87ceeb, #ccefff)';
        } else if (mode === 'afternoon') {
            document.body.style.background = 'linear-gradient(to bottom, #ffb347, #ffcc99)';
        } else if (mode === 'night') {
            document.body.style.background = 'linear-gradient(to bottom, #0b0c2a, #2c3e50)';
        }
        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.bg-btn[data-bg="${mode}"]`).classList.add('active');
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            setBackground(btn.dataset.bg);
        });
    });

    setBackground('morning'); // 초기값
});
