const friendsTab = document.getElementById("friends-tab")
const requestsTab = document.getElementById("requests-tab")
const friendsSection = document.getElementById("friends-section")
const requestsSection = document.getElementById("requests-section")

const ownprofile2 = document.querySelector('.pp')

const getProfilepic = async () => {
    try {
        const response = await fetch("https://treasuretracker.onrender.com/api/v1/profile")
        const data = await response.json()

        const profiles = Array.isArray(data) ? data : [data]

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('https://treasuretracker.onrender.com/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('')


    } catch (error) {
        console.error("Error fetching profile picture:", error)
    }
}

(async () => {
    await getProfilepic()
})()

const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')


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

friendsTab.addEventListener("click", async () => {
    friendsTab.classList.add("active")
    requestsTab.classList.remove("active")
    friendsSection.classList.add("active")
    requestsSection.classList.remove("active")
    await getFriendlist()
})

requestsTab.addEventListener("click", async () => {
    requestsTab.classList.add("active")
    friendsTab.classList.remove("active")
    requestsSection.classList.add("active")
    friendsSection.classList.remove("active")
    await getPendingRequest()
})

const friendlist = document.getElementById('friends-list')
const pendinglist = document.getElementById('pending-requests')

const getFriendlist = async () => {
    try {
        const response = await fetch('https://treasuretracker.onrender.com/api/v1/getfriends')

        const data = await response.json()

        const friends = data.friendList
        updatefriendList(friends)
    } catch (error) {
        console.log(error)
    }
}

const getPendingRequest = async () => {
    try {
        const response = await fetch('https://treasuretracker.onrender.com/api/v1/getfriendrequest')

        const data = await response.json()

        const friends = data.requests
        updatePendingList(friends)

    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await getFriendlist()
})()

const updatefriendList = (friends) => {
    if (friends.length > 0) {
        friendlist.innerHTML = friends.map(friend => `
            <div class="areaforfriend" id="${friend._id}">
            <div class="peoples">
                <div class="profileimage" data-user-id="${friend._id}" style="background-image: url('https://treasuretracker.onrender.com/${friend.profilePicture?.replace(/\\/g, '/')}')"></div>
                    <p class="namearea">${friend.fname} ${friend.lname}</p>
                    <div class="addfriend" style="display: none;"><i class="fa-solid fa-user-group"></i> Add Friend</div>
                    <div class="cancelfriend" style="display: none;"><i class="fa-solid fa-xmark"></i> Cancel</div>
                    </div>
                  
                        <span class="spaceforthreedot">
                            <div class="threedot"><i class="fa-solid fa-ellipsis fa-2xl"></i></div>
                            <div class="threedot2"><i class="fa-solid fa-xmark"></i></div>
                        </span>
                        <div class="dropdownmenu">
                            <li>
                                <div class="unfriend"><i class="fas fa-user-times"></i> Unfriend</div>
                            </li>
                       
                    </div>
                </div>
        `).join('')
    }
    else {
        friendlist.innerHTML = `<p class="No-friends">No Friends</p>`
    }
}
const updatePendingList = (friends) => {
    if (friends.length > 0) {
        pendinglist.innerHTML = friends.map(friend => `
            <div class="areaforfriend" id="${friend._id}">
            <div class="peoples">
                <div class="profileimage" data-user-id="${friend.senderId._id}" style="background-image: url('https://treasuretracker.onrender.com/${friend.senderId.profilePicture?.replace(/\\/g, '/')}')"></div>
                    <p class="namearea">${friend.senderId.fname} ${friend.senderId.lname}</p>
                    </div>
                    <div class="forclearing">
                        <div class="confirmfriendrequest"><i class="fa-solid fa-user-group"></i> Confirm</div>
                        <div class="cancelfriendrequest"><i class="fa-solid fa-xmark"></i> Cancel</div>
                    </div>
            </div>
        `).join('')
    }
    else {
        pendinglist.innerHTML = `<p class="No-requests">No Requests</p>`
    }
}

friendlist.addEventListener('click', async (event) => {
    const friendbtn = event.target.closest('.areaforfriend')

    const dropDownMenu2 = friendbtn.querySelector('.dropdownmenu')
    const tooglebtnIcon2 = friendbtn.querySelector('.threedot2 i')
    const tooglebtnIcon = friendbtn.querySelector('.threedot i')

    if (event.target.closest('.threedot i')) {
        event.target.style.display = 'none'
        tooglebtnIcon2.style.display = 'inline-block'
        dropDownMenu2.style.display = 'block'
    }
    else if (event.target.closest('.threedot2 i')) {
        event.target.style.display = 'none'
        tooglebtnIcon.style.display = 'flex'
        dropDownMenu2.style.display = 'none'
    }
})

friendlist.addEventListener('click', async (event) => {
    const friendbtn = event.target.closest('.areaforfriend')
    const addfriendbtn = friendbtn.querySelector('.addfriend')
    const cancelfriendbtn = friendbtn.querySelector('.cancelfriend')
    const profilebtn = friendbtn.querySelector('.profileimage')

    const userId = profilebtn.getAttribute('data-user-id')

    const friendId = friendbtn.id

    const tooglebtnIcon = friendbtn.querySelector('.threedot i')
    const tooglebtnIcon2 = friendbtn.querySelector('.threedot2 i')
    const dropDownMenu2 = friendbtn.querySelector('.dropdownmenu')

    if (event.target.closest('.unfriend')) {
        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/removefriend`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ friendId })
                })
                const data = await response.json()

                if (response.status === 200) {
                    tooglebtnIcon.style.display = 'none'
                    tooglebtnIcon2.style.display = 'none'
                    dropDownMenu2.style.display = 'none'
                    addfriendbtn.style.display = 'flex'
                }
            })()

        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.addfriend')) {
        const receiverId = friendId
        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/sendfriendrequest`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ receiverId })
                })
                const data = await response.json()

                if (response.status === 200) {
                    event.target.closest('.addfriend').style.display = 'none'
                    cancelfriendbtn.style.display = 'flex'
                }
            })()

        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.cancelfriend')) {
        const receiverId = friendId
        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/cancelrequest`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ receiverId })
                })
                const data = await response.json()

                if (response.status === 200) {
                    event.target.closest('.cancelfriend').style.display = 'none'
                    addfriendbtn.style.display = 'flex'
                }
            })()

        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.profileimage')) {
        window.location.href = `/api/v1/userprofile/${userId}`;
    }
    else if (event.target.closest('.message')) {

        try {

        } catch (error) {
            console.error(error)
        }
    }
})

pendinglist.addEventListener('click', async (event) => {
    const friendbtn = event.target.closest('.areaforfriend')
    const profilebtn = friendbtn.querySelector('.profileimage')
    const clearbtn = event.target.closest('.forclearing')

    const requestId = friendbtn.id
    const receiverId = profilebtn.getAttribute('data-user-id')

    if (event.target.closest('.confirmfriendrequest')) {
        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/respondfriendrequest`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ requestId, status: 'accepted' })
                })
                const data = await response.json()

                if (response.status === 200) {
                    clearbtn.innerHTML = ''
                    clearbtn.innerHTML = `<div class="No-requests2"><i class="fa-solid fa-message"></i>Message</div>`

                    console.log(receiverId)
                    createConversations(receiverId)
                }
            })()

        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.cancelfriendrequest')) {
        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/cancelrequest`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ receiverId })
                })
                const data = await response.json()
                console.log(data)

                if (response.status === 200) {
                    await getPendingRequest()
                }
            })()

        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.profileimage')) {
        const userId = receiverId
        window.location.href = `/api/v1/userprofile/${userId}`;
    }
})

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

const createConversations = async (receiverId) => {
    try {
        const response = await fetch(`https://treasuretracker.onrender.com/api/v1/createConversations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ receiverId }),
        })
        const data = await response.json()

    } catch (error) {
        console.error(error)
    }
}