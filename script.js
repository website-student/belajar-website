const scenes = [...document.querySelectorAll('.scene')];
const audio = document.getElementById('birthdayAudio');
let fadeTimer;

function showScene(id) {
  scenes.forEach((scene) => {
    const visible = scene.id === id;
    scene.hidden = !visible;
    scene.classList.toggle('is-active', visible);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startMusic() {
  audio.volume = 0.72;
  audio.currentTime = 0;

  audio.play().then(() => {
    document.getElementById('musicLabel').textContent =
      '♫ Lagu ulang tahun buat kamu';
  }).catch(() => {
    document.getElementById('musicLabel').textContent =
      '♫ Ketuk layar sekali lagi kalau musik belum mulai';
  });
}

function makeFireworks() {
  const field = document.getElementById('fireworks');
  const colors = ['#ffe39a', '#ff9cbe', '#c9a8ff', '#a5f3e1', '#fff4df'];

  for (let i = 0; i < 56; i += 1) {
    const spark = document.createElement('i');
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 130;

    spark.className = 'spark-particle';
    spark.style.setProperty('--x', `${12 + Math.random() * 76}%`);
    spark.style.setProperty('--y', `${10 + Math.random() * 70}%`);
    spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    spark.style.setProperty('--delay', `${Math.random() * 2.4}s`);
    spark.style.setProperty('--spark', colors[i % colors.length]);
    field.append(spark);
  }
}

document.getElementById('openEnvelope').addEventListener('click', (event) => {
  const envelope = event.currentTarget;
  if (envelope.classList.contains('is-opening')) return;

  envelope.classList.add('is-opening');
  document.querySelector('.open-copy').textContent =
    'Amplopnya terbuka! Masukkan sandi buat lanjut.';

  window.setTimeout(() => {
    document.getElementById('passwordGate').hidden = false;
    document.getElementById('birthdayPassword').focus();
  }, 620);
});

document.getElementById('passwordGate').addEventListener('submit', (event) => {
  event.preventDefault();

  const field = document.getElementById('birthdayPassword');
  const hint = document.getElementById('passwordHint');

  if (field.value.trim() !== '21112007') {
    hint.textContent = 'Belum pas nih, coba lagi ya ♡';
    field.select();
    return;
  }

  startMusic();
  showScene('party');
  makeFireworks();
});

document.getElementById('toFirstCandle').addEventListener('click', () => {
  showScene('candleScene');
});

document.getElementById('lightFirst').addEventListener('click', () => {
  const match = document.getElementById('lightFirst');
  const scene = document.getElementById('candleScene');

  if (scene.classList.contains('is-lit')) return;

  scene.classList.add('is-lit');
  document.getElementById('firstCandle').classList.add('is-lit');
  document.getElementById('matchHint').textContent = 'YEAH, LILINNYA NYALA!';

  window.setTimeout(() => {
    showScene('cakeScene');
  }, 1700);

  match.setAttribute('aria-label', 'Lilin sudah menyala');
});

document.getElementById('cutCake').addEventListener('click', () => {
  document.getElementById('birthdayCake').classList.add('is-cut');
  document.getElementById('cutCake').hidden = true;

  window.setTimeout(() => {
    document.getElementById('birthdayNote').hidden = false;
  }, 850);
});

document.getElementById('toLastCandle').addEventListener('click', () => {
  showScene('lastCandleScene');
});

let pointerStart = null;
let candleExtinguished = false;
const swipeCandle = document.getElementById('swipeCandle');

function extinguishCandle() {
  if (candleExtinguished) return;

  candleExtinguished = true;
  swipeCandle.classList.add('is-out');
  document.getElementById('swipeHint').textContent = 'Hore, apinya mati!';
  document.getElementById('tapToExtinguish').hidden = true;

  window.setTimeout(() => {
    showScene('memoriesScene');
    window.setTimeout(showEnding, 8000);
  }, 650);
}

swipeCandle.addEventListener('pointerdown', (event) => {
  pointerStart = { x: event.clientX, y: event.clientY };
  swipeCandle.setPointerCapture?.(event.pointerId);
});

swipeCandle.addEventListener('pointerup', (event) => {
  if (!pointerStart) return;

  const distance = Math.hypot(
    event.clientX - pointerStart.x,
    event.clientY - pointerStart.y
  );
  pointerStart = null;

  if (distance > 14) extinguishCandle();
});

swipeCandle.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    extinguishCandle();
  }
});

document.getElementById('tapToExtinguish').addEventListener('click', extinguishCandle);

function showEnding() {
  showScene('ending');
  window.clearInterval(fadeTimer);

  fadeTimer = window.setInterval(() => {
    audio.volume = Math.max(0, audio.volume - 0.08);

    if (audio.volume <= 0.01) {
      audio.pause();
      audio.currentTime = 0;
      window.clearInterval(fadeTimer);
    }
  }, 140);
}