const btn = document.querySelector('.buttonpost')

const ownprofile2 = document.querySelector('.pp');

const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')

const postId = window.location.pathname.split('/').pop()

const getProfilepic = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile")
        const data = await response.json()

        const profiles = Array.isArray(data) ? data : [data]
        UserIdForPost = profiles[0].user._id

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('')
    } catch (error) {
        console.error("Error fetching profile picture:", error)
    }
}

const getPreviousDetails = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/getSpecificpost/${postId}`)
        const data = await response.json()

        const profiles = Array.isArray(data) ? data : [data]
        console.log(profiles)

        document.querySelector('.pcaption').value = profiles[0].posts.caption
        document.querySelector('.ptype').value = profiles[0].posts.type
        document.querySelector('.pcategory').value = profiles[0].posts.category


        const imagePreviewContainer = document.querySelector('.image-preview');
        imagePreviewContainer.innerHTML = '';


        if (profiles[0].posts.image && profiles[0].posts.image.length > 0) {
            profiles[0].posts.image.forEach((imgPath) => {
                const imgElement = document.createElement('img')
                imgElement.src = `http://localhost:5000/${imgPath.replace(/\\/g, '/')}`
                imagePreviewContainer.appendChild(imgElement)
            });

            imagePreviewContainer.style.display = 'block'
        } else {
            console.log('No images found for this post.')
        }

    } catch (error) {
        console.error(error)
    }
}

(async () => {
    await getProfilepic()
    await getPreviousDetails()
})()

btn.addEventListener('click', async (e) => {
    e.preventDefault();

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
        const response = await fetch(`http://localhost:5000/api/v1/updateOwnPost/${postId}`, {
            method: 'PUT',
            headers: {},
            body: formData
        })

        const result = await response.json()
        if (response.status === 200) {
            window.history.back()
        }
    }
    catch (error) {
        console.log(error)
        alert('Error updating post')
    }
})

document.querySelector('.cancel').addEventListener('click', async (e) => {
    e.preventDefault()

    window.history.back()
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

//Event listener for aside-menu
const home = document.querySelector('.homepage')
const message = document.querySelector('.Messagepage')
const friends = document.querySelector('.Friends')
const saved = document.querySelector('.SavedPosts')

home.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/homepage.html"
})
// message.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })

// friends.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })

saved.addEventListener('click',async(e)=>{
    e.preventDefault()

    window.location.href="/pages/savedPosts.html"
})
