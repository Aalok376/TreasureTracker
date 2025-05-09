const btn = document.querySelector('.btn')

const ownprofile2 = document.querySelector('.pp')
const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')

let redirect = false


const getProfilepic = async () => {
    try {
        const response = await fetch("https://treasuretracker.onrender.com/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data]

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('https://treasuretracker.onrender.com/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('');

        document.querySelector('#fname').value = profiles[0].user.fname || ''
        document.querySelector('#lname').value = profiles[0].user.lname || ''
        document.querySelector('#contact').value = profiles[0].user.contactNumber || ''
        if (profiles[0]?.user?.profilePicture) {
            document.querySelector('#profilePreview').src = `https://treasuretracker.onrender.com/${profiles[0]?.user?.profilePicture.replace(/\\/g, '/')}`
            document.querySelector('#profilePreview').style.display= 'block'
        } 

        if (profiles[0].user.coverPicture) {
            document.querySelector('#coverPreview').src=`https://treasuretracker.onrender.com/${profiles[0].user?.coverPicture?.replace(/\\/g, '/')}`
            document.querySelector('#coverPreview').style.display= 'block'
        }

    } catch (error) {
        console.error("Error fetching profile picture:", error);
    }
};
(async () => {
    await getProfilepic()
})()

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const newfname = document.querySelector('#fname').value
    const newlname = document.querySelector('#lname').value
    const newContact = document.querySelector('#contact').value
    const newProfilePicture = document.querySelector('#profilepicture').files[0]
    const newCoverPicture = document.querySelector('#coverpicture').files[0]

    if (newfname && newlname) {
        try {
            const response = await fetch('https://treasuretracker.onrender.com/api/v1/updatename', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newfname, newlname })
            })

            const result = await response.json()
            console.log(result.msg)
            if (response.status === 200) {
                redirect = true
            }
        }
        catch (error) {
            console.log(error)
            alert('Error updating name')
        }
    }

    if (newContact) {
        try {
            const response = await fetch('https://treasuretracker.onrender.com/api/v1/updatecontact', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newContact })
            })
            const result = await response.json()
            console.log(result.msg)
            if (response.status === 200) {
                redirect = true
            }
        }
        catch (error) {
            console.log(error)
            alert('Error updating fname')
        }
    }

    if (newProfilePicture) {
        try {
            const profileformData = new FormData()
            profileformData.append('newProfilePicture', newProfilePicture)
            const response = await fetch('https://treasuretracker.onrender.com/api/v1/updateProfilePicture', {
                method: 'PUT',
                headers: {},
                body: profileformData
            })

            const result = await response.json()
            console.log(result.msg)
            if (response.status === 200) {
                redirect = true
            }
        }
        catch (error) {
            console.log(error)
            alert('Error updating profile picture')
        }
    }

    if (newCoverPicture) {
        try {
            const coverformData = new FormData()
            coverformData.append('newCoverPicture', newCoverPicture)
            const response = await fetch('https://treasuretracker.onrender.com/api/v1/updateCoverPicture', {
                method: 'PUT',
                headers: {},
                body: coverformData
            })

            const result = await response.json()
            console.log(result.msg)
            if (response.status === 200) {
                redirect = true
            }
        }
        catch (error) {
            console.log(error)
            alert('Error updating cover Photo')
        }
    }

    if (redirect) {
        window.location.href = '/pages/profile.html'
    }
})

document.querySelector('.cancel-link').addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = '/pages/profile.html'
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

        const response = await fetch('https://treasuretracker.onrender.com/api/v1/logout')

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

const searchInput = document.getElementById('text')

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const query1 = searchInput.value.trim()
        if (query1) {
            sessionStorage.setItem('query', query1)
            window.location.href = "/pages/searchedpost.html"
            searchInput.value = ''
        }
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


const home = document.querySelector('.homepage')
const message = document.querySelector('.Messagepage')
const friends = document.querySelector('.Friends')
const saved = document.querySelector('.SavedPosts')
const notification=document.querySelector('.Notifications')

home.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/homepage.html"
})
message.addEventListener('click',async(e)=>{
    e.preventDefault()

    window.location.href="/pages/messagehomepage.html"
})

friends.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/friends.html"
})

saved.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "savedPosts.html"
})

notification.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "notification.html"
})
