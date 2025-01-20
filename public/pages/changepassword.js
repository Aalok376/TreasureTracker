const currentpassword = document.querySelector('#current-password')
const newpass = document.querySelector('#new-password')
const cnewpass = document.querySelector('#confirm-password')

const fbutton = document.querySelector('.forgetpassword')
const cbutton = document.querySelector('.submit-btn')

const ownprofile2 = document.querySelector('.pp');


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

cbutton.addEventListener('click', async (e) => {
    e.preventDefault()

    const password = currentpassword.value
    const newPassword = newpass.value
    const newPassword1 = cnewpass.value

    if (newPassword != newPassword1) {
        document.getElementById("error-message").textContent = "Please enter the same password."
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/v1/check", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        })

        const data = await response.json();

        if (response.status === 200) {
            try {
                const response = await fetch("http://localhost:5000/api/v1/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ newPassword }),
                })

                const data = await response.json();

                if (response.status === 200) {
                    alert('Password Updated Successfully')
                    document.querySelector('#current-password').value=''
                    document.querySelector('#new-password').value=''
                    document.querySelector('#confirm-password').value=''
                    window.location.href = "homepage.html";
                }
                else {
                    document.getElementById("error-message").textContent = data.msg
                }
            }
            catch (error) {
                document.getElementById("error-message").textContent = "Server error. Please try again later."
            }
        }
        else {
            document.getElementById("error-message").textContent = data.msg
        }
    }
    catch (error) {
        document.getElementById("error-message").textContent = "Server error. Please try again later."
    }
})

fbutton.addEventListener('click',async(e)=>{
    e.preventDefault()

    window.location.href="forgetlogin.html"
})