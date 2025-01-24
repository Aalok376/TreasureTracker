const btn = document.querySelector('.btn')

let redirect=false

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const newfname = document.querySelector('#fname').value
    const newlname = document.querySelector('#lname').value
    const newContact = document.querySelector('#contact').value
    const newProfilePicture = document.querySelector('#profilepicture').files[0]
    const newCoverPicture = document.querySelector('#coverpicture').files[0]

    if (newfname && newlname) {
        try {
            const response = await fetch('http://localhost:5000/api/v1/updatename', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newfname,newlname })
            })

            const result = await response.json()
            console.log(result.msg)
            if (response.status === 200) {
               redirect=true
            }
        }
        catch (error) {
            console.log(error)
            alert('Error updating name')
        }
    }

    if (newContact) {
        try {
            const response = await fetch('http://localhost:5000/api/v1/updatecontact', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newContact })
            })
            const result = await response.json()
            console.log(result.msg)
            if (response.status === 200) {
                redirect=true
            }
        }
        catch (error) {
            console.log(error)
            alert('Error updating fname')
        }
    }

    if (newProfilePicture) {
        try {
            const profileformData=new FormData()
            profileformData.append('newProfilePicture',newProfilePicture)
            const response = await fetch('http://localhost:5000/api/v1/updateProfilePicture', {
                method: 'PUT',
                headers: {},
                body: profileformData
            })

            const result = await response.json()
            console.log(result.msg)
            if (response.status === 200) {
                redirect=true
            }
        }
        catch (error) {
            console.log(error)
            alert('Error updating profile picture')
        }
    }

    if (newCoverPicture) {
        try {
            const coverformData=new FormData()
            coverformData.append('newCoverPicture',newCoverPicture)
            const response = await fetch('http://localhost:5000/api/v1/updateCoverPicture', {
                method: 'PUT',
                headers: {},
                body: coverformData
            })

            const result = await response.json()
            console.log(result.msg)
            if (response.status === 200) {
                redirect=true
            }
        }
        catch (error) {
            console.log(error)
            alert('Error updating cover Photo')
        }
    }

    if(redirect){
        window.location.href='/pages/profile.html'
    }
})

document.querySelector('.cancel-link').addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = '/pages/profile.html'
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