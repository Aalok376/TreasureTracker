const signup = document.querySelector('.signup-form')

signup.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const cpassword = document.querySelector('#confirm-password').value;

    if (password !== cpassword) {
        document.getElementById("error-message").textContent = "Please enter the same password."
        return;
    }

    const fname = document.querySelector('#fname').value;
    const lname = document.querySelector('#lname').value;

    sessionStorage.setItem('username', username);
    sessionStorage.setItem('fname', fname);
    sessionStorage.setItem('lname', lname);
    sessionStorage.setItem('password', password);

    try {
        const response = await fetch("http://localhost:5000/api/v1/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })

        const data = await response.json();

        if (response.status === 200) {
            window.location.href = "otp.html";
        }
        else {
            document.getElementById("error-message").textContent = data.msg
        }
    }
    catch (error) {
        document.getElementById("error-message").textContent = "Server error. Please try again later."
    }
});

    