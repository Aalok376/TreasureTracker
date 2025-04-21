const messagebtn=document.querySelector('.btn')

messagebtn.addEventListener('click',async(e)=>{
    e.preventDefault()

    const Name=document.querySelector('#name').value
    const Email=document.querySelector('#email').value
    const Message=document.querySelector('#message').value
    const Subject=document.querySelector('#subject').value
    
    if(!Name||!Email||!Message|!Subject){
        document.getElementById("error-message").textContent = 'Please provide all fields'
        return
    }

    try {
        const response = await fetch("https://treasure-tracker-pi.vercel.app/api/v1/contactwithus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Name,Email,Message,Subject }),
        })

        const data = await response.json();
        console.log(data)

        if (response.status === 200) {
            alert('Contact Successful')
            window.location.reload()
        }
        else {
            document.getElementById("error-message").textContent = data.msg
        }
    }catch(error){
        console.error(error)
        document.querySelector('#error-message').textContent='Internal server error!'
    }
})