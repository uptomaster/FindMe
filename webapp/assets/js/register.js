// 이미지 미리보기
const itemImage = document.getElementById('itemImage');
const imagePreview = document.getElementById('imagePreview');

itemImage.addEventListener('change', () => {
  const file = itemImage.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.style.backgroundImage = `url(${e.target.result})`;
      imagePreview.textContent = '';
      imagePreview.style.backgroundSize = 'cover';
      imagePreview.style.backgroundPosition = 'center';
    }
    reader.readAsDataURL(file);
  } else {
    imagePreview.style.backgroundImage = '';
    imagePreview.textContent = '이미지 미리보기';
  }
});

// 카테고리 선택
const categoryButtons = document.querySelectorAll('.category-btn');
const categoryInput = document.getElementById('itemCategory');

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    categoryInput.value = btn.dataset.value;
  });
});

// 폼 제출
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('유실물이 등록되었습니다!');
});
