// Initialize Lucide icons
lucide.createIcons();

/* 1. Floating Romantic Heart Background Generator */
function initFloatingHearts() {
  const container = document.getElementById("particles-container");
  const emojis = ["💖", "🌸", "✨", "💕", "🌷", "🎂", "💌"];
  const count = 22;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "heart-particle select-none";
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random horizontal position, scale, and animation timing
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${8 + Math.random() * 10}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.fontSize = `${14 + Math.random() * 20}px`;

    container.appendChild(particle);
  }
}
initFloatingHearts();

/* 2. Web Audio API - Romantic Synthesizer Melody & Chimes */
let audioCtx = null;
let isPlayingMusic = false;
let melodyTimer = null;
const bgMusic = new Audio("./รักให้เธอได้รู้-PUN.mp3");
// ตั้งค่าให้เล่นวนซ้ำ และตั้งระดับเสียง (0.0 ถึง 1.0)
bgMusic.loop = true;
bgMusic.volume = 0.3;

function playSong() {
  bgMusic.play().catch((error) => {
    console.log(
      "ติดสิทธิ์ Autoplay ของเบราว์เซอร์ ต้องรอการคลิกจากผู้ใช้ก่อน:",
      error,
    );
  });
}

function pauseSong() {
  bgMusic.pause();
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play a single soft music note
function playTone(freq, duration, type = "sine", gainVal = 0.08) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn("Audio playback not supported or user gesture needed", err);
  }
}

// Happy birthday celebration chime sound
function playCelebrationFanfare() {
  const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 392.0, 523.25];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 0.45, "triangle", 0.12);
    }, idx * 160);
  });
}

// Music toggle button
const musicBtn = document.getElementById("musicToggleBtn");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");

musicBtn.addEventListener("click", () => {
  getAudioContext();
  isPlayingMusic = !isPlayingMusic;

  if (isPlayingMusic) {
    musicText.textContent = "กำลังเล่นเพลง 🎶";
    musicIcon.setAttribute("data-lucide", "volume-2");
    musicBtn.classList.add(
      "bg-rose-50",
      "text-rose-600",
      "ring-2",
      "ring-rose-300",
    );

    /*Play Music*/
    playSong();
    showToast("เปิดเสียงดนตรีเรียบร้อย 🎵💖");
  } else {
    musicText.textContent = "เปิดเพลง 🎵";
    musicIcon.setAttribute("data-lucide", "volume-x");
    musicBtn.classList.remove(
      "bg-rose-50",
      "text-rose-600",
      "ring-2",
      "ring-rose-300",
    );
    if (melodyTimer) clearInterval(melodyTimer);

    /*Stop Music*/
    pauseSong();
    showToast("ปิดเสียงดนตรีเรียบร้อย 💔");
  }
  lucide.createIcons();
});

/* 3. Blow Candle & Wish Feature */
let candlesBlown = false;
const blowBtn = document.getElementById("blowCandleBtn");
const cakeFlames = document.getElementById("cakeFlames");
const smokeContainer = document.getElementById("smokeContainer");
const wishStatusText = document.getElementById("wishStatusText");

blowBtn.addEventListener("click", () => {
  getAudioContext();
  if (!candlesBlown) {
    // Extinguish candles
    candlesBlown = true;
    cakeFlames.classList.remove("flame-on");
    cakeFlames.classList.add("flame-extinguished");
    smokeContainer.classList.remove("hidden");

    // Play celebration fanfare chime
    playCelebrationFanfare();

    // Canvas Confetti Celebration
    triggerConfettiCelebration();

    // Update button and status
    blowBtn.innerHTML = `<i data-lucide="sparkles" class="w-5 h-5"></i><span>จุดเทียนใหม่ 🕯️</span>`;
    blowBtn.classList.replace("bg-rose-500", "bg-amber-500");
    blowBtn.classList.replace("hover:bg-rose-600", "hover:bg-amber-600");
    wishStatusText.textContent =
      "ขอให้คำอธิษฐานของเธอเป็นจริงในทุกๆ เรื่องนะ! 💖🎉";

    showToast("เป่าเทียนสำเร็จแล้ว! พรทุกประการจงเป็นจริงนะคนดี ✨");
  } else {
    // Relight candles
    candlesBlown = false;
    cakeFlames.classList.add("flame-on");
    cakeFlames.classList.remove("flame-extinguished");
    smokeContainer.classList.add("hidden");

    blowBtn.innerHTML = `<i data-lucide="wind" class="w-5 h-5"></i><span>เป่าเทียนเลย 🎂💨</span>`;
    blowBtn.classList.replace("bg-amber-500", "bg-rose-500");
    blowBtn.classList.replace("hover:bg-amber-600", "hover:bg-rose-600");
    wishStatusText.textContent = "จุดเทียนพร้อมแล้ว อธิษฐานอีกรอบได้เลยนะ ✨";
  }
  lucide.createIcons();
});

function triggerConfettiCelebration() {
  if (typeof confetti === "function") {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        }),
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ["#ff4d6d", "#ff758f", "#ffb3c1"],
    });
    fire(0.2, { spread: 60, colors: ["#ffd166", "#06d6a0", "#118ab2"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ["#f43f5e", "#fbbf24"],
    });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }
}

/* 4. Envelope Opening / Toggle Animation */
const envelopeTrigger = document.getElementById("envelopeTrigger");
let envelopeOpened = false;

envelopeTrigger.addEventListener("click", () => {
  getAudioContext();
  envelopeOpened = !envelopeOpened;
  if (envelopeOpened) {
    envelopeTrigger.classList.add("envelope-open");
    playTone(587.33, 0.3, "sine", 0.08); // pleasant chime
    setTimeout(() => playTone(880, 0.4, "sine", 0.08), 100);
  } else {
    envelopeTrigger.classList.remove("envelope-open");
  }
});

/* 5. Photo Modal Details */
function openPhotoModal(title, desc, imgUrl) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = desc;
  document.getElementById("modalImg").src = imgUrl;
  const modal = document.getElementById("photoModal");
  modal.classList.remove("hidden");
}

function closePhotoModal() {
  document.getElementById("photoModal").classList.add("hidden");
}

// Close modal on click outside
document.getElementById("photoModal").addEventListener("click", (e) => {
  if (e.target.id === "photoModal") closePhotoModal();
});

/* 6. Love Coupon Redemption Feature */
function redeemCoupon(btnElement, couponName) {
  getAudioContext();
  playTone(523.25, 0.25, "triangle", 0.1);
  setTimeout(() => playTone(659.25, 0.35, "triangle", 0.1), 120);

  btnElement.disabled = true;
  btnElement.textContent = "ใช้สิทธิ์แล้ว ❤️";
  btnElement.classList.remove("bg-rose-500", "hover:bg-rose-600");
  btnElement.classList.add("bg-emerald-500", "cursor-default");

  showToast(`กดใช้ "${couponName}" สำเร็จ! ยินดีให้บริการด้วยความรัก 💖`);
}

/* 7. Custom Toast Box Function (No alert) */
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById("toastBox");
  const text = document.getElementById("toastMessage");
  text.textContent = msg;

  toast.classList.remove("translate-y-20", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-20", "opacity-0");
  }, 3500);
}
