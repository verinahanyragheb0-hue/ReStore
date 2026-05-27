document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const card = e.target.closest(".product-card");
      if (!card) return;
      const productId = card.getAttribute("data-id");

      // Mock API call using localStorage
      new Promise((resolve) => {
        setTimeout(() => {
          let cart = JSON.parse(localStorage.getItem('cart') || '[]');
          
          // Extract product details from the card in the DOM
          const name = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Product';
          const priceText = card.querySelector('.price') ? card.querySelector('.price').textContent : '$0';
          const imgSrc = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : '';
          
          // Check if already in cart
          if (cart.find(item => String(item.id) === String(productId))) {
             resolve({ success: false, message: "This product is already in your cart!" });
          } else {
             cart.push({ id: productId, name, price: priceText, img: imgSrc });
             localStorage.setItem('cart', JSON.stringify(cart));
             resolve({ success: true, message: "Product added to cart successfully!" });
          }
        }, 100);
      })
        .then((data) => {
          if (data.success) {
            showToast(
              data.message || "Product added to cart successfully!",
              "success",
            );
          } else {
            showToast(
              data.message || "This product is already in your cart!",
              "warning",
            );
          }
        })
        .catch((error) => {
          console.error("Error connecting to server:", error);
          showToast("An error occurred while adding the product.", "error");
        });
    }
  });
  const searchInput = document.getElementById("searchProduct");
  const filterCondition = document.getElementById("filter-condition");
  const filterCategory = document.getElementById("filter-category");
  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");
  const sortPrice = document.getElementById("sort-price");
  const btnApply = document.getElementById("btn-apply-filters");
  const btnReset = document.getElementById("btn-reset-filters");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(() => {
        applyFiltersAndSearch();
      }, 300),
    );
  }

  if (filterCondition)
    filterCondition.addEventListener("change", applyFiltersAndSearch);
  if (filterCategory)
    filterCategory.addEventListener("change", applyFiltersAndSearch);
  if (sortPrice) sortPrice.addEventListener("change", applyFiltersAndSearch);
  if (priceMin) priceMin.addEventListener("input", applyFiltersAndSearch);
  if (priceMax) priceMax.addEventListener("input", applyFiltersAndSearch);

  if (btnApply) btnApply.addEventListener("click", applyFiltersAndSearch);
  if (btnReset) btnReset.addEventListener("click", resetFilters);
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function applyFiltersAndSearch() {
  const searchTerm =
    document.getElementById("searchProduct")?.value.toLowerCase() || "";
  const condition = document.getElementById("filter-condition")?.value || "all";
  const category = document.getElementById("filter-category")?.value || "all";
  const minPrice = parseFloat(document.getElementById("price-min")?.value) || 0;
  const maxPrice =
    parseFloat(document.getElementById("price-max")?.value) || Infinity;
  const sortBy = document.getElementById("sort-price")?.value || "newest";

  const products = document.querySelectorAll(".product-card");
  let visibleCount = 0;

  products.forEach((product) => {
    const title = product.querySelector("h3")?.textContent.toLowerCase() || "";
    const conditionText =
      product.querySelector(".condition")?.textContent.toLowerCase() || "";
    const priceText = product.querySelector(".price")?.textContent || "$0";
    const price = parseFloat(priceText.replace("$", "").replace(",", ""));
    const productCategory =
      product.getAttribute("data-category")?.toLowerCase() || "";

    const matchesSearch = title.includes(searchTerm);
    const matchesCondition =
      condition === "all" || conditionText.includes(condition);
    const matchesCategory = category === "all" || productCategory === category;
    const matchesPrice = price >= minPrice && price <= maxPrice;

    if (matchesSearch && matchesCondition && matchesCategory && matchesPrice) {
      product.classList.remove("hide-card");
      visibleCount++;
    } else {
      product.classList.add("hide-card");
    }
  });

  sortProducts(sortBy);

  if (visibleCount === 0) {
    showNoResults();
  } else {
    removeNoResults();
  }
}

function sortProducts(sortBy) {
  const container = document.querySelector(".products-grid");
  if (!container) return;

  let products = Array.from(document.querySelectorAll(".product-card"));

  products.sort((a, b) => {
    const priceA = parseFloat(
      a.querySelector(".price")?.textContent.replace("$", "") || 0,
    );
    const priceB = parseFloat(
      b.querySelector(".price")?.textContent.replace("$", "") || 0,
    );

    if (sortBy === "lowest") {
      return priceA - priceB;
    } else if (sortBy === "highest") {
      return priceB - priceA;
    } else {
      const idA = parseInt(a.getAttribute("data-id") || 0);
      const idB = parseInt(b.getAttribute("data-id") || 0);
      return idB - idA;
    }
  });

  products.forEach((product) => container.appendChild(product));
}
function resetFilters() {
  if (document.getElementById("searchProduct"))
    document.getElementById("searchProduct").value = "";
  if (document.getElementById("filter-condition"))
    document.getElementById("filter-condition").value = "all";
  if (document.getElementById("filter-category"))
    document.getElementById("filter-category").value = "all";
  if (document.getElementById("price-min"))
    document.getElementById("price-min").value = "";
  if (document.getElementById("price-max"))
    document.getElementById("price-max").value = "";
  if (document.getElementById("sort-price"))
    document.getElementById("sort-price").value = "newest";

  document.querySelectorAll(".product-card").forEach((product) => {
    product.classList.remove("hide-card");
  });

  removeNoResults();
  showToast("Filters reset successfully", "info");
}

function showNoResults() {
  if (document.getElementById("noResults")) return;
  const message = document.createElement("div");
  message.id = "noResults";
  message.innerHTML = `
    <i class="fa-solid fa-box-open" style="font-size: 40px; color: #ccc; margin-bottom: 10px; display: block;"></i>
    <h3>No Products Found</h3>
    <p>Try adjusting your search or filters</p>
  `;
  const grid = document.querySelector(".products-grid");
  if (grid) grid.appendChild(message);
}

function removeNoResults() {
  const noResults = document.getElementById("noResults");
  if (noResults) noResults.remove();
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  const colors = {
    success: "#2c9664",
    error: "#e53e3e",
    warning: "#dd6b20",
    info: "#3182ce",
  };
  toast.className = "toast-notification";
  toast.style.backgroundColor = colors[type];
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
