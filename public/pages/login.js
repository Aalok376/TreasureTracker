const login = document.querySelector('.signup-container')

login.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch("https://treasuretracker.onrender.com/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.status === 200) {

            document.querySelector('#email').value=''
            document.querySelector('#password').value=''
            window.location.href = "homepage.html"
        }
        else {
            document.getElementById("error-message").textContent = data.msg
        }
    }
    catch (error) {
        document.getElementById("error-message").textContent = "Server error, please try again later.";
    }
})
