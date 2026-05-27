// Product Ratings & Reviews System

class ProductRating {
  constructor() {
    this.ratingsKey = "product_ratings";
    this.ratings = this.loadRatings();
    this.init();
  }

  init() {
    this.addRatingDisplays();
  }

  addRatingDisplays() {
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
      if (!card.querySelector(".rating-display")) {
        const productId = card.getAttribute("data-id");
        const rating = this.getProductRating(productId);

        const ratingDisplay = document.createElement("div");
        ratingDisplay.className = "rating-display";
        ratingDisplay.style.cssText = `
          margin-top: 12px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
        `;

        ratingDisplay.innerHTML = `
          <div class="stars">
            ${this.renderStars(rating.average)}
          </div>
          <span style="color: #666;">${rating.average.toFixed(1)} (${rating.count} reviews)</span>
        `;

        const productInfo = card.querySelector(".product-info") || card;
        productInfo.appendChild(ratingDisplay);
      }
    });
  }

  renderStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars += '<i class="fa-solid fa-star" style="color: #f39c12;"></i>';
      } else if (i - 0.5 <= rating) {
        stars += '<i class="fa-solid fa-star-half-stroke" style="color: #f39c12;"></i>';
      } else {
        stars += '<i class="fa-regular fa-star" style="color: #ddd;"></i>';
      }
    }
    return stars;
  }

  getProductRating(productId) {
    const productRatings = this.ratings.filter(r => r.productId === productId);
    if (productRatings.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = productRatings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / productRatings.length;

    return {
      average: average,
      count: productRatings.length
    };
  }

  addRating(productId, rating, review = "") {
    if (rating < 1 || rating > 5) return;

    this.ratings.push({
      productId: productId,
      rating: rating,
      review: review,
      date: new Date().toISOString()
    });

    this.saveRatings();
    showToast("Rating submitted successfully!", "success");
  }

  loadRatings() {
    try {
      const stored = localStorage.getItem(this.ratingsKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveRatings() {
    try {
      localStorage.setItem(this.ratingsKey, JSON.stringify(this.ratings));
    } catch {
      console.error("Failed to save ratings");
    }
  }

  // Create rating modal
  createRatingModal(productId, productName) {
    const modal = document.createElement("div");
    modal.className = "rating-modal";
    modal.style.cssText = `
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #333;">Rate "${productName}"</h2>
          <button class="close-modal-btn" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          ">&times;</button>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; color: #333; font-weight: 500;">Rating</label>
          <div class="star-rating" style="font-size: 32px; letter-spacing: 10px; cursor: pointer;">
            <i class="fa-regular fa-star" data-rating="1"></i>
            <i class="fa-regular fa-star" data-rating="2"></i>
            <i class="fa-regular fa-star" data-rating="3"></i>
            <i class="fa-regular fa-star" data-rating="4"></i>
            <i class="fa-regular fa-star" data-rating="5"></i>
          </div>
          <p class="rating-text" style="margin-top: 10px; color: #666; font-size: 14px;">Select a rating</p>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; color: #333; font-weight: 500;">Review (Optional)</label>
          <textarea class="review-text" style="
            width: 100%;
            padding: 12px;
            border: 1.5px solid #e0e0e0;
            border-radius: 8px;
            font-family: inherit;
            resize: vertical;
            min-height: 100px;
            box-sizing: border-box;
          " placeholder="Share your experience..."></textarea>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="submit-rating-btn" style="
            flex: 1;
            padding: 12px;
            background: linear-gradient(135deg, #2C9664, #247654);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          ">Submit Rating</button>
          <button class="cancel-rating-btn" style="
            flex: 1;
            padding: 12px;
            background: #f0f0f0;
            color: #333;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          ">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    let selectedRating = 0;

    // Star rating interaction
    const stars = modal.querySelectorAll(".star-rating i");
    stars.forEach(star => {
      star.addEventListener("click", function() {
        selectedRating = parseInt(this.getAttribute("data-rating"));
        stars.forEach((s, index) => {
          if (index < selectedRating) {
            s.className = "fa-solid fa-star";
            s.style.color = "#f39c12";
          } else {
            s.className = "fa-regular fa-star";
            s.style.color = "#ddd";
          }
        });

        const text = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
        modal.querySelector(".rating-text").textContent = text[selectedRating];
      });

      star.addEventListener("mouseenter", function() {
        const rating = parseInt(this.getAttribute("data-rating"));
        stars.forEach((s, index) => {
          if (index < rating) {
            s.style.color = "#f39c12";
          } else {
            s.style.color = "#ddd";
          }
        });
      });

      star.addEventListener("mouseleave", function() {
        stars.forEach((s, index) => {
          if (index < selectedRating) {
            s.style.color = "#f39c12";
          } else {
            s.style.color = "#ddd";
          }
        });
      });
    });

    // Submit button
    modal.querySelector(".submit-rating-btn").addEventListener("click", () => {
      if (selectedRating === 0) {
        showToast("Please select a rating", "warning");
        return;
      }

      const review = modal.querySelector(".review-text").value;
      this.addRating(productId, selectedRating, review);
      modal.remove();
    });

    // Cancel button
    modal.querySelector(".cancel-rating-btn").addEventListener("click", () => {
      modal.remove();
    });

    // Close button
    modal.querySelector(".close-modal-btn").addEventListener("click", () => {
      modal.remove();
    });

    // Close on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
}

// Initialize on DOM ready
let productRating;
document.addEventListener("DOMContentLoaded", () => {
  productRating = new ProductRating();
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

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ProductRating };
}
