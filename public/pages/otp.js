const verify = document.querySelector('.otpverifier')
const resend=document.querySelector('.footer-link')
const resendMessage=document.querySelector('.resend-otp')

const username = sessionStorage.getItem('username');
const fname = sessionStorage.getItem('fname');
const lname = sessionStorage.getItem('lname');
const password = sessionStorage.getItem('password');

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
        const response = await fetch("http://localhost:5000/api/v1/verifyOtp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, fname, lname, password, userInputOtp }),
        });

        const data = await response.json();
        if (response.status === 200) {
            alert('User registered successfully');
            window.location.href = "login.html";
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

const otpInputs = document.querySelectorAll('.otp-input');

otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        const value = input.value
        const nextInput = otpInputs[index + 1]

        if (value && nextInput) {
            nextInput.focus()
        }
    });

    input.addEventListener('keydown', (e) => {
        const previousInput = otpInputs[index - 1]

        if (e.key === 'Backspace') {
            if (input.value === '' && previousInput) {
                previousInput.focus()
            }
        }
    });

    input.addEventListener('paste', (e) => {
        e.preventDefault()
        const data = e.clipboardData.getData('text').slice(0, otpInputs.length)

        otpInputs.forEach((input, i) => {
            input.value = data[i] || ''
        });

        const lastFilledIndex = data.length - 1
        if (otpInputs[lastFilledIndex]) {
            otpInputs[lastFilledIndex].focus()
        }
    })
})