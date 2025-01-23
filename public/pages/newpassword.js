const ownprofile2 = document.querySelector('.pp');

const continuebtn=document.querySelector('.submit-btn')

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
})();

continuebtn.addEventListener('click',async(e)=>{
  e.preventDefault()

  const newPassword=document.querySelector('#new-password').value
  const cnewpass=document.querySelector('#confirm-password').value

  if(newPassword!=cnewpass){
    document.querySelector('#error-message').textContent='Please provide the same password'
    return 
  }

  try{

    const response=await fetch('http://localhost:5000/api/v1/changepassword',{
        method:'PUT',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({newPassword})
    })

    const data=response.json()
    if(response.status===200){
        alert('Password Updated Successfully')
        window.location.href="/pages/homepage.html"
    }
    else{
        document.querySelector('#error-message').textContent=data.msg
    }
  }
  catch(error){
    console.error(error)
    document.querySelector('#error-message').textContent='Internal server error!'
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