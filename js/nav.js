async function loadComponent(filePath, position) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    
    const data = await response.text();
    document.body.insertAdjacentHTML(position, data);
    if (filePath === 'nav.html') {
      setActiveLink();
      updateNavForAuth();
    }
  } catch (error) {
    console.error(`Error loading component:`, error);
  }
}

function setActiveLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav ul li a");
  
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
    
    link.addEventListener("click", function () {
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
}
function updateNavForAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  const loginLink = document.querySelector(".loginlink");
  const dashboardLink = document.querySelector(".dashboardlink");

  if (isLoggedIn) {
    if (loginLink) loginLink.style.display = "none";
    if (dashboardLink) {
      dashboardLink.style.display = "inline";
      if (userRole === "admin") {
        dashboardLink.href = "dashboard.html";
        dashboardLink.innerHTML = "Dashboard";
      } else {
        dashboardLink.href = "profile.html";
        dashboardLink.innerHTML = "Profile";
      }
      
      // Add Logout button if it doesn't exist yet
      if (!document.querySelector(".logoutlink")) {
        const logoutBtn = document.createElement("a");
        logoutBtn.href = "#";
        logoutBtn.className = "logoutlink";
        logoutBtn.style = "margin-right: 15px; font-weight: bold; color: inherit; text-decoration: none; cursor: pointer;";
        logoutBtn.innerHTML = "Logout";
        logoutBtn.onclick = function(e) {
          e.preventDefault();
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userRole");
          window.location.href = "index.html";
        };
        dashboardLink.after(logoutBtn);
      }
    }
  } else {
    if (loginLink) loginLink.style.display = "inline";
    if (dashboardLink) dashboardLink.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("nav.html", "afterbegin");
  loadComponent("footer.html", "beforeend");
});