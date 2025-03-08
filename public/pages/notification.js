const ownprofile2 = document.querySelector('.pp')

const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')

const markallAsread = document.querySelector('.markallasread')

const posthtml = document.querySelector('.notificationarea')

let Notificationss

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

const getNotifications = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/getNotification", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()

        Notificationss = data.notifications

        await UpdateNotifications(Notificationss)
        await updateNotificationBackgroundColor(Notificationss)
    }
    catch (error) {
        console.log(error)
    }
}

(async () => {
    await getProfilepic()
    await getNotifications()
})()

const UpdateNotifications = async (Notificationss) => {
    if (Notificationss.length >= 0) {
        posthtml.innerHTML = Notificationss.map(post => `
            <div class="notificationcontainer" id=${post._id} data-user-id="${post.postId}">
                        <div class="sectionforprofile">
                            <div class="profileimagefornotification" style="background-image: url('http://localhost:5000/${post.senderId.profilePicture?.replace(/\\/g, '/')}')"></div>
                            <div class="placefornotificationandname">
                            ${post.senderId.fname} ${post.senderId.lname} ${post.type} your post
                            </div>
                        </div>
                       
                        <span class="cspaceforthreedot">
                            <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                            <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                             <div class="dropdownmenu">
                            <li>
                                <div class="cmakeasread"><i class="fa-solid fa-pen"></i> Mark as read</div>
                            </li>
                            <li>
                                <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                            </li>
                        </div>
                        </span>
                       
                    </div>
                `
        ).join('')
    }
}
const updateNotificationBackgroundColor=async(Notificationss)=>{
    for(let notifi of Notificationss){
        const postElement = document.getElementById(notifi._id)
        if(notifi.isRead===true){
            postElement.style.backgroundColor='transparent'
        }
    }
}

const getele = async () => {
    const notifications = document.querySelectorAll('.notificationcontainer')

    const response = await fetch(`http://localhost:5000/api/v1/notificationsmarkAllAsRead`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (response.status === 200) {
        
        if (notifications.length > 0) {
            notifications.forEach(notification => {
                notification.style.backgroundColor = 'transparent'
            })
        }

    }
    else if(response.status===202){
        return
    }
}

posthtml.addEventListener('click', async (event) => {
    const postelement = event.target.closest('.notificationcontainer')

    const dropDownMenu2 = postelement.querySelector('.dropdownmenu')
    const tooglebtnIcon2 = postelement.querySelector('.cthreedot2 i')
    const tooglebtnIcon = postelement.querySelector('.cthreedot i')

    if (event.target.closest('.cthreedot i')) {
        event.target.style.display = 'none'
        tooglebtnIcon2.style.display = 'flex'
        dropDownMenu2.style.display = 'block'
    }
    else if (event.target.closest('.cthreedot2 i')) {
        event.target.style.display = 'none'
        tooglebtnIcon.style.display = 'flex'
        dropDownMenu2.style.display = 'none'
    }
})

posthtml.addEventListener('click', async (event) => {
    const postElement = event.target.closest('.notificationcontainer')
    const dropDownMenu2 = postElement.querySelector('.dropdownmenu')
    const tooglebtnIcon2 = postElement.querySelector('.cthreedot2 i')
    const tooglebtnIcon = postElement.querySelector('.cthreedot i')
    const notificationId = postElement.id

    if (event.target.closest('.cmakeasread')) {
        const response = await fetch(`http://localhost:5000/api/v1/notificationsread`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificationId }),
        })

        if (response.status === 200) {
            postElement.style.backgroundColor = 'transparent'
            tooglebtnIcon2.style.display = 'none'
            dropDownMenu2.style.display = 'none'
            tooglebtnIcon.style.display = 'flex'

        }
    }
    else if (event.target.closest('.cdelete')) {
        try {
            (async () => {
                const response = await fetch(`http://localhost:5000/api/v1/deleteNotification/${notificationId}`, {
                    method: "DELETE"
                })
                const data = await response.json()

                if (response.status === 200) {
                    dropDownMenu2.style.display = 'none'
                    await getNotifications()
                }
            })()
        } catch (error) {
            console.error(error)
        }
    }
})

markallAsread.addEventListener('click', async (e) => {
    await getele()
}
)

posthtml.addEventListener('click',async(event)=>{
    const postElement = event.target.closest('.notificationcontainer')
    const notificationId = postElement.id

    if(postElement){
    const postId = postElement.getAttribute("data-user-id")
    sessionStorage.setItem('postId',postId)
    }

    if(event.target.closest('.sectionforprofile')){

        const response = await fetch('http://localhost:5000/api/v1/notificationsread', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificationId }),
        })

        if (response.status === 200) {
            postElement.style.backgroundColor = 'transparent'
            window.location.href='/pages/profile.html'
        }
    }
})

//event for change password btn
changepasswordbtn.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/changepassword.html"
})

//event for delete btn
deleteUser.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/delete.html"
})

//Event for logout btn
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

const home = document.querySelector('.homepage')
const message = document.querySelector('.Messagepage')
const friends = document.querySelector('.Friends')
const saved = document.querySelector('.SavedPosts')
const notification = document.querySelector('.Notifications')

home.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "homepage.html"
})
// message.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })

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

    window.location.reload()
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
