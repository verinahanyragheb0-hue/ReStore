const regForm = document.getElementById('register-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('username');
const passInput = document.getElementById('password');
regForm.onsubmit = function(e) {
    e.preventDefault(); 
    const data = {
        name: nameInput.value,
        email: emailInput.value,
        pass: passInput.value
    };

    console.log("Data :", data);

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" }
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "log.html"; 
            alert("ReStore!");
        }
    });
};