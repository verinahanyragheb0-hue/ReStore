// Wishlist/Favorites Management

class WishlistManager {
  constructor() {
    this.wishlistKey = "restore_wishlist";
    this.wishlist = this.loadWishlist();
    this.init();
  }

  init() {
    this.addWishlistButtons();
    this.updateWishlistButtons();
    document.addEventListener("click", (e) => this.handleWishlistClick(e));
  }

  addWishlistButtons() {
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
      if (!card.querySelector(".wishlist-btn")) {
        const button = document.createElement("button");
        button.className = "wishlist-btn";
        button.innerHTML = '<i class="fa-regular fa-heart"></i>';
        button.style.cssText = `
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #e74c3c;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `;

        button.addEventListener("mouseenter", function() {
          this.style.transform = "scale(1.1)";
          this.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        });

        button.addEventListener("mouseleave", function() {
          this.style.transform = "scale(1)";
          this.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        });

        card.style.position = "relative";
        card.appendChild(button);
      }
    });
  }

  handleWishlistClick(e) {
    if (e.target.closest(".wishlist-btn")) {
      e.preventDefault();
      const button = e.target.closest(".wishlist-btn");
      const card = button.closest(".product-card");
      const productId = card.getAttribute("data-id");
      const productName = card.querySelector("h3")?.textContent || "Product";

      if (this.isInWishlist(productId)) {
        this.wishlist = this.wishlist.filter(item => item.id !== String(productId));
        this.updateWishlistButtons();
        showToast(`Removed "${productName}" from wishlist`, "info");
        this.removeFromWishlist(productId);
      } else {
        this.wishlist.push({ id: String(productId), name: productName });
        this.updateWishlistButtons();
        showToast(`Added "${productName}" to wishlist ❤️`, "success");
        this.addToWishlist(productId, productName);
      }
    }
  }

  addToWishlist(productId, productName) {
    fetch('add-to-wishlist.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `product_id=${productId}`
    })
    .then(res => res.json())
    .then(data => {
      if (data.error === 'not_logged_in') {
        this.wishlist = this.wishlist.filter(item => item.id !== String(productId));
        this.updateWishlistButtons();
        showToast("Please login to save to wishlist", "warning");
        setTimeout(() => window.location.href = 'log.html', 1500);
      } else if (!data.success) {
        this.wishlist = this.wishlist.filter(item => item.id !== String(productId));
        this.updateWishlistButtons();
        showToast("Failed to add to wishlist", "error");
      }
    })
    .catch(() => {
      this.wishlist = this.wishlist.filter(item => item.id !== String(productId));
      this.updateWishlistButtons();
      showToast("Connection error", "error");
    });
  }

  removeFromWishlist(productId) {
    fetch('delete-from-wishlist.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `product_id=${productId}`
    })
    .then(res => res.json())
    .then(data => {
      if (data.error === 'not_logged_in') {
        showToast("Please login first", "warning");
        setTimeout(() => window.location.href = 'log.html', 1500);
      } else if (!data.success) {
        showToast("Failed to remove from wishlist", "error");
      }
    })
    .catch(() => {
      showToast("Connection error", "error");
    });
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === String(productId));
  }

  getWishlist() {
    return this.wishlist;
  }

  clearWishlist() {
    const ids = this.wishlist.map(item => item.id);
    Promise.all(ids.map(id =>
      fetch('delete-from-wishlist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `product_id=${id}`
      })
    )).then(() => {
      this.wishlist = [];
      this.updateWishlistButtons();
      showToast("Wishlist cleared", "info");
    });
  }

  loadWishlist() {
    fetch('get-wishlist.php')
      .then(res => res.json())
      .then(items => {
        this.wishlist = items.map(item => ({
          id: String(item.id),
          name: item.name,
          price: item.price,
          image: item.image
        }));
        this.updateWishlistButtons();
      })
      .catch(() => {
        this.wishlist = [];
      });
    return [];
  }

  saveWishlist() {
    // handled by PHP
  }

  updateWishlistButtons() {
    const buttons = document.querySelectorAll(".wishlist-btn");
    buttons.forEach(button => {
      const card = button.closest(".product-card");
      const productId = card?.getAttribute("data-id");

      if (productId && this.isInWishlist(productId)) {
        button.innerHTML = '<i class="fa-solid fa-heart"></i>';
        button.style.color = "#e74c3c";
      } else {
        button.innerHTML = '<i class="fa-regular fa-heart"></i>';
        button.style.color = "#e74c3c";
      }
    });
  }

  createWishlistPage() {
    const container = document.createElement("div");
    container.className = "wishlist-container";
    container.style.cssText = `
      max-width: 1200px;
      margin: 60px auto;
      padding: 0 20px;
    `;

    if (this.wishlist.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <i class="fa-regular fa-heart" style="font-size: 80px; color: #ddd; margin-bottom: 20px;"></i>
          <h2 style="color: #333; margin: 20px 0;">Your Wishlist is Empty</h2>
          <p style="color: #666; margin-bottom: 30px;">Add items to your wishlist by clicking the heart icon</p>
          <a href="market.html" style="
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #2C9664, #247654);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            Continue Shopping
          </a>
        </div>
      `;
    } else {
      const itemsHtml = this.wishlist.map((item, index) => `
        <div class="wishlist-item" style="
          background: white;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideIn 0.3s ease;
          animation-delay: ${index * 0.1}s;
        ">
          <div>
            <h3 style="margin: 0 0 8px; color: #333;">${item.name}</h3>
            <p style="margin: 0; color: #666; font-size: 13px;">EGP ${item.price ? Number(item.price).toFixed(2) : '—'}</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button onclick="window.wishlistManager.removeFromWishlist('${item.id}'); location.reload();" style="
              padding: 10px 16px;
              background: #e74c3c;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 13px;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
              Remove
            </button>
            <a href="product-details.html?id=${item.id}" style="
              padding: 10px 16px;
              background: #2C9664;
              color: white;
              border: none;
              border-radius: 6px;
              text-decoration: none;
              font-size: 13px;
              display: inline-block;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='#247654'" onmouseout="this.style.background='#2C9664'">
              View
            </a>
          </div>
        </div>
      `).join("");

      container.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h1 style="margin: 0; color: #333;">My Wishlist</h1>
            <button onclick="window.wishlistManager.clearWishlist(); location.reload();" style="
              padding: 10px 16px;
              background: #e74c3c;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            ">
              Clear All
            </button>
          </div>
          ${itemsHtml}
        </div>
      `;
    }

    return container;
  }
}

// Initialize on DOM ready
let wishlistManager;
document.addEventListener("DOMContentLoaded", () => {
  wishlistManager = new WishlistManager();
  window.wishlistManager = wishlistManager;
});

// Toast function (if not already defined)
if (typeof showToast === "undefined") {
  window.showToast = function(message, type = "info") {
    const toast = document.createElement("div");
    const colors = {
      success: "#27ae60",
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
      font-family: "Space Grotesk", sans-serif;
      font-size: 14px;
    `;

    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { WishlistManager };
}