// 八大行星資料：模擬軌道與大小為示意，並非真實天文比例。
const planetsData = [
  {id:'mercury',name:'水星',color:'#b8b8c5',size:5,orbit:12,duration:8,year:'88 天',distance:'第 1 位',symbol:'☿',copy:'離太陽最近、體積最小的行星。表面佈滿撞擊坑，白天與夜晚的溫差極大。'},
  {id:'venus',name:'金星',color:'#f2c17b',size:7,orbit:20,duration:15,year:'225 天',distance:'第 2 位',symbol:'♀',copy:'夜空中最明亮的行星。濃厚的大氣造成強烈溫室效應，讓表面成為太陽系最炎熱之處。'},
  {id:'earth',name:'地球',color:'#68aaff',size:8,orbit:28,duration:24,year:'365 天',distance:'第 3 位',symbol:'♁',copy:'我們唯一已知有生命的家園。液態水、豐富的大氣與磁場，讓地球成為獨特的藍色星球。'},
  {id:'mars',name:'火星',color:'#ef795f',size:6.5,orbit:36,duration:45,year:'687 天',distance:'第 4 位',symbol:'♂',copy:'以紅色外表聞名的岩質行星，擁有太陽系最高的火山，也保留著古老河流的痕跡。'},
  {id:'jupiter',name:'木星',color:'#e7b989',size:14,orbit:45,duration:110,year:'11.9 年',distance:'第 5 位',symbol:'♃',copy:'太陽系最大的行星，以氣體為主。標誌性的大紅斑是一場持續數百年的巨大風暴。'},
  {id:'saturn',name:'土星',color:'#e8d18b',size:12,orbit:55,duration:260,year:'29.4 年',distance:'第 6 位',symbol:'♄',copy:'壯麗的冰與岩石環系圍繞著這顆氣體巨行星，是太陽系最容易辨認的天體之一。'},
  {id:'uranus',name:'天王星',color:'#83d8dd',size:10,orbit:65,duration:520,year:'84 年',distance:'第 7 位',symbol:'⛢',copy:'冰巨行星，呈現柔和的藍綠色。它幾乎側躺著自轉，使季節變化格外漫長。'},
  {id:'neptune',name:'海王星',color:'#6486ff',size:10,orbit:75,duration:940,year:'165 年',distance:'第 8 位',symbol:'♆',copy:'遠在太陽系邊緣的深藍色冰巨行星，擁有太陽系中最快速的行星風。'}
];

const orbitContainer = document.querySelector('#orbits');
const planetContainer = document.querySelector('#planets');
const planetList = document.querySelector('#planet-list');
const scene = document.querySelector('#scene');
const playButton = document.querySelector('#play-button');
const speedRange = document.querySelector('#speed-range');
const speedOutput = document.querySelector('#speed-output');
let selectedPlanet = 'earth';
let isPlaying = true;
let speed = 1;
let toastTimer;

// 依資料建立軌道、可點選行星，以及控制面板中的行星按鈕。
planetsData.forEach((planet) => {
  const orbit = document.createElement('div');
  orbit.className = 'orbit';
  orbit.dataset.planet = planet.id;
  orbit.style.width = `${planet.orbit}%`;
  orbitContainer.append(orbit);

  const body = document.createElement('div');
  body.className = 'planet';
  body.dataset.planet = planet.id;
  body.setAttribute('role', 'button');
  body.setAttribute('tabindex', '0');
  body.setAttribute('aria-label', `查看${planet.name}資訊`);
  body.style.setProperty('--orbit', `${planet.orbit}%`);
  body.style.setProperty('--size', `${planet.size}px`);
  body.style.setProperty('--planet-color', planet.color);
  body.style.setProperty('--duration', `${planet.duration}s`);
  body.innerHTML = `<span class="planet-dot" title="${planet.name}"></span><span class="planet-label">${planet.name}</span>`;
  body.addEventListener('click', () => selectPlanet(planet.id));
  body.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectPlanet(planet.id);
    }
  });
  planetContainer.append(body);

  const chip = document.createElement('button');
  chip.className = 'planet-chip';
  chip.type = 'button';
  chip.dataset.planet = planet.id;
  chip.style.setProperty('--planet-color', planet.color);
  chip.setAttribute('aria-pressed', 'false');
  chip.innerHTML = `<span class="chip-dot" aria-hidden="true"></span>${planet.name}`;
  chip.addEventListener('click', () => selectPlanet(planet.id));
  planetList.append(chip);
});

// 更新被選取的行星、軌道提示和詳細資料。
function selectPlanet(id) {
  const planet = planetsData.find((item) => item.id === id);
  if (!planet) return;
  selectedPlanet = id;
  document.querySelectorAll('.planet, .planet-chip, .orbit').forEach((element) => {
    const active = element.dataset.planet === id;
    element.classList.toggle('is-selected', active);
    if (element.classList.contains('planet-chip')) element.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#detail-symbol').textContent = planet.symbol;
  document.querySelector('#detail-symbol').style.color = planet.color;
  document.querySelector('#detail-name').textContent = planet.name;
  document.querySelector('#detail-order').textContent = String(planetsData.indexOf(planet) + 1).padStart(2, '0');
  document.querySelector('#detail-copy').textContent = planet.copy;
  document.querySelector('#detail-distance').textContent = planet.distance;
  document.querySelector('#detail-year').textContent = planet.year;
}

// 以 CSS 動畫播放狀態控制全部行星，速度滑桿同步更新動畫時間。
function updatePlayback() {
  scene.style.setProperty('--play-state', isPlaying ? 'running' : 'paused');
  playButton.setAttribute('aria-label', isPlaying ? '暫停動畫' : '播放動畫');
  playButton.querySelector('.play-icon').textContent = isPlaying ? 'Ⅱ' : '▶';
  playButton.querySelector('.play-text').textContent = isPlaying ? '暫停運行' : '繼續運行';
  document.querySelectorAll('.planet').forEach((body) => {
    const planet = planetsData.find((item) => item.id === body.dataset.planet);
    body.style.setProperty('--duration', `${planet.duration / speed}s`);
  });
}

playButton.addEventListener('click', () => {
  isPlaying = !isPlaying;
  updatePlayback();
});

speedRange.addEventListener('input', () => {
  speed = Number(speedRange.value);
  speedOutput.value = `${speed.toFixed(2).replace(/0$/, '').replace(/\.0$/, '')}×`;
  const percent = ((speed - Number(speedRange.min)) / (Number(speedRange.max) - Number(speedRange.min))) * 100;
  speedRange.style.background = `linear-gradient(90deg,#a28af2 0%,#a28af2 ${percent}%,#303850 ${percent}%,#303850 100%)`;
  updatePlayback();
});

document.querySelector('#reset-button').addEventListener('click', () => {
  speed = 1;
  speedRange.value = '1';
  speedRange.dispatchEvent(new Event('input'));
  // 透過短暫重啟動畫，讓所有行星回到軌道起點。
  document.querySelectorAll('.planet').forEach((body) => {
    body.style.animation = 'none';
    void body.offsetWidth;
    body.style.animation = '';
  });
  selectPlanet('earth');
  showToast('行星位置與速度已重設');
});

document.querySelector('#help-button').addEventListener('click', () => {
  showToast('點選行星可查看介紹；使用控制面板調整公轉速度。');
});

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

selectPlanet(selectedPlanet);
updatePlayback();
