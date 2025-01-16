const login=document.querySelector('.signup-container')

login.addEventListener('submit',async(e)=>{
    e.preventDefault();

    const username=document.querySelector('#email').value;
    const password=document.querySelector('#password').value;

    try{
        const response=await fetch("http://localhost:5000/api/v1/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({username,password}),
        });

        const data= await response.json();

        if(response.status===200){
            window.location.href="homepage.html"
        }
        else{
            document.getElementById("error-message").textContent = data.msg
        }
    }
    catch(error){
        document.getElementById("error-message").textContent = "Server error, please try again later.";
    }
})