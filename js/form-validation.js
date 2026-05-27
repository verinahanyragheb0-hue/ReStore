
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.errors = {};
    if (this.form) {
      this.init();
    }
  }

  init() {
    const inputs = this.form.querySelectorAll("input, textarea, select");
    inputs.forEach(input => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("change", () => this.validateField(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name || field.id;
    const required = field.hasAttribute("required");

    // Remove previous error
    this.removeError(field);

    // Check if empty
    if (required && !value) {
      this.showError(field, "This field is required");
      return false;
    }

    // Skip validation if empty and not required
    if (!value) return true;

    // Email validation
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(field, "Please enter a valid email address");
        return false;
      }
    }

    // Password validation
    if (name.toLowerCase().includes("pass") && value.length < 6) {
      this.showError(field, "Password must be at least 6 characters");
      return false;
    }

    // Phone validation
    if (type === "tel" || name.toLowerCase().includes("phone")) {
      const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        this.showError(field, "Please enter a valid phone number");
        return false;
      }
    }

    // Price validation
    if (type === "number" || name.toLowerCase().includes("price")) {
      if (isNaN(value) || parseFloat(value) < 0) {
        this.showError(field, "Please enter a valid price");
        return false;
      }
    }

    // URL validation
    if (type === "url") {
      try {
        new URL(value);
      } catch {
        this.showError(field, "Please enter a valid URL");
        return false;
      }
    }

    // Min length
    if (field.hasAttribute("minlength")) {
      const minLength = parseInt(field.getAttribute("minlength"));
      if (value.length < minLength) {
        this.showError(field, `Must be at least ${minLength} characters`);
        return false;
      }
    }

    // Max length
    if (field.hasAttribute("maxlength")) {
      const maxLength = parseInt(field.getAttribute("maxlength"));
      if (value.length > maxLength) {
        this.showError(field, `Cannot exceed ${maxLength} characters`);
        return false;
      }
    }

    return true;
  }

  showError(field, message) {
    // Add error class to field
    field.style.borderColor = "#e74c3c";
    field.style.boxShadow = "0 0 0 4px rgba(231, 76, 60, 0.1)";

    // Create error message element
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains("field-error")) {
      errorElement = document.createElement("div");
      errorElement.className = "field-error";
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #e74c3c;
      font-size: 12px;
      margin-top: 6px;
      display: block;
    `;
  }

  removeError(field) {
    field.style.borderColor = "#e0e0e0";
    field.style.boxShadow = "none";

    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains("field-error")) {
      errorElement.remove();
    }
  }

  validate() {
    const inputs = this.form.querySelectorAll("input, textarea, select");
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }
}

// Password Strength Indicator
class PasswordStrength {
  constructor(passwordFieldId) {
    this.field = document.getElementById(passwordFieldId);
    if (this.field) {
      this.init();
    }
  }

  init() {
    const container = document.createElement("div");
    container.className = "password-strength-container";
    container.style.cssText = `
      margin-top: 12px;
      display: none;
    `;

    container.innerHTML = `
      <div class="strength-bar">
        <div class="strength-fill" style="width: 0%; background: #888; height: 4px; border-radius: 2px; transition: all 0.3s ease;"></div>
      </div>
      <div class="strength-text" style="font-size: 12px; margin-top: 6px; color: #888;"></div>
    `;

    this.field.parentNode.insertBefore(container, this.field.nextSibling);
    this.strengthBar = container.querySelector(".strength-fill");
    this.strengthText = container.querySelector(".strength-text");
    this.container = container;

    this.field.addEventListener("input", () => this.checkStrength());
  }

  checkStrength() {
    const value = this.field.value;
    let strength = 0;
    const messages = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["#e74c3c", "#e67e22", "#f39c12", "#27ae60", "#2ecc71"];

    if (!value) {
      this.container.style.display = "none";
      return;
    }

    this.container.style.display = "block";

    // Length check
    if (value.length >= 6) strength++;
    if (value.length >= 10) strength++;

    // Character variety checks
    if (/[a-z]/.test(value)) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^a-zA-Z0-9]/.test(value)) strength++;

    const level = Math.min(Math.ceil((strength / 6) * 5), 5) - 1;

    this.strengthBar.style.width = ((level + 1) * 20) + "%";
    this.strengthBar.style.backgroundColor = colors[level];
    this.strengthText.textContent = messages[level];
    this.strengthText.style.color = colors[level];
  }
}

// Email Verification Indicator
class EmailVerification {
  constructor(emailFieldId) {
    this.field = document.getElementById(emailFieldId);
    if (this.field) {
      this.init();
    }
  }

  init() {
    this.field.addEventListener("blur", () => this.verify());
  }

  verify() {
    const value = this.field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
      this.field.style.borderColor = "#27ae60";
      this.field.style.boxShadow = "0 0 0 4px rgba(39, 174, 96, 0.1)";

      let checkElement = this.field.nextElementSibling;
      if (!checkElement || !checkElement.classList.contains("email-check")) {
        checkElement = document.createElement("div");
        checkElement.className = "email-check";
        this.field.parentNode.insertBefore(checkElement, this.field.nextSibling);
      }

      checkElement.innerHTML = '<i class="fa-solid fa-check" style="color: #27ae60; font-size: 12px; margin-top: 6px;"></i>';
    }
  }
}

// Toast Notification Function
function showToast(message, type = "info", duration = 3000) {
  const toast = document.createElement("div");
  const colors = {
    success: "#27ae60",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db"
  };

  const icons = {
    success: "fa-check-circle",
    error: "fa-circle-exclamation",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info"
  };

  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    font-family: "Space Grotesk", sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  `;

  toast.innerHTML = `
    <i class="fa-solid ${icons[type]}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Add animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @media (max-width: 576px) {
    [style*="position: fixed"][style*="right: 20px"] {
      right: 10px !important;
      left: 10px !important;
      width: calc(100% - 20px) !important;
    }
  }
`;
document.head.appendChild(style);

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { FormValidator, PasswordStrength, EmailVerification, showToast };
}
