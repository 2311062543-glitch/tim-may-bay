
const openEnvelope = document.getElementById('openEnvelope');
const greetingCard = document.getElementById('greetingCard');
const envelopeArea = document.getElementById('envelopeArea');
const tapHint = document.getElementById('tapHint');
const wishLines = [...document.querySelectorAll('.wish-line')];
const flowerButton = document.getElementById('flowerButton');
const flowerMessage = document.getElementById('flowerMessage');
const replayButton = document.getElementById('replayButton');
const petalLayer = document.getElementById('petalLayer');

const giftPage = document.getElementById('giftPage');
const drawButton = document.getElementById('drawButton');
const giftStage = document.getElementById('giftStage');
const giftResult = document.getElementById('giftResult');
const backToCardButton = document.getElementById('backToCardButton');

let petalTimer = null;
let wishTimers = [];
let giftOpened = false;

function clearWishTimers() {
  wishTimers.forEach(clearTimeout);
  wishTimers = [];
}

function showWishesOneByOne() {
  clearWishTimers();

  wishLines.forEach(line => line.classList.remove('visible'));

  wishLines.forEach((line, index) => {
    const timer = setTimeout(() => {
      line.classList.add('visible');
    }, 500 + index * 850);

    wishTimers.push(timer);
  });
}

function makePetal(burst = false) {
  const petal = document.createElement('span');
  petal.className = 'petal';

  const flowers = ['🌸', '🌷', '💮', '🌺', '💕'];
  petal.textContent =
    flowers[Math.floor(Math.random() * flowers.length)];

  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.fontSize = `${14 + Math.random() * 20}px`;
  petal.style.setProperty(
    '--drift',
    `${Math.random() * 180 - 90}px`
  );
  petal.style.setProperty(
    '--spin',
    `${Math.random() * 700 - 350}deg`
  );

  petal.style.animationDuration = burst
    ? `${2.5 + Math.random() * 2}s`
    : `${5 + Math.random() * 5}s`;

  petalLayer.appendChild(petal);

  petal.addEventListener(
    'animationend',
    () => petal.remove(),
    { once: true }
  );
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

  window.setTimeout(() => {
    greetingCard.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, 100);
}

function replayCard() {
  document.body.classList.remove('opened', 'gift-mode');

  openEnvelope.setAttribute('aria-expanded', 'false');
  greetingCard.setAttribute('aria-hidden', 'true');
  envelopeArea.setAttribute('aria-hidden', 'false');
  giftPage.setAttribute('aria-hidden', 'true');

  tapHint.textContent =
    'Chạm vào phong bì để mở thiệp của Đào Bá Hoàng';

  wishLines.forEach(line => line.classList.remove('visible'));
  clearWishTimers();

  flowerMessage.textContent = '';

  giftOpened = false;
  giftResult.textContent = '';
  giftStage.classList.remove('won', 'spinning');
  giftStage.innerHTML =
    '<div class="gift-box">🎁</div><p>Món quà nhỏ đang chờ bạn...</p>';

  drawButton.disabled = false;
  drawButton.textContent = '🌷 Nhận hoa từ Đào Bá Hoàng 🌷';

  stopPetals();
  petalLayer.replaceChildren();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

openEnvelope.addEventListener('click', openCard);

// Nhấn nhận hoa để hiện lời chúc và chuyển sang trang quà.
flowerButton.addEventListener('click', () => {
  flowerMessage.textContent =
    'Chúc mọi người luôn xinh đẹp, hạnh phúc và tỏa sáng! 💐';

  for (let i = 0; i < 24; i++) {
    window.setTimeout(() => makePetal(true), i * 65);
  }

  // Tránh chuyển trang nhiều lần khi nhấn liên tục.
  if (giftOpened) return;
  giftOpened = true;

  window.setTimeout(() => {
    document.body.classList.add('gift-mode');

    giftPage.setAttribute('aria-hidden', 'false');
    greetingCard.setAttribute('aria-hidden', 'true');

    giftResult.textContent = '';

    giftStage.classList.remove('won', 'spinning');
    giftStage.innerHTML =
      '<div class="gift-box">🎁</div><p>Món quà bí mật đang chờ bạn...</p>';

    drawButton.disabled = false;
    drawButton.textContent = '🌷 Nhận hoa từ Đào Bá Hoàng 🌷';

    giftPage.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, 900);
});

// Chỉ có duy nhất một món quà: HOA.
drawButton.addEventListener('click', () => {
  if (drawButton.disabled) return;

  drawButton.disabled = true;
  drawButton.textContent = '💐 Đang chuẩn bị hoa...';

  giftResult.textContent = '';
  giftStage.classList.remove('won');
  giftStage.classList.add('spinning');

  giftStage.innerHTML =
    '<div class="gift-box">🌷</div><p>Một món quà yêu thương...</p>';

  window.setTimeout(() => {
    giftStage.classList.remove('spinning');
    giftStage.classList.add('won');

    giftStage.innerHTML = `
      <div class="gift-box">💐</div>
      <p><strong>Một bó hoa dành tặng bạn!</strong></p>
    `;

    giftResult.textContent =
      'Tặng bạn một bó hoa thay lời yêu thương. ' +
      'Chúc bạn ngày 20/10 thật hạnh phúc, luôn bình an, ' +
      'rạng rỡ và được yêu thương thật nhiều! 💗🌷';

    drawButton.textContent = '💖 Bạn đã nhận được hoa!';

    for (let i = 0; i < 24; i++) {
      window.setTimeout(() => makePetal(true), i * 70);
    }
  }, 1400);
});

// Quay lại trang thiệp.
backToCardButton.addEventListener('click', () => {
  document.body.classList.remove('gift-mode');

  giftPage.setAttribute('aria-hidden', 'true');
  greetingCard.setAttribute('aria-hidden', 'false');

  greetingCard.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
});

// Tạo một vài cánh hoa ngay khi mở trang.
for (let i = 0; i < 7; i++) {
  window.setTimeout(() => makePetal(false), i * 450);
}
