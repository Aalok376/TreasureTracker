const ownprofile2 = document.querySelector('.pp');
const continuebtn = document.querySelector('.signup-btn')

const getProfilepic = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data];

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('');
    } catch (error) {
        console.error("Error fetching profile picture:", error);
    }
};
(async () => {
    await getProfilepic()
})();

continuebtn.addEventListener('click', async (e) => {
    e.preventDefault()
    const username = document.querySelector('#email').value
    console.log(username)

    if (!username) {
        document.getElementById("error-message").textContent = "Please enter the email."
        return;
    }
    sessionStorage.setItem('username', username)

    try {
        const response = await fetch("http://localhost:5000/api/v1/sendmailincaseofforgot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        })

        const data = await response.json();

        if (response.status === 200) {
            window.location.href = "verifyOtp.html"
        }
        else {
            document.getElementById("error-message").textContent = data.msg
        }
    }
    catch (error) {
        document.getElementById("error-message").textContent = "Server error. Please try again later."
    }
})
