const username = document.getElementById('l-email');
const password = document.getElementById('l-pass');
const loginButton = document.getElementById('login-button');
console.log('Script loaded');
loginButton.addEventListener('click', login);


async function login(e) {
    e.preventDefault();

    const user = username.value;
    const pass = password.value;

    console.log(`Username: ${user}, Password: ${pass}`);

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: "POST",
        body: JSON.stringify({
            username: user,
            password: pass
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });

    console.log(response.status);

    if (response.ok) {
        console.log('Login successful');
        window.location.href = "log.html";
    }
}
