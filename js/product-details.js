document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        fetch('get-product.php?id=' + productId)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const product = data.product;
                document.getElementById("product-name").innerText = product.name;
                document.querySelector(".price-tag").innerText = `EGP ${product.price}`;
                document.querySelector(".condition-tag").innerText = product.condition_type;
                document.querySelector(".description").innerText = product.description;
                document.querySelector(".breadcrumb").textContent =
                    `Marketplace / ${product.category} / ${product.name}`;
                const img = document.getElementById("main-product-img");
                if (img && product.image_path) {
                    img.src = product.image_path;
                    img.alt = product.name;
                }
                document.title = `${product.name} - ReStore`;
            } else {
                showNotFoundError();
            }
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