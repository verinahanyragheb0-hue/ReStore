(function() {
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password") ? document.getElementById("password").value : document.getElementById("l-pass").value;

    if (user && pass) {
      localStorage.setItem("isLoggedIn", "true");
      if (user.toLowerCase().includes("admin")) {
        localStorage.setItem("userRole", "admin");
        alert("Registration successful! You are now logged in.");
        window.location.href = "dashboard.html";
      } else {
        localStorage.setItem("userRole", "user");
        alert("Registration successful! You are now logged in.");
        window.location.href = "profile.html";
      }
    } else {
      alert("Please fill in all required fields.");
    }
  });
}
})();
