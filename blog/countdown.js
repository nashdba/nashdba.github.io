function updateCountdown() {
  const targetDate = new Date("2025-08-24T00:00:00");
  const now = new Date();
  const diff = targetDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const countdownEl = document.getElementById("countdown");

  if (diff > 0) {
    countdownEl.innerHTML = `
      <span>${days} Days</span>
      <span>${hours} Hours</span>
      <span>${minutes} Minutes</span>
      <span>${seconds} Seconds</span>
    `;
  } else {
    countdownEl.innerHTML = `<span>🎉 They're back! Welcome home! 🎉</span>`;
  }
}

setInterval(updateCountdown, 1000);
updateCountdown(); // initial call

