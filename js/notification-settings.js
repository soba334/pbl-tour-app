// js/notification-settings.js
document.addEventListener("DOMContentLoaded", () => {
  const notifyEvent = document.getElementById("notifyEvent");

  const seasonalToggles = [
    document.getElementById("springEvent"),
    document.getElementById("summerEvent"),
    document.getElementById("autumnEvent"),
    document.getElementById("winterEvent")
  ];

  notifyEvent.addEventListener("change", () => {
    if (!notifyEvent.checked) {
      seasonalToggles.forEach(toggle => toggle.checked = false);
    }
  });
});
