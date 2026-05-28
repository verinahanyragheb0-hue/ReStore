
document.addEventListener('DOMContentLoaded', () => {
    // ── Handle Auction Win Claim ──────────────────────────────────────────────
    const claim = JSON.parse(localStorage.getItem('pending_claim') || 'null');
    if (claim && claim.type === 'auction_win') {
        const itemsList = document.getElementById('payment-items-list');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('final-total');

        if (itemsList) {
            itemsList.innerHTML = `
              <div style="display:flex; justify-content:space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <div>
                  <div style="font-weight:700; color:#1e293b;">🏆 ${claim.itemName}</div>
                  <div style="font-size:0.85rem; color:#64748b;">Auction Win — Spare Part</div>
                </div>
                <strong style="color:#4f46e5;">$${parseFloat(claim.amount).toFixed(2)}</strong>
              </div>`;
        }
        const amount = `$${parseFloat(claim.amount).toFixed(2)}`;
        if (subtotalEl) subtotalEl.textContent = amount;
        if (totalEl) totalEl.textContent = amount;

        // Update page title
        const title = document.querySelector('.page-title');
        if (title) title.textContent = '🏆 Claim Your Auction Prize';

        // Clear claim after reading so it doesn't persist
        const btn = document.querySelector('.place-order-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                localStorage.removeItem('pending_claim');
            });
        }
    } else {
        // ── Normal Cart Checkout ──────────────────────────────────────────────
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemsList = document.getElementById('payment-items-list');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('final-total');

        if (itemsList && cartItems.length > 0) {
            let total = 0;
            itemsList.innerHTML = cartItems.map(item => {
                const price = parseFloat(item.price) || 0;
                total += price;
                return `
                  <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">
                    <span style="font-weight:600;">${item.name}</span>
                    <strong>$${price.toFixed(2)}</strong>
                  </div>`;
            }).join('');
            if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        }
    }

    // ── Payment Method Toggle ─────────────────────────────────────────────────
    const paymentValidator = new FormValidator('payment-form');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardDetails = document.getElementById('card-details');

    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });

    const form = document.getElementById('payment-form');
    const submitBtn = form.querySelector('.place-order-btn');

    form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (paymentValidator.validate()) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
        submitBtn.style.cursor = "not-allowed";
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

        const totalAmount = document.getElementById('final-total')?.textContent?.replace('$', '') || 0;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'card';

        const data = {
            fullName:      form.querySelector('[name="full-name"]').value,
            email:         form.querySelector('[name="email"]').value,
            address:       form.querySelector('[name="address"]').value,
            city:          form.querySelector('[name="city"]').value,
            phone:         form.querySelector('[name="phone"]').value,
            paymentMethod: paymentMethod,
            totalAmount:   parseFloat(totalAmount) || 0
        };

        fetch('submit-order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                localStorage.removeItem('pending_claim');
                showToast("Order placed successfully! Redirecting...", "success");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            } else {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
                submitBtn.innerHTML = 'Complete Purchase';
                showToast(result.message || "Something went wrong.", "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast("Could not connect to server.", "error");
        });

    } else {
        showToast("Please check the highlighted errors", "error");
    }
});
});
