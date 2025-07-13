function updateWorldClock() {
  const ukTime = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const ausTime = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  document.getElementById("uk-time").textContent = ukTime;
  document.getElementById("aus-time").textContent = ausTime;
}

// Update every second
setInterval(updateWorldClock, 1000);
updateWorldClock(); // Run once immediately
