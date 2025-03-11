const verify = document.querySelector('.otpverifier')
const resend=document.querySelector('.footer-link')
const resendMessage=document.querySelector('.resend-otp')

const username = sessionStorage.getItem('username')

const ownprofile2 = document.querySelector('.pp')
const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')

resend.disabled=true
startResetTimer(60)

const getProfilepic = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data];

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('');
    } catch (error) {
        console.error("Error fetching profile picture:", error);
    }
};
(async () => {
    await getProfilepic()
})()

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

ownprofile2.addEventListener('click', async (event) => {
    
    window.location.href = "/pages/profile.html"

})

changepasswordbtn.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/changepassword.html"
})

deleteUser.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/delete.html"
})

logoutUser.addEventListener('click', async (e) => {
    e.preventDefault()

    try {

        const response = await fetch('http://localhost:5000/api/v1/logout')

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

const sideBar = document.querySelector('.sidemenu')
const hideSidebar = () => {
    sideBar.classList.add('disappear')
    sideBar.classList.remove('appear')
}
const openSidebar = () => {
    sideBar.classList.add('appear')
    sideBar.classList.remove('disappear')
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

//For searching items

const searchInput = document.getElementById('text')

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { 
        const query1 = searchInput.value.trim()
        if (query1) {
            sessionStorage.setItem('query',query1)
            window.location.href="/pages/searchedpost.html"
            searchInput.value=''
        }
    }
})

//Event listener for aside-menu
const home=document.querySelector('.homepage')
const message=document.querySelector('.Messagepage')
const friends=document.querySelector('.Friends')
const saved=document.querySelector('.SavedPosts')

home.addEventListener('click',async(e)=>{
    e.preventDefault()

    window.location.href="/pages/homepage.html"
})
// message.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })

// friends.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })

// saved.addEventListener('click',async(e)=>{
//     e.preventDefault()

//     window.location.href=""
// })

