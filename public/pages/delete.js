const ownprofile2 = document.querySelector('.pp');

const continuebtn = document.querySelector('#btnconfirm')
const cancelbtn = document.querySelector('#btncancel')

const getProfilepic = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data];
        document.querySelector('.emaill').textContent = 'Email: ' + profiles[0].user.username
        document.querySelector('.userr').textContent = 'Username: ' + profiles[0].user.fname + ' ' + profiles[0].user.lname

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

cancelbtn.addEventListener('click',async(e)=>{
    e.preventDefault()
    window.location.href="/pages/homepage.html"
})

continuebtn.addEventListener('click',async(e)=>{
    e.preventDefault()

    const password=document.querySelector('#confirmation-input').value

    try {
        const response = await fetch("http://localhost:5000/api/v1/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        })

        const data = await response.json();
        console.log(data)

        if (response.status === 200) {
            window.location.href = "/pages/signup.html"
        }
        else {
            document.getElementById("error-message").textContent = data.msg
        }
    }
    catch (error) {
        document.getElementById("error-message").textContent = "Server error. Please try again later."
    }
})

const sideBar = document.querySelector('.sidemenu')
const hideSidebar = () => {
    sideBar.classList.add('disappear')
    sideBar.classList.remove('appear')
}
const openSidebar = () => {
    sideBar.classList.add('appear')
    sideBar.classList.remove('disappear')
}