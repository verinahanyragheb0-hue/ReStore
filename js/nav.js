async function loadComponent(filePath, position) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    
    const data = await response.text();
    document.body.insertAdjacentHTML(position, data);
    if (filePath === 'nav.html') {
      setActiveLink();
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
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("nav.html", "afterbegin");
  loadComponent("footer.html", "beforeend");
});