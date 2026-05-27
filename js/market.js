let allProducts = [];

// Fetch products from database
function loadProducts() {
    fetch('get_products.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allProducts = data.products;
            displayProducts(allProducts);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Display products in the grid
function displayProducts(products) {
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const card = `
            <div class="product-card">
                <a href="product-details.html?id=${product.id}" class="product-link">
                    <div class="product-image">
                        <img src="${product.image_path ? product.image_path : 'imgs/hompage/repair.gif'}" alt="Product" />
                    </div>
                    <div class="product-info">
                        <span class="condition">${product.condition_type}</span>
                        <h3>${product.name}</h3>
                        <div class="price">EGP ${product.price}</div>
                    </div>
                </a>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Filter and sort products
function filterProducts() {
    const category  = document.getElementById('filter-category').value;
    const condition = document.getElementById('filter-condition').value;
    const sort      = document.getElementById('sort-price').value;

    let filtered = allProducts;

    // Filter by category
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Filter by condition
    if (condition !== 'all') {
        filtered = filtered.filter(p =>
            p.condition_type.toLowerCase().includes(condition.toLowerCase())
        );
    }

    // Sort by price
    if (sort === 'lowest') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'highest') {
        filtered.sort((a, b) => b.price - a.price);
    }

    displayProducts(filtered);
}

// Listen for filter changes
document.getElementById('filter-category').addEventListener('change', filterProducts);
document.getElementById('filter-condition').addEventListener('change', filterProducts);
document.getElementById('sort-price').addEventListener('change', filterProducts);

// Search
document.getElementById('searchProduct').addEventListener('input', function () {
    const search = this.value.toLowerCase();
    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(search)
    );
    displayProducts(filtered);
});

// Run when page loads
loadProducts();