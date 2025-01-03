const verify = document.querySelector('.otpverifier')

verify.addEventListener('submit', async (e) => {
    e.preventDefault();

    const Otp1 = document.getElementById('inn1').value;
    const Otp2 = document.getElementById('inn2').value;
    const Otp3 = document.getElementById('inn3').value;
    const Otp4 = document.getElementById('inn4').value;
    const Otp5 = document.getElementById('inn5').value;
    const Otp6 = document.getElementById('inn6').value;

    const userInputOtp = Otp1 + Otp2 + Otp3 + Otp4 + Otp5 + Otp6;
    if (!userInputOtp) {
        document.getElementById("error-otp").textContent = "Please enter the OTP."
        return;
    }
    
    const username = sessionStorage.getItem('username');
    const fname = sessionStorage.getItem('fname');
    const lname = sessionStorage.getItem('lname');
    const password = sessionStorage.getItem('password');

    try {
        const response = await fetch("http://localhost:5000/api/v1/verifyOtp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, fname, lname, password, userInputOtp }),
        });

        const data = await response.json();
        if (response.status === 200) {
            alert('User registered successfully');
            window.location.href = "login.html";
        }
        else {
            document.getElementById("error-otp").textContent = data.msg;
        }
    }
    catch (error) {
        document.getElementById("error-otp").textContent = "Server error. Please try again later."
    }
})

