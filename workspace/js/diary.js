const form = document.getElementById('diaryForm');
const diaryList = document.getElementById('diaryEntries');

let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

function renderDiary() {
  diaryList.innerHTML = '';
  diaryEntries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${entry.date}</strong> - ${entry.content}
      <button onclick="deleteEntry(${index})">삭제</button>
    `;
    diaryList.appendChild(li);
  });
}

function deleteEntry(index) {
  diaryEntries.splice(index, 1);
  localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
  renderDiary();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const content = document.getElementById('content').value;

  diaryEntries.push({ date, content });
  localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
  renderDiary();
  form.reset();
});

renderDiary();
