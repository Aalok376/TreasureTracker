const currentpassword = document.querySelector('#current-password')
const newpass = document.querySelector('#new-password')
const cnewpass = document.querySelector('#confirm-password')

const fbutton = document.querySelector('.forgetpassword')
const cbutton = document.querySelector('.submit-btn')

const ownprofile2 = document.querySelector('.pp')
const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')


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
})()

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

ownprofile2.addEventListener('click', async (event) => {
    
    window.location.href = "/pages/profile.html"

})

changepasswordbtn.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/changepassword.html"
})

deleteUser.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/delete.html"
})

logoutUser.addEventListener('click', async (e) => {
    e.preventDefault()

    try {

        const response = await fetch('http://localhost:5000/api/v1/logout')

        const data = await response.json()

        if (response.status === 200) {
            window.location.href = "/pages/logout.html"
        }
        else {
            alert(data.msg)
        }
    } catch (error) {
        console.error(error)
        alert('Error logging out!')
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

//For searching items

const searchInput = document.getElementById('text')

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { 
        const query1 = searchInput.value.trim()
        if (query1) {
            sessionStorage.setItem('query',query1)
            window.location.href="/pages/searchedpost.html"
            searchInput.value=''
        }
    }
})

//Event listener for aside-menu

const home=document.querySelector('.homepage')
const message=document.querySelector('.Messagepage')
const friends=document.querySelector('.Friends')
const saved=document.querySelector('.SavedPosts')

home.addEventListener('click',async(e)=>{
    e.preventDefault()

    window.location.href="/pages/homepage.html"
})
// message.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })

// friends.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })

// saved.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })
