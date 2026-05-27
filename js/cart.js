        function loadCartFromDB() {
            const listContainer = document.getElementById('cart-list');
            const totalSpan = document.getElementById('grand-total');
            const totalArea = document.getElementById('total-area');
            fetch('get-cart.php')
            .then(response => response.json())
            .then(cart => {
                if (!cart || cart.length === 0) {
                    listContainer.innerHTML = "<h3 style='text-align:center; margin-top:30px;'>Your cart is empty. Start shopping!</h3>";
                    totalArea.style.display = 'none';
                    return;
                }

                totalArea.style.display = 'block';
                let total = 0;
                
                listContainer.innerHTML = cart.map(item => {
                    const priceNum = parseFloat(item.price.toString().replace('$', '').replace(',', ''));
                    total += priceNum;
                    
                    return `
                        <div class="cart-item">
                            <img src="${item.img}" alt="${item.name}">
                            <div class="cart-info">
                                <h3>${item.name}</h3>
                                <p>Price: EGP ${priceNum.toFixed(2)}</p>
                            </div>
                            <div class="item-actions" style="display: flex; align-items: center; gap: 20px;">
                                <div class="item-subtotal">
                                    <strong>EGP ${priceNum.toFixed(2)}</strong>
                                </div>
                                <button class="delete-btn" onclick="deleteFromCartDB('${item.id}')">
                                    <i class="fa-solid fa-trash-can"></i> Delete
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
                totalSpan.innerText = `EGP ${total.toFixed(2)}`;
            })
            .catch(error => {
                console.error("Error loading cart:", error);
                listContainer.innerHTML = "<h3 style='text-align:center; color:red;'>Error loading your cart from server.</h3>";
            });
        }
        function deleteFromCartDB(productId) {
            fetch('delete-from-cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId: productId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadCartFromDB();
                } else {
                    alert(data.message || "Failed to delete product from database.");
                }
            })
            .catch(error => {
                console.error("Error deleting product:", error);
            });
        }
        document.addEventListener('DOMContentLoaded', loadCartFromDB);