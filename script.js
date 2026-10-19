const openEnvelope = document.getElementById('openEnvelope');
const greetingCard = document.getElementById('greetingCard');
const envelopeArea = document.getElementById('envelopeArea');
const tapHint = document.getElementById('tapHint');
const wishLines = [...document.querySelectorAll('.wish-line')];
const flowerButton = document.getElementById('flowerButton');
const flowerMessage = document.getElementById('flowerMessage');
const replayButton = document.getElementById('replayButton');
const petalLayer = document.getElementById('petalLayer');

let petalTimer = null;
let wishTimers = [];

function clearWishTimers() {
  wishTimers.forEach(clearTimeout);
  wishTimers = [];
}

function showWishesOneByOne() {
  clearWishTimers();
  wishLines.forEach(line => line.classList.remove('visible'));
  wishLines.forEach((line, index) => {
    const timer = setTimeout(() => line.classList.add('visible'), 500 + index * 850);
    wishTimers.push(timer);
  });
}

function makePetal(burst = false) {
  const petal = document.createElement('span');
  petal.className = 'petal';
  const flowers = ['🌸', '🌷', '💮', '🌺', '💕'];
  petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.fontSize = `${14 + Math.random() * 20}px`;
  petal.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
  petal.style.setProperty('--spin', `${Math.random() * 700 - 350}deg`);
  petal.style.animationDuration = `${burst ? 2.5 + Math.random() * 2 : 5 + Math.random() * 5}s`;
  petalLayer.appendChild(petal);
  petal.addEventListener('animationend', () => petal.remove(), { once: true });
}

function startPetals() {
  if (petalTimer) return;
  petalTimer = setInterval(() => makePetal(false), 650);
}

function stopPetals() {
  if (petalTimer) clearInterval(petalTimer);
  petalTimer = null;
}

function openCard() {
  document.body.classList.add('opened');
  openEnvelope.setAttribute('aria-expanded', 'true');
  greetingCard.setAttribute('aria-hidden', 'false');
  envelopeArea.setAttribute('aria-hidden', 'true');
  tapHint.textContent = '';
  showWishesOneByOne();
  startPetals();
  window.setTimeout(() => greetingCard.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

function replayCard() {
  document.body.classList.remove('opened');
  openEnvelope.setAttribute('aria-expanded', 'false');
  greetingCard.setAttribute('aria-hidden', 'true');
  envelopeArea.setAttribute('aria-hidden', 'false');
  tapHint.textContent = 'Chạm vào phong bì để mở thiệp nhé';
  wishLines.forEach(line => line.classList.remove('visible'));
  clearWishTimers();
  flowerMessage.textContent = '';
  stopPetals();
  petalLayer.replaceChildren();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

openEnvelope.addEventListener('click', openCard);

flowerButton.addEventListener('click', () => {
  flowerMessage.textContent = 'Chúc các chị luôn xinh đẹp, hạnh phúc và tỏa sáng! ✨';
  for (let i = 0; i < 24; i++) {
    setTimeout(() => makePetal(true), i * 65);
  }
});

replayButton.addEventListener('click', replayCard);

// Tạo một vài cánh hoa nhẹ nhàng ngay từ đầu.
for (let i = 0; i < 7; i++) {
  setTimeout(() => makePetal(false), i * 450);
}


// Chuyển sang trang random quà sau khi nhấn "Nhận hoa từ em".
const giftPage = document.getElementById('giftPage');
const drawButton = document.getElementById('drawButton');
const giftStage = document.getElementById('giftStage');
const giftResult = document.getElementById('giftResult');
const backToCardButton = document.getElementById('backToCardButton');

flowerButton.addEventListener('click', () => {
  window.setTimeout(() => {
    document.body.classList.add('gift-mode');
    giftPage.setAttribute('aria-hidden', 'false');
    greetingCard.setAttribute('aria-hidden', 'true');
    giftResult.textContent = '';
    giftStage.classList.remove('won', 'spinning');
    giftStage.innerHTML = '<div class="gift-box">🎁</div><p>Món quà bí mật đang chờ chị khám phá...</p>';
    drawButton.disabled = false;
    drawButton.textContent = '✨ Random quà ✨';
    giftPage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 900);
});

drawButton.addEventListener('click', () => {
  if (drawButton.disabled) return;

  const gifts = [
    { name: 'Kẹo ngọt', emoji: '🍬', message: 'Chúc chị luôn ngọt ngào và vui vẻ!' },
    { name: 'Bút xinh', emoji: '🖊️', message: 'Chúc chị viết tiếp thật nhiều thành công!' },
    { name: 'Sticker dễ thương', emoji: '🌟', message: 'Chúc mỗi ngày của chị đều có thật nhiều điều đáng yêu!' },
    { name: 'Nơ xinh', emoji: '🎀', message: 'Chúc chị luôn rạng rỡ, tự tin và tỏa sáng!' }
  ];

  drawButton.disabled = true;
  drawButton.textContent = 'Đang chọn quà...';
  giftResult.textContent = '';
  giftStage.classList.remove('won');
  giftStage.classList.add('spinning');

  let ticks = 0;
  const spin = window.setInterval(() => {
    const preview = gifts[Math.floor(Math.random() * gifts.length)];
    giftStage.innerHTML = `<div class="gift-box">${preview.emoji}</div><p>${preview.name}</p>`;
    ticks++;

    if (ticks >= 14) {
      window.clearInterval(spin);
      const selected = gifts[Math.floor(Math.random() * gifts.length)];
      giftStage.classList.remove('spinning');
      giftStage.classList.add('won');
      giftStage.innerHTML = `<div class="gift-box">${selected.emoji}</div><p><strong>${selected.name}</strong></p>`;
      giftResult.textContent = `${selected.message} 💗`;
      drawButton.textContent = '🎁 Bốc thăm lại';
      drawButton.disabled = false;
      for (let i = 0; i < 14; i++) {
        window.setTimeout(() => makePetal(true), i * 70);
      }
    }
  }, 110);
});

backToCardButton.addEventListener('click', () => {
  document.body.classList.remove('gift-mode');
  giftPage.setAttribute('aria-hidden', 'true');
  greetingCard.setAttribute('aria-hidden', 'false');
  greetingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
