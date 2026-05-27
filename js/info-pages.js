// Info Pages Interactivity (Help, Shipping, Returns, Warranty)

document.addEventListener("DOMContentLoaded", () => {
  // FAQ Expand/Collapse Functionality
  const faqItems = document.querySelectorAll(".faq-item");
  
  faqItems.forEach(item => {
    const question = item.querySelector("h3");
    const answer = item.querySelector("p");
    
    if (!question || !answer) return;
    
    // Make question clickable
    question.style.cursor = "pointer";
    question.style.userSelect = "none";
    
    // Add expand icon
    question.innerHTML = question.innerHTML + ' <span class="faq-icon">+</span>';
    
    // Initially hide answers
    answer.style.maxHeight = answer.scrollHeight + "px";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height 0.3s ease";
    
    // Click handler
    question.addEventListener("click", function(e) {
      const icon = this.querySelector(".faq-icon");
      const isOpen = this.classList.contains("open");
      
      if (isOpen) {
        // Close
        this.classList.remove("open");
        answer.style.maxHeight = "0px";
        icon.textContent = "+";
      } else {
        // Open
        this.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.textContent = "−";
      }
    });
  });
  
  // Search FAQs
  const pageSubtitle = document.querySelector(".page-subtitle");
  if (pageSubtitle && pageSubtitle.textContent.includes("frequently asked")) {
    // Add search input after subtitle
    const searchContainer = document.createElement("div");
    searchContainer.style.cssText = `
      margin: 0 auto 40px;
      max-width: 500px;
    `;
    
    searchContainer.innerHTML = `
      <input 
        type="text" 
        id="faqSearch" 
        placeholder="Search FAQs..." 
        style="
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          font-family: var(--mainFont);
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        "
      />
    `;
    
    pageSubtitle.parentNode.insertBefore(searchContainer, pageSubtitle.nextSibling);
    
    // Search functionality
    const searchInput = document.getElementById("faqSearch");
    const faqSection = document.querySelector(".faq-section");
    
    if (searchInput && faqSection) {
      searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        faqItems.forEach(item => {
          const question = item.querySelector("h3");
          const answer = item.querySelector("p");
          
          if (!question || !answer) return;
          
          const questionText = question.textContent.toLowerCase();
          const answerText = answer.textContent.toLowerCase();
          
          if (questionText.includes(searchTerm) || answerText.includes(searchTerm) || searchTerm === "") {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    }
  }
  
  // Copy to Clipboard for Table Cells
  const tableRows = document.querySelectorAll(".shipping-table tbody tr");
  tableRows.forEach(row => {
    row.style.cursor = "pointer";
    row.addEventListener("click", function(e) {
      if (e.target.tagName === "TD") {
        const text = e.target.textContent;
        navigator.clipboard.writeText(text).then(() => {
          // Show toast
          showToast("Copied: " + text, "success");
        });
      }
    });
  });
  
  // Print Page Functionality
  const printButton = document.createElement("button");
  const infoContainer = document.querySelector(".info-container");
  
  if (infoContainer) {
    printButton.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2C9664, #247654);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(44, 150, 100, 0.3);
      transition: all 0.3s ease;
      z-index: 100;
    `;
    
    printButton.innerHTML = '<i class="fa-solid fa-print"></i>';
    printButton.title = "Print Page";
    
    printButton.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.1)";
      this.style.boxShadow = "0 6px 16px rgba(44, 150, 100, 0.4)";
    });
    
    printButton.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
      this.style.boxShadow = "0 4px 12px rgba(44, 150, 100, 0.3)";
    });
    
    printButton.addEventListener("click", function() {
      window.print();
    });
    
    document.body.appendChild(printButton);
    
    // Hide on mobile
    if (window.innerWidth < 576) {
      printButton.style.display = "none";
    }
    
    window.addEventListener("resize", function() {
      if (window.innerWidth < 576) {
        printButton.style.display = "none";
      } else {
        printButton.style.display = "flex";
      }
    });
  }
});

// Toast Notification System
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  const colors = {
    success: "#2C9664",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db"
  };
  
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    font-family: var(--mainFont);
    font-size: 14px;
  `;
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add animations to document
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .faq-icon {
    float: right;
    font-weight: bold;
    color: #2C9664;
    transition: all 0.3s ease;
  }
  
  .faq-item h3.open .faq-icon {
    color: #247654;
  }
`;
document.head.appendChild(style);
