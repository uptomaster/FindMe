const locationEl = document.getElementById('location');
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const timeEl = document.getElementById('currentTime');

// 시간 표시
function updateTime() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// 날씨 API (OpenWeatherMap)
function fetchWeather(lat, lon) {
  const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`)
    .then(res => res.json())
    .then(data => {
      locationEl.textContent = `위치: ${data.name}`;
      tempEl.textContent = `온도: ${data.main.temp}°C`;
      descEl.textContent = `날씨: ${data.weather[0].description}`;
    })
    .catch(() => {
      locationEl.textContent = "날씨 정보를 불러올 수 없습니다.";
    });
}

// 위치 권한 요청
navigator.geolocation.getCurrentPosition(
  pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
  () => locationEl.textContent = "위치 권한이 필요합니다."
);
