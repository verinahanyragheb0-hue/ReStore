(function() {
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); 

    const user = document.getElementById("l-email").value;
    const pass = document.getElementById("l-pass").value;

    if (user && pass) {
      localStorage.setItem("isLoggedIn", "true");
      if (user.toLowerCase().includes("admin")) {
        localStorage.setItem("userRole", "admin");
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        localStorage.setItem("userRole", "user");
        alert("Login successful!");
        window.location.href = "profile.html";
      }
    } else {
      alert("Please enter both email and password.");
    }
  });
}
})();
