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

const getConversations = async () => {
    try {

        const response = await fetch('http://localhost:5000/api/v1/getConversations')

        const data = await response.json()
        console.log(data)

        await setConversations(data)
    } catch (error) {
        console.error(error)
    }
}

const createConversations = async (receiverId, message) => {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/sendMessage`, {
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
                <div class="profileimage" style="background-image: url('http://localhost:5000/${dat.otherParticipant?.profilePicture?.replace(/\\/g, '/')}')"></div>
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

    const conversationId = convo.id

    if (event.target.closest('.contact')) {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/getMessage/${conversationId}`)

            const data = await response.json()

            userId = data.userId
            const participants = data.conversation.participants
            const Messages = data.conversation.messages

            const otherParticipant = participants.find(participant => participant._id.toString() !== userId)

            footer.id = `${otherParticipant._id}`

            messageContainer.appendChild(navbar)
            messageContainer.appendChild(messagemapping)
            messageContainer.appendChild(footer)

            await getHeaderOfmessage(otherParticipant)

            Messages.forEach(message => setMessages(message))

        } catch (error) {
            console.log(error)
        }
    }
})

const getHeaderOfmessage = async (otherParticipant) => {
    const messageHeader = messageContainer.querySelector('.navbar')

    messageHeader.innerHTML = `
        <div class="navprofileimg" id=${otherParticipant._id} style="background-image: url('http://localhost:5000/${otherParticipant?.profilePicture?.replace(/\\/g, '/')}')"></div>
        <div class="navplaceforname">${otherParticipant?.fname} ${otherParticipant?.lname}</div>
    `
}

const setMessages = async (message, messageId) => {
    const isMyMessage = message.senderId === userId

    const messageDiv = document.createElement("div")
    messageDiv.classList.add(isMyMessage ? "messagefromme" : "messagefromuser")
    messageDiv.id = message._id || messageId

    messageDiv.innerHTML = `
        ${isMyMessage ? `<div class="threedot" id="dot1">
            <i class="fa-solid fa-ellipsis" style="color: #000000;"></i></div>
            <div class="threedoti" id="dot2" style="display: none;">
            <i class="fa-solid fa-xmark" style="color: #000000;"></i></div>` : ""}
        ${message.message}
    `

    messagemapping.appendChild(messageDiv)

    if (isMyMessage) {
        appendDropdownMenu(messageDiv, "dropdownmenu1", message, messageId)
    }

    messagemapping.scrollTop = messagemapping.scrollHeight
}

const appendDropdownMenu = (parent, menuClass, message, messageId) => {
    const menu = document.createElement("div")
    menu.classList.add(menuClass)
    menu.style.display = "none"

    const msgId = message?.["_id"] || messageId

    console.log(msgId)

    if (menuClass === "dropdownmenu1") {
        menu.innerHTML = `
            <div class="edit" id="${msgId}">
                <i class="fa-solid fa-pen" style="color: #000000;"></i> Edit
            </div>
            <div class="deletemine" id="${msgId}">
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
})


const sendBtn = footer.querySelector('.send').addEventListener('click', async () => {

    const message = footer.querySelector('.inputvalue').value
    const receiverId = footer.id

    const { data } = await createConversations(receiverId, message)

    if (data) {
        footer.querySelector('.inputvalue').value = ''
    }

    const Message = data.newMessage
    const messageId = data.messageId

    setMessages(Message, messageId)

})

socket.on("textMessage", (data) => {
    const Message = data.newMessage
    const messageId = data.messageId

    setMessages(Message, messageId)

})

