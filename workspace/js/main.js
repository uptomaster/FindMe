// ========= Leaflet 지도 초기화 =========
const map = L.map('map').setView([37.5665, 126.9780], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// ========= 샘플 유실물 데이터 =========
const items = [
  {name:'지갑', reward:50000, location:'서울역 7번 출구', lat:37.554, lng:126.970, emotions:['분노','슬픔'], img:'https://via.placeholder.com/260x140?text=Wallet'},
  {name:'열쇠', reward:20000, location:'강남역 3번 출구', lat:37.497, lng:127.027, emotions:['불안'], img:'https://via.placeholder.com/260x140?text=Key'},
  {name:'이어폰', reward:10000, location:'홍대입구역 2번 출구', lat:37.556, lng:126.922, emotions:['당황'], img:'https://via.placeholder.com/260x140?text=Earphone'},
  {name:'우산', reward:0, location:'서울역 1번 출구', lat:37.556, lng:126.972, emotions:['기쁨'], img:'https://via.placeholder.com/260x140?text=Umbrella'},
  {name:'노트북', reward:150000, location:'잠실역 5번 출구', lat:37.513, lng:127.102, emotions:['슬픔'], img:'https://via.placeholder.com/260x140?text=Laptop'},
  {name:'가방', reward:80000, location:'신촌역 4번 출구', lat:37.556, lng:126.936, emotions:['분노','불안'], img:'https://via.placeholder.com/260x140?text=Bag'}
];

const container = document.getElementById('itemContainer');
const pagination = document.getElementById('pagination');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const itemsPerPage = 4;
let currentPage = 1;

// 카드 및 지도 마커 생성
function showItems() {
  container.innerHTML = '';
  items.forEach(item => item.marker?.remove());

  // 검색 필터
  let filtered = items.filter(item => item.name.includes(searchInput.value));

  // 정렬
  if(sortSelect.value === 'reward') filtered.sort((a,b)=>b.reward - a.reward);
  else if(sortSelect.value === 'recent') filtered = filtered; // 최근등록순 예시

  const start = (currentPage-1)*itemsPerPage;
  const pagedItems = filtered.slice(start, start+itemsPerPage);

  pagedItems.forEach(item => {
    const card = document.createElement('div');
    card.className='item-card';
    card.innerHTML=`
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>현상금: ${item.reward.toLocaleString()}원</p>
      <p>위치: ${item.location}</p>
      <div class="emotion-tags">
        ${item.emotions.map(e=>`<span class="emotion-tag emotion-${e}">${e}</span>`).join('')}
      </div>
      <div class="favorite-btn">&#10084;</div>
    `;
    container.appendChild(card);

    // 즐겨찾기 토글
    const favBtn = card.querySelector('.favorite-btn');
    favBtn.addEventListener('click',()=>favBtn.classList.toggle('active'));

    // 지도 마커
    item.marker = L.marker([item.lat, item.lng], {icon:L.icon({
      iconUrl:'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize:[32,32], iconAnchor:[16,32]
    })}).addTo(map).bindPopup(`${item.name} - ${item.location}`);

    // 카드 hover → 마커 애니메이션
    card.addEventListener('mouseenter',()=>item.marker.openPopup());
    card.addEventListener('mouseleave',()=>item.marker.closePopup());
  });
}

// 페이지네이션 생성
function setupPagination() {
  pagination.innerHTML = '';
  const pageCount = Math.ceil(items.length/itemsPerPage);
  for(let i=1;i<=pageCount;i++){
    const btn=document.createElement('button');
    btn.textContent=i;
    btn.className=i===currentPage?'active':'';
    btn.addEventListener('click',()=>{
      currentPage=i; showItems(); setupPagination();
    });
    pagination.appendChild(btn);
  }
}

// 검색/정렬 이벤트
searchInput.addEventListener('input',()=>{ currentPage=1; showItems(); setupPagination(); });
sortSelect.addEventListener('change',()=>{ currentPage=1; showItems(); setupPagination(); });

// 초기 렌더
showItems();
setupPagination();
