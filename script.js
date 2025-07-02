document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("notification-toggle");

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
  });
});
