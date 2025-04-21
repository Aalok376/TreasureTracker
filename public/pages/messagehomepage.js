const { default: socket } = await import("./socket.js")

const conversations = document.querySelector('.formappingofchat')
const messageContainer = document.querySelector('.containerformessage')

const navbar = document.createElement('div')
navbar.classList.add('navbar')

const messagemapping = document.createElement('div')
messagemapping.classList.add('messagemapping')

const footer = document.createElement('footer')
footer.classList.add('footer')
footer.innerHTML = `<input class="inputvalue" type="text" placeholder="Type a message">
            <div class="send"><i class="fa-solid fa-paper-plane fa-2xl" style="color: #000000;"></i></div>`

let userId

let socketVar = false
let conversationId

const getConversations = async () => {
    try {

        const response = await fetch('https://treasuretracker.onrender.com/api/v1/getConversations')

        const data = await response.json()
        console.log(data)

        await setConversations(data)
    } catch (error) {
        console.error(error)
    }
}

const createConversations = async (receiverId, message) => {
    try {
        const response = await fetch(`https://treasuretracker.onrender.com/api/v1/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ receiverId, message }),
        })
        const data = await response.json()

        return { data }
    } catch (error) {
        console.error(error)
    }
}

(
    async () => {
        await getConversations()
    }
)()

const setConversations = async (data) => {
    try {
        if (data.length > 0) {
            conversations.innerHTML = data.map(dat => `
            <div class="contact" id=${dat._id}>    
                <div class="profileimage" style="background-image: url('https://treasuretracker.onrender.com/${dat.otherParticipant?.profilePicture?.replace(/\\/g, '/')}')"></div>
                <div class="placeforname">${dat.otherParticipant?.fname} ${dat.otherParticipant?.lname}</div>
            </div>
            `).join(' ')
        }

    } catch (error) {
        console.error(error)
    }
}

conversations.addEventListener('click', async (event) => {
    const convo = event.target.closest('.contact')
    if (!convo) return

    conversationId = convo.id

    let messageId

    try {
        messagemapping.innerHTML = ''

        const response = await fetch(`https://treasuretracker.onrender.com/api/v1/getMessage/${conversationId}`)
        const data = await response.json()

        userId = data.userId
        const participants = data.conversation.participants
        const Messages = data.conversation.messages

        const otherParticipant = participants.find(participant => participant._id.toString() !== userId)

        footer.id = `${otherParticipant._id}`

        if (!messageContainer.contains(navbar)) messageContainer.appendChild(navbar)
        if (!messageContainer.contains(messagemapping)) messageContainer.appendChild(messagemapping)
        if (!messageContainer.contains(footer)) messageContainer.appendChild(footer)

        await getHeaderOfmessage(otherParticipant)

        Messages.forEach(message => setMessages(message, messageId, conversationId))

        socketVar = true
    } catch (error) {
        console.log(error)
    }
});

const getHeaderOfmessage = async (otherParticipant) => {
    const messageHeader = messageContainer.querySelector('.navbar')

    messageHeader.innerHTML = `
        <div class="navprofileimg" id=${otherParticipant._id} style="background-image: url('https://treasuretracker.onrender.com/${otherParticipant?.profilePicture?.replace(/\\/g, '/')}')"></div>
        <div class="navplaceforname">${otherParticipant?.fname} ${otherParticipant?.lname}</div>
    `
}

const setMessages = async (message, messageId, conversationId) => {
    const isMyMessage = message.senderId === userId

    const messageDiv = document.createElement("div")
    messageDiv.classList.add(isMyMessage ? "messagefromme" : "messagefromuser")
    messageDiv.id = messageId
    if (message._id) {
        messageDiv.id = message._id
    }
    else {
        messageDiv.id = messageId
    }

    messageDiv.innerHTML = `
        ${isMyMessage ? `<div class="threedot" id="dot1">
            <i class="fa-solid fa-ellipsis" style="color: #000000;"></i></div>
            <div class="threedoti" id="dot2" style="display: none;">
            <i class="fa-solid fa-xmark" style="color: #000000;"></i></div>` : ""}
         <span class="message-text">${message.message}</span>
    `

    messagemapping.appendChild(messageDiv)

    if (isMyMessage) {
        appendDropdownMenu(messageDiv, "dropdownmenu1", message, messageId, conversationId)
    }

    messagemapping.scrollTop = messagemapping.scrollHeight
}

const appendDropdownMenu = (parent, menuClass, message, messageId, conversationId) => {
    const menu = document.createElement("div")
    menu.classList.add(menuClass)
    menu.style.display = "none"

    const msgId = message?.["_id"] || messageId

    if (menuClass === "dropdownmenu1") {
        menu.innerHTML = `
            <div class="edit" id="${msgId}">
                <i class="fa-solid fa-pen" style="color: #000000;"></i> Edit
            </div>
            <div class="deletemine" id="${conversationId}">
                <i class="fa-solid fa-trash" style="color: #000000;"></i> Delete
            </div>
        `
    }
    parent.appendChild(menu)
}

messagemapping.addEventListener('click', async (event) => {
    const messagediv = event.target.closest('.messagefromme')

    const threeDot = messagediv.querySelector('.threedot')
    const crossdot = messagediv.querySelector('.threedoti')
    const dropdown1 = messagediv.querySelector('.dropdownmenu1')

    const messageText = messagediv.querySelector('.message-text')
    const originalText = messageText.textContent

    const editbtn = messagediv.querySelector('.edit')
    const deletebtn = messagediv.querySelector('.deletemine')

    if (event.target.closest('.threedot')) {
        dropdown1.style.display = 'flex'
        threeDot.style.display = 'none'
        crossdot.style.display = 'flex'
    }
    else if (event.target.closest('.threedoti')) {
        dropdown1.style.display = 'none'
        threeDot.style.display = 'flex'
        crossdot.style.display = 'none'
    }
    else if (event.target.closest('.edit')) {

        dropdown1.style.display = 'none'
        threeDot.style.display = 'none'
        crossdot.style.display = 'none'

        const messageId = editbtn.id
        const conversationId = deletebtn.id

        const inputField = document.createElement("input")
        inputField.type = "text"
        inputField.value = originalText
        inputField.classList.add("edit-input")

        messageText.innerHTML = ""
        messageText.appendChild(inputField)

        inputField.focus()

        inputField.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                const newMessageText = inputField.value.trim()

                if (!newMessageText) {
                    messageText.innerHTML = originalText
                    threeDot.style.display = 'flex'
                }

                const key = await editMessage(messageId, conversationId, newMessageText)

                if (key) {
                    messageText.innerHTML = newMessageText
                    threeDot.style.display = 'flex'
                }
                else {
                    messageText.innerHTML = originalText
                    threeDot.style.display = 'flex'
                }
            }
        })

    }
    else if (event.target.closest('.deletemine')) {

        const messageId = editbtn.id
        const conversationId = deletebtn.id

        const data = await deleteMessage(messageId, conversationId)

        if (data) {
            messagediv.remove()
        }
        else {
            dropdown1.style.display = 'none'
            threeDot.style.display = 'flex'
            crossdot.style.display = 'none'
        }

    }
})

const editMessage = async (messageId, conversationId, newMessageText) => {

    try {
        const response = await fetch(`https://treasuretracker.onrender.com/api/v1/editMessage`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageId, conversationId, newMessageText }),
        })
        const data = await response.json()

        if (response.status === 200) {
            return true
        }
    } catch (error) {
        console.error(error)
    }
}

const deleteMessage = async (messageId, conversationId) => {

    try {
        const response = await fetch(`https://treasuretracker.onrender.com/api/v1/removeMessage/${conversationId}/${messageId}`, {
            method: "DELETE",

        })
        const data = await response.json()

        if (response.status === 200) {
            return true
        }
    } catch (error) {
        console.error(error)
    }
}


const sendBtn = footer.querySelector('.send').addEventListener('click', async () => {

    const message = footer.querySelector('.inputvalue').value
    const receiverId = footer.id

    console.log(conversationId)

    const { data } = await createConversations(receiverId, message)

    if (data) {
        footer.querySelector('.inputvalue').value = ''
    }

    const Message = data.newMessage
    const messageId = data.messageId

    setMessages(Message, messageId, conversationId)

    await getConversations()

})

socket.on("textMessage", (data) => {
    const Message = data.newMessage
    const messageId = data.messageId

    setMessages(Message, messageId)

})

socket.on("editedMessage", (data) => {
    if (socketVar) {
        const messageId = data.messageId

        const messageDiv = document.getElementById(messageId)
        if (messageDiv) {
            const messageText = messageDiv.querySelector('.message-text')
            if (messageText) {
                messageText.innerHTML = data.newMessageText
                console.log(`Message ${messageId} updated from UI`);
            }
        } else {
            console.log("Message element not found in DOM");
        }
    }

})

socket.on("detetedMessage", (data) => {
    if (socketVar) {
        const messageId = data.messageId

        const messageDiv = document.getElementById(messageId);

        if (messageDiv) {
            messageDiv.remove()
            console.log(`Message ${messageId} removed from UI`);
        } else {
            console.log("Message element not found in DOM");
        }
    }
})

const home = document.querySelector('.homepage')
const message = document.querySelector('.Messagepage')
const friends = document.querySelector('.Friends')
const saved = document.querySelector('.SavedPosts')
const notification = document.querySelector('.Notifications')

home.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/homepage.html"
})
message.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.reload()
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

