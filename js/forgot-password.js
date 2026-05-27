document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            alert('A password reset link has been successfully sent to your email! 📧');
            document.getElementById('email').value = '';
        } else {
            const errorData = await response.json();
            alert('عذراً: ' + (errorData.message || 'This account does not exist.'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while connecting to the server. Please try again.');
    } finally {
        submitBtn.innerText = "Sent reset instructions";
        submitBtn.disabled = false;
    }
});