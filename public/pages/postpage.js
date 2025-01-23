const btn = document.querySelector('.buttonpost')

const ownprofile2 = document.querySelector('.pp');

const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')


const getProfilepic = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data];
        UserIdForPost = profiles[0].user._id

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('');
    } catch (error) {
        console.error("Error fetching profile picture:", error);
    }
}

(async () => {
    await getProfilepic();
})()

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const caption = document.querySelector('.pcaption').value
    const type = document.querySelector('.ptype').value
    const category = document.querySelector('.pcategory').value
    const images = document.querySelector('.upimages').files

    const formData=new FormData()
    
    formData.append('type',type)
    formData.append('caption',caption)
    formData.append('category',category)

    for(let i=0;i<images.length;i++)
    {
        formData.append('images',images[i])
    }

    try {
        const response = await fetch('http://localhost:5000/api/v1/createpost', {
            method: 'POST',
            headers: {},
            body: formData
        })

        const result = await response.json()
        window.location.href="homepage.html"
    }
    catch (error) {
        console.log(error)
        alert('Error creating post')
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