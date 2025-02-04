const friendsTab = document.getElementById("friends-tab")
const requestsTab = document.getElementById("requests-tab")
const friendsSection = document.getElementById("friends-section")
const requestsSection = document.getElementById("requests-section")

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
        const response = await fetch('http://localhost:5000/api/v1/getfriends')

        const data = await response.json()

        const friends = data.friendList
        updatefriendList(friends)
    } catch (error) {
        console.log(error)
    }
}

const getPendingRequest = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/v1/getfriendrequest')

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
                <div class="profileimage" data-user-id="${friend._id}" style="background-image: url('http://localhost:5000/${friend.profilePicture?.replace(/\\/g, '/')}')"></div>
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
                            <li>
                                <div class="message"><i class="fa-solid fa-message"></i> Message</div>
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
                <div class="profileimage" data-user-id="${friend.senderId._id}" style="background-image: url('http://localhost:5000/${friend.senderId.profilePicture?.replace(/\\/g, '/')}')"></div>
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
    const messagebtn = friendbtn.querySelector('.message')

    const userId = profilebtn.getAttribute('data-user-id')

    const friendId = friendbtn.id

    if (event.target.closest('.unfriend')) {
        try {
            (async () => {
                const response = await fetch(`http://localhost:5000/api/v1/removefriend`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ friendId })
                })
                const data = await response.json()

                if (response.status === 200) {
                    event.target.closest('.threedotthing').style.display = 'none'
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
                const response = await fetch(`http://localhost:5000/api/v1/sendfriendrequest`, {
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
                const response = await fetch(`http://localhost:5000/api/v1/cancelrequest`, {
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
                const response = await fetch(`http://localhost:5000/api/v1/respondfriendrequest`, {
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
                }
            })()

        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.cancelfriendrequest')) {
        try {
            (async () => {
                const response = await fetch(`http://localhost:5000/api/v1/cancelrequest`, {
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

const sideBar = document.querySelector('.sidemenu')
const hideSidebar = () => {
    sideBar.classList.add('disappear')
    sideBar.classList.remove('appear')
}
const openSidebar = () => {
    sideBar.classList.add('appear')
    sideBar.classList.remove('disappear')
}