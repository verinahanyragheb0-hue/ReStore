const step1Card = document.getElementById('step1Card');
const step2Card = document.getElementById('step2Card');
const pageTitle = document.getElementById('pageTitle');
const forgotForm = document.getElementById('forgotPasswordForm');
const resetForm = document.getElementById('resetPasswordForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
forgotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;
    setTimeout(() => {
        step1Card.classList.add('hide');
        step2Card.classList.remove('hide');
        pageTitle.innerText = "Reset Your Password";
        submitBtn.innerText = "Send reset instructions";
        submitBtn.disabled = false;
    }, 1000); 
});
resetForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match! Please try again.");
        return;
    }
    resetBtn.innerText = "Resetting Password...";
    resetBtn.disabled = true;
    setTimeout(() => {
        alert('Your password has been successfully reset! 🎉');
        window.location.href = 'login.html'; 
    }, 1000);
});