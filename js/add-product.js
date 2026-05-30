document.addEventListener('DOMContentLoaded', function () {
 
  // Show selected file name in the upload box
  const fileInput = document.getElementById('p-image');
  const fileNameDisplay = document.getElementById('file-name-display');
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        fileNameDisplay.textContent = this.files[0].name;
      } else {
        fileNameDisplay.textContent = '';
      }
    });
  }
 
  // Handle form submit
  const form = document.getElementById('addProductForm');
  const msgEl = document.getElementById('form-msg');
 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
 
    // Basic client-side check
    const name      = document.getElementById('p-name').value.trim();
    const category  = document.getElementById('p-category').value;
    const price     = document.getElementById('p-price').value.trim();
    const condition = document.getElementById('p-condition').value;
    const desc      = document.getElementById('p-desc').value.trim();
 
    if (!name || !category || !price || !condition || !desc) {
      showMsg('Please fill in all fields.', 'red');
      return;
    }
 
    // Use FormData so the image file is included
    const formData = new FormData(form);
 
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publishing...';
 
    fetch('add-product.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showMsg('Product listed successfully! Redirecting...', 'green');
        form.reset();
        fileNameDisplay.textContent = '';
        setTimeout(() => {
          window.location.href = 'market.html';
        }, 2000);
      } else {
        showMsg(data.message || 'Something went wrong.', 'red');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Listing';
      }
    })
    .catch(() => {
      showMsg('Server error. Please try again.', 'red');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Publish Listing';
    });
  });
 
  function showMsg(text, color) {
    msgEl.textContent = text;
    msgEl.style.color = color === 'green' ? '#2c9664' : '#e53e3e';
  }
});
