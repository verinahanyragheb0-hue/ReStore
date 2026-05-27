document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const productData = {
        name: document.getElementById('p-name').value,
        price: document.getElementById('p-price').value,
        condition: document.getElementById('p-condition').value,
        description: document.getElementById('p-desc').value
    };
    // Mock API call using localStorage since there's no backend yet
    new Promise((resolve) => {
        setTimeout(() => {
            // Save to localStorage so it can be retrieved on market.html
            const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
            existingProducts.push(productData);
            localStorage.setItem('products', JSON.stringify(existingProducts));
            
            resolve({ success: true, message: "Product added successfully", product: productData });
        }, 500); // 500ms delay to simulate network request
    })
    .then(data => {
        console.log("Product added:", data);
        alert("The product has been successfully added.");
        window.location.href = 'market.html';
    })
    .catch(error => {
        console.error("Error adding product:", error);
        alert("An error occurred while adding the product.");
    });
});