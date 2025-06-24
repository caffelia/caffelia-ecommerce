import axios from "axios";
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
console.log("Caffelia Shop Theme loaded successfully!");
document.addEventListener("DOMContentLoaded", function() {
  const footer = document.querySelector(".caffelia-footer");
  if (footer) {
    footer.classList.add("animate-fade-in");
  }
});
