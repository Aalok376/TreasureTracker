const friendsTab = document.getElementById("friends-tab")
const requestsTab = document.getElementById("requests-tab")
const friendsSection = document.getElementById("friends-section")
const requestsSection = document.getElementById("requests-section")

friendsTab.addEventListener("click", () => {
    friendsTab.classList.add("active")
    requestsTab.classList.remove("active")
    friendsSection.classList.add("active")
    requestsSection.classList.remove("active")
})

requestsTab.addEventListener("click", () => {
    requestsTab.classList.add("active")
    friendsTab.classList.remove("active")
    requestsSection.classList.add("active")
    friendsSection.classList.remove("active")
})

const friendlist = document.getElementById('friends-list')
const pendinglist = document.getElementById('pending-requests')

const getFriendlist = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/v1/getfriends')

        const data = await response.json()

        const friends=data.friendList
        console.log(friends)
        updatefriendList(friends)
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await getFriendlist()
})()

const updatefriendList=(friends)=>{
    if (friends.length>0) {
        return friendlist.innerHTML = friends.map(friend => `<div class="areaforfriend" id="${friend._id}">
                         <div class="profileimage" data-user-id="${friend._id}" style="background-image: url('http://localhost:5000/${friend.profilePicture?.replace(/\\/g, '/')}')"></div>
                         <div class="peoples">
                             <p class="namearea">${friend.fname} ${friend.lname}</p>
                             <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis fa-2xl"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
                                <li>
                                    <div class="unfriend"><i class="fa-solid fa-pen"></i> Unfriend</div>
                                </li>
                                <li>
                                    <div class="message"><i class="fa-solid fa-trash"></i> Message</div>
                                </li>
                            </div>
                         </div>
                     </div>`).join('')
        }
        else{
            commentArea.innerHTML = `<p class="No-friends">No Friends</p>`
        }
}
