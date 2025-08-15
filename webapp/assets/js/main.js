// ========= Leaflet 지도 초기화 =========
const map = L.map('map').setView([37.5665, 126.9780], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// ========= 샘플 유실물 데이터 =========
const items = [
  { id: 1, name: '지갑', reward: 50000, location: '서울역 7번 출구', lat: 37.554, lng: 126.970, emotions: ['분노', '슬픔'], img: 'https://via.placeholder.com/260x140?text=Wallet' },
  { id: 2, name: '열쇠', reward: 20000, location: '강남역 3번 출구', lat: 37.497, lng: 127.027, emotions: ['불안'], img: 'https://via.placeholder.com/260x140?text=Key' },
  { id: 3, name: '이어폰', reward: 10000, location: '홍대입구역 2번 출구', lat: 37.556, lng: 126.922, emotions: ['당황'], img: 'https://via.placeholder.com/260x140?text=Earphone' },
  { id: 4, name: '우산', reward: 0, location: '서울역 1번 출구', lat: 37.556, lng: 126.972, emotions: ['기쁨'], img: 'https://via.placeholder.com/260x140?text=Umbrella' },
  { id: 5, name: '노트북', reward: 150000, location: '잠실역 5번 출구', lat: 37.513, lng: 127.102, emotions: ['슬픔'], img: 'https://via.placeholder.com/260x140?text=Laptop' },
  { id: 6, name: '가방', reward: 80000, location: '신촌역 4번 출구', lat: 37.556, lng: 126.936, emotions: ['분노', '불안'], img: 'https://via.placeholder.com/260x140?text=Bag' }
];

const container = document.getElementById('itemContainer');
const pagination = document.getElementById('pagination');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const itemsPerPage = 4;
let currentPage = 1;

// ========= UI 생성 =========
function createModal(item) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>참가 완료!</h2>
      <p><strong>${item.name}</strong> 배틀에 참가했습니다.</p>
      <p>위치: ${item.location}</p>
      <p>현상금: ${item.reward.toLocaleString()}원</p>
      <button id="closeModal">확인</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('closeModal').addEventListener('click', () => modal.remove());
}

function showSlideBanner(message) {
  const banner = document.createElement('div');
  banner.className = 'slide-banner';
  banner.textContent = message;
  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('active'), 50); // 애니메이션 시작
  setTimeout(() => {
    banner.classList.remove('active');
    setTimeout(() => banner.remove(), 500);
  }, 3000);
}

function showCoinAnimation(amount) {
  for (let i = 0; i < 8; i++) {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.textContent = '💰';
    coin.style.left = `${50 + (Math.random() * 100 - 50)}%`;
    coin.style.animationDelay = `${Math.random() * 0.3}s`;
    document.body.appendChild(coin);

    setTimeout(() => coin.remove(), 1500);
  }
}

// ========= 카드 및 지도 마커 생성 =========
function showItems() {
  container.innerHTML = '';
  items.forEach(item => item.marker?.remove());

  // 검색 필터
  let filtered = items.filter(item => item.name.includes(searchInput.value));

  // 정렬
  if (sortSelect.value === 'reward') filtered.sort((a, b) => b.reward - a.reward);

  const start = (currentPage - 1) * itemsPerPage;
  const pagedItems = filtered.slice(start, start + itemsPerPage);

  pagedItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>현상금: ${item.reward.toLocaleString()}원</p>
      <p>위치: ${item.location}</p>
      <div class="emotion-tags">
        ${item.emotions.map(e => `<span class="emotion-tag emotion-${e}">${e}</span>`).join('')}
      </div>
      <div class="favorite-btn">&#10084;</div>
      <button class="join-btn" data-id="${item.id}">참가</button>
    `;
    container.appendChild(card);

    // 즐겨찾기 토글
    card.querySelector('.favorite-btn').addEventListener('click', e => e.target.classList.toggle('active'));

    // 참가 버튼 이벤트
    card.querySelector('.join-btn').addEventListener('click', () => {
      if (confirm(`${item.name} 배틀에 참가하시겠습니까?`)) {
        joinBattle(item);
      }
    });

    // 지도 마커
    item.marker = L.marker([item.lat, item.lng], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    }).addTo(map).bindPopup(`${item.name} - ${item.location}`);

    // 카드 hover → 마커 팝업
    card.addEventListener('mouseenter', () => item.marker.openPopup());
    card.addEventListener('mouseleave', () => item.marker.closePopup());
  });
}

// ========= 참가 로직 =========
function joinBattle(item) {
  // 모달 표시
  createModal(item);
  // 슬라이드 배너 표시
  showSlideBanner(`${item.name} 배틀에 참가했습니다!`);
  // 코인 애니메이션
  showCoinAnimation(item.reward);
  // 지도 마커 강조
  map.setView([item.lat, item.lng], 15);
  item.marker.openPopup();
}

// ========= 페이지네이션 =========
function setupPagination() {
  pagination.innerHTML = '';
  const pageCount = Math.ceil(items.length / itemsPerPage);
  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.addEventListener('click', () => {
      currentPage = i;
      showItems();
      setupPagination();
    });
    pagination.appendChild(btn);
  }
}

// ========= 이벤트 =========
searchInput.addEventListener('input', () => { currentPage = 1; showItems(); setupPagination(); });
sortSelect.addEventListener('change', () => { currentPage = 1; showItems(); setupPagination(); });

// ========= 초기 렌더 =========
showItems();
setupPagination();
