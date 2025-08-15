// darkmode.js
// ========= Dark Mode Toggle =========

// 토글 체크박스 요소 가져오기
const darkToggle = document.getElementById('darkToggle');

// 체크박스 상태 변경 시 body에 'dark' 클래스 토글
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkToggle.checked);
});

// 선택 사항: 페이지 로드 시 이전 모드 유지
// localStorage 사용
if (localStorage.getItem('darkMode') === 'true') {
  darkToggle.checked = true;
  document.body.classList.add('dark');
}

// 체크 상태가 바뀔 때마다 localStorage에 저장
darkToggle.addEventListener('change', () => {
  localStorage.setItem('darkMode', darkToggle.checked);
});
