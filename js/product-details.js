document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    // Mock API call
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => String(p.id) === String(productId));
        if (product) {
           // Provide a default image if none exists
           product.image_url = product.img || "imgs/marketplace/marketplace.gif";
           resolve(product);
        } else {
           reject(new Error("Product not found"));
        }
      }, 100);
    })
      .then(product => {
        document.getElementById("product-name").innerText = product.name;
        document.getElementById("product-price").innerText = `$${product.price}`;
        document.querySelector(".condition-tag").innerText = product.condition;
        document.querySelector(".description").innerText = product.description;
        document.getElementById("main-product-img").src = product.image_url;
        document.title = `${product.name} - ReStore`;
      })
      .catch(error => {
        console.error("Error fetching product details:", error);
        showNotFoundError();
      });
  } else {
    showNotFoundError();
  }
  function showNotFoundError() {
    const mainContent = document.querySelector(".product-details-container");
    if (mainContent) {
      mainContent.innerHTML = "<div class='container' style='text-align:center; padding:50px;'><h1>Product Not Found</h1><p>The requested device could not be loaded from the database.</p></div>";
    }
  }
});