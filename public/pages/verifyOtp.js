const verify = document.querySelector('.otpverifier')
const resend=document.querySelector('.footer-link')
const resendMessage=document.querySelector('.resend-otp')

const username = sessionStorage.getItem('username');

resend.disabled=true;
startResetTimer(60);

verify.addEventListener('submit', async (e) => {
    e.preventDefault();

    const Otp1 = document.getElementById('inn1').value;
    const Otp2 = document.getElementById('inn2').value;
    const Otp3 = document.getElementById('inn3').value;
    const Otp4 = document.getElementById('inn4').value;
    const Otp5 = document.getElementById('inn5').value;
    const Otp6 = document.getElementById('inn6').value;

    const userInputOtp = Otp1 + Otp2 + Otp3 + Otp4 + Otp5 + Otp6;
    if (!userInputOtp) {
        document.getElementById("error-otp").textContent = "Please enter the OTP."
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/v1/verifyotptoupdate", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username,userInputOtp }),
        });

        const data = await response.json();
        if (response.status === 200) {
            window.location.href = "/pages/newpassword.html";
            sessionStorage.clear();
        }
        else {
            document.getElementById("error-otp").textContent = data.msg;
        }
    }
    catch (error) {
        document.getElementById("error-otp").textContent = "Server error. Please try again later."
    }
})

resend.addEventListener('click',async(e)=>{
    e.preventDefault();

    resend.disabled=true;
    startResetTimer(60);

    try{
        const response=await fetch("http://localhost:5000/api/v1/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({username,password}),
        })

        const data=await response.json();
        if(response.status===200){
             console.log('Otp sent!')
        }
        else{
            document.getElementById("error-otp").textContent=data.msg;
        }

    }catch(error){
        console.log(error);
        document.getElementById("error-otp").textContent="Server error. Please try again later";
    }
})

function startResetTimer(seconds){
    let remainingTime=seconds;

    resendMessage.textContent=`Resend in:${remainingTime}s`;

    const interval=setInterval(()=>{
        remainingTime=remainingTime-1;
        resendMessage.textContent=`Resend in:${remainingTime}s`

        if(remainingTime<0){
            clearInterval(interval);
            resend.disabled=false;
            resendMessage.textContent='';
        }
    },1000)
}
const sideBar = document.querySelector('.sidemenu')
const hideSidebar = () => {
    sideBar.classList.add('disappear')
    sideBar.classList.remove('appear')
}
const openSidebar = () => {
    sideBar.classList.add('appear')
    sideBar.classList.remove('disappear')
}
