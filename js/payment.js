
document.addEventListener('DOMContentLoaded', () => {
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
            setTimeout(() => {
                showToast("Order placed successfully! Redirecting...", "success");
                setTimeout(() => {
                    window.location.href = "cart.html";
                }, 2000);
            }, 1500);

        } else {
            showToast("Please check the highlighted errors", "error");
        }
    });
});