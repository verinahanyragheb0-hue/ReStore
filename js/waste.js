document.addEventListener("DOMContentLoaded", () => {
    const ewasteForm = document.getElementById("ewasteForm");
    const radioMethods = document.querySelectorAll('input[name="disposal-method"]');
    const addressGroup = document.getElementById("pickup-address-group");
    const addressInput = document.getElementById("ewaste-address");
    radioMethods.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "pickup") {
                addressGroup.style.display = "flex";
                addressInput.required = true;
            } else {
                addressGroup.style.display = "none";
                addressInput.required = false;
                addressInput.value = "";
            }
        });
    });
    if (addressInput) addressInput.required = true;
    if (ewasteForm) {
        ewasteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const items = document.getElementById("ewaste-device-list").value;
            const method = document.querySelector('input[name="disposal-method"]:checked').value;
            const date = document.getElementById("ewaste-date").value;
            console.log("E-Waste Submission:", { items, method, date });
            let successMessage = `Thank you for choosing ReStore!\nYour disposal request for "${items}" via ${method === 'pickup' ? 'Home Pickup' : 'Center Drop-off'} on ${date} has been successfully registered.`;
            alert(successMessage);
            ewasteForm.reset();
            addressGroup.style.display = "flex";
            addressInput.required = true;
        });
    }
});