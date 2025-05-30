const btn = document.querySelector('.buttonpost')

const ownprofile2 = document.querySelector('.pp');

const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')


const getProfilepic = async () => {
    try {
        const response = await fetch("https://treasuretracker.onrender.com/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data];
        UserIdForPost = profiles[0].user._id

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('https://treasuretracker.onrender.com/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('');
    } catch (error) {
        console.error("Error fetching profile picture:", error);
    }
}

(async () => {
    await getProfilepic();
})()

btn.addEventListener('click', async (e) => {
    e.preventDefault()

    btn.disabled = true

    const caption = document.querySelector('.pcaption').value
    const type = document.querySelector('.ptype').value
    const category = document.querySelector('.pcategory').value
    const images = document.querySelector('.upimages').files

    const formData = new FormData()

    formData.append('type', type)
    formData.append('caption', caption)
    formData.append('category', category)

    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i])
    }

    try {
        const response = await fetch('https://treasuretracker.onrender.com/api/v1/createpost', {
            method: 'POST',
            headers: {},
            body: formData
        })
        
        if (response.status === 200) {
            window.location.href = "homepage.html"
        }
    }
    catch (error) {
        console.log(error)
        alert('Error creating post')
    } finally {
        btn.disabled = false
    }
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

//For searching items

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
