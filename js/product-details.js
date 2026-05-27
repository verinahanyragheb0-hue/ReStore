document.addEventListener("DOMContentLoaded", function () {

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    // Fetch product from database
    if (productId) {
        fetch("get-product.php?id=" + productId)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProduct(data.product);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Fill the page with product data
    function displayProduct(product) {
        document.getElementById("product-name").textContent = product.name;
        document.querySelector(".condition-tag").textContent = product.condition_type;
        document.querySelector(".price-tag").textContent = "EGP" + product.price;
        document.querySelector(".description").textContent = product.description;
        document.querySelector(".breadcrumb").textContent =
            "Marketplace / " + product.category + " / " + product.name;

        const img = document.getElementById("main-product-img");
        if (img && product.image_path) {
            img.src = product.image_path;
            img.alt = product.name;
        }
    }
    // Add product to cart
function addToCart() {
    fetch('add-to-cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Added to cart!');
        } else {
            alert(data.message || 'Could not add to cart.');
        }
    })
    .catch(error => console.error('Error:', error));
}

});