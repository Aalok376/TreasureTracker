const btn = document.querySelector('.btn')

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const caption = document.querySelector('.pcaption').value
    const type = document.querySelector('.ptype').value
    const category = document.querySelector('.pcategory').value
    const images = document.querySelector('.upimages').files

    const formData=new FormData()
    
    formData.append('type',type)
    formData.append('caption',caption)
    formData.append('category',category)

    for(let i=0;i<images.length;i++)
    {
        formData.append('images',images[i])
    }

    try {
        const response = await fetch('http://localhost:5000/api/v1/createpost', {
            method: 'POST',
            headers: {},
            body: formData
        })

        const result = await response.json()
        alert(result.msg)
    }
    catch (error) {
        console.log(error)
        alert('Error creating post')
    }
})