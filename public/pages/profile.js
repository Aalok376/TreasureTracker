const posthtml = document.querySelector('.containerforpost');
const ownprofile = document.querySelector('.containerforphoto');
const ownprofile2 = document.querySelector('.pp');

const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')

let UserIdForPost
let posts = []

const getProfilepic = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data];
        UserIdForPost = profiles[0].user._id

        ownprofile.innerHTML = profiles.map(profile => `
                <div class="coverphoto" style="background-image: url('http://localhost:5000/${profile.user?.coverPicture?.replace(/\\/g, '/')}')"></div>
                <div class="profilephoto" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></div>
                <div class="content">
                  <h2>${profile.user.fname} ${profile.user.lname}</h2>
                  <p id="error-otp" style="color:black;">Contact:${profile.user.contactNumber}</p>
                </div>
                <div class="edit">
                  <div class="addpost">
                    <span><i class="fa-solid fa-plus"></i></span>
                    <span>Add Post</span>
                  </div>
                  <div class="editprofile">
                    <span><i class="fa-solid fa-pencil"></i></span>
                    <span>Edit profile</span>
                  </div>
                </div>
        `).join('');

        ownprofile2.innerHTML = profiles.map(profile => `
            <div class="profile" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></div>
        `).join('');
    } catch (error) {
        console.error("Error fetching profile picture:", error);
    }
};

const getPost = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/getOwnPosts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        posts = Array.isArray(data.posts) ? data.posts : [];

        if (posts.length > 0) {
            posthtml.innerHTML = posts.map(post => `
                <div class="postcontainer" id=${post._id}>
                    <div class="identitycontainer">
                        <section class="hello">
                            <div class="profileimageforpost" data-user-id="${post.userId._id}"
                                        style="background-image: url('http://localhost:5000/${post.userId.profilePicture?.replace(/\\/g, '/')}')">
                            </div>
                            <span class="nameforpost">${post.userId.fname} ${post.userId.lname}</span>
                            <div id="date-container">
                                <span id="current-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </section>
                    <span class="spaceforthreedot">
                        <div class="threedot"><i class="fa-solid fa-ellipsis fa-2xl"></i></div>
                        <div class="threedot2"><i class="fa-solid fa-xmark"></i></div>
                    </span>
                    <div class="dropdownmenu2">
                        <li>
                            <div class="edit">Edit</div>
                        </li>
                        <li>
                            <div class="deletepost">Delete</div>
                        </li>
                        <li>
                            <div class="savepost">Save</div>
                        </li>
                    </div>
                
                </div>
                    <div class="areaforpost">
                        <div class="post-header">
                            <p class="post-caption">${post.caption || "No caption provided"}</p>
                            <span class="post-type">Type: ${post.type || "Unknown"}</span>
                        </div>
                        <div class="post-category">
                            <strong>Category:</strong> ${post.category || "Uncategorized"}
                        </div>
                        <div class="post-images">
                            ${(() => {
                    if (Array.isArray(post.image)) {
                        const imagesLength = post.image.length;

                        if (imagesLength === 1) {
                            return post.image
                                .map(
                                    (img) => `
                                        <div class="divforimage">
                                          <img 
                                            src="http://localhost:5000/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                            height="250" 
                                            width="250" 
                                          />
                                        </div>`
                                )
                                .join('');
                        }

                        if (imagesLength === 2) {
                            return post.image
                                .map(
                                    (img) => `
                                        <div class="divforimage">
                                          <img 
                                            src="http://localhost:5000/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                            height="250" 
                                            width="250" 
                                          />
                                        </div>`
                                )
                                .join('');
                        }

                        if (imagesLength === 3) {
                            return post.image
                                .map(
                                    (img) => `
                                        <div class="divforimage">
                                          <img 
                                            src="http://localhost:5000/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                            height="250" 
                                            width="250" 
                                          />
                                        </div>`
                                )
                                .join('');
                        }

                        if (imagesLength >= 4) {
                            return (
                                post.image
                                    .slice(0, 3)
                                    .map(
                                        (img) => `
                                          <div class="divforimage">
                                            <img 
                                              src="http://localhost:5000/${img.replace(/\\/g, '/')}" 
                                              alt="${post.caption || 'Image'}" 
                                              class="post-image" 
                                              height="250" 
                                              width="250" 
                                            />
                                          </div>`
                                    )
                                    .join('') +
                                `
                                    <div class="divforimage">
                                      <p id="moreimages" style="color:black;">+${imagesLength - 3}</p>
                                    </div>`
                            );
                        }
                    }

                    return '<p>No images available</p>';
                })()
                }                          
                        </div>
                    </div>
                    <hr class="custom-line1">
                    <div class="LikeArea" style="height:30px"></div>
                    <hr class="custom-line2">
                    <div class="likecontainer">
                        <button class="interactionlike1"><i class="fa-regular fa-heart"></i> Like</button>
                        <button class="interactionlike2"><i class="fa-solid fa-heart"style="color:black;"></i> Like</button>
                        <button class="interactioncomment"><i class="fa-regular fa-comment"></i> Comment</button>
                        <button class="interactionshare"><i class="fa-solid fa-share"></i> Share</button>
                    </div>
                    <div class="comment-container">
                        <div class="comment-area">
                           
                        </div>
                        <textarea class="comment-box" placeholder="Write a comment..."></textarea>
                        <button class="post-comment-btn">Post</button>
                    </div>
                </div>
            `).join('');
        } else {
            posthtml.innerHTML = "<p>No posts available</p>";
        }

    } catch (error) {
        console.error("Error fetching posts:", error);
        posthtml.innerHTML = "<p>Error fetching posts. Please try again later.</p>";
    }
    gotouserprofile(posthtml)
    updateLikeButtons(posts)
};

(async () => {
    await getProfilepic();
    await getPost();
})();


const commentbtn = document.querySelector('.containerforpost')

commentbtn.addEventListener('click', async (event) => {
    const postElement = event.target.closest('.postcontainer');
    if (!postElement) return;

    const postId = postElement.id;

    const commentSection = postElement.querySelector('.comment-container')

    const divforlike = postElement.querySelector('.LikeArea')

    if (event.target.classList.contains('interactionlike1')) {
        try {
            (async () => {
                const response = await fetch(`http://localhost:5000/api/v1/likeapost/${postId}`, {
                    method: "POST"
                })

                const data = await response.json()

                if (response.status === 200) {
                    event.target.style.display = 'none';
                    const likedButton = postElement.querySelector('.interactionlike2');
                    if (likedButton) {
                        likedButton.style.display = 'inline-block';
                    }

                    const datas = await getLikes(postId)

                    const likes = Array.isArray(datas.likes) ? datas.likes : [datas.likes]
                    const match = likes.find(like => like.userId._id === UserIdForPost)

                    updateLikeCount(likes, match, divforlike)
                }
            })()
        } catch (error) {
            console.error(error)
        }

    }
    else if (event.target.classList.contains('interactionlike2')) {

        try {
            (async () => {
                const response = await fetch(`http://localhost:5000/api/v1/removelike/${postId}`, {
                    method: "DELETE"
                })
                const data = await response.json()

                if (response.status === 200) {
                    event.target.style.display = 'none';

                    const likeButton = postElement.querySelector('.interactionlike1');
                    if (likeButton) {
                        likeButton.style.display = 'inline-block';
                    }

                    const datas = await getLikes(postId)

                    const likes = Array.isArray(datas.likes) ? datas.likes : [datas.likes]
                    const match = likes.find(like => like.userId._id === UserIdForPost)

                    updateLikeCount(likes, match, divforlike)
                }
            })()
        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.classList.contains('interactioncomment')) {
        const isVisible = commentSection.style.display === 'flex';

        const commentArea = postElement.querySelector('.comment-area')

        const submitbtn = postElement.querySelector('.post-comment-btn')
        const textt = postElement.querySelector('.comment-box')

        let OwnComments = []
        let OtherComments = []

        submitbtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const text = textt.value;
                const response = await fetch(`http://localhost:5000/api/v1/commentinpost/${postId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text }),
                }
                )

                if (response.status === 200) {
                    const datas = await fetchComments(postId)

                    var comments = Array.isArray(datas.comments) ? datas.comments : [datas.comments]

                    OwnComments = []
                    OtherComments = []
                    for (let i = 0; i < comments.length; i++) {
                        if (comments[i].userId._id === UserIdForPost) {
                            OwnComments.push(comments[i]);
                        } else {
                            OtherComments.push(comments[i]);
                        }
                    }

                    updateCommentSections(OwnComments, OtherComments, commentArea)

                    textt.value = ''

                }
                else {
                    console.error('Failed to create comment')
                }
            } catch (error) {
                console.log(error)
            }
        })
        try {

            const datas = await fetchComments(postId)

            var comments = Array.isArray(datas.comments) ? datas.comments : [datas.comments]

            for (let i = 0; i < comments.length; i++) {
                if (comments[i].userId._id === UserIdForPost) {
                    OwnComments.push(comments[i]);
                } else {
                    OtherComments.push(comments[i]);
                }
            }

            updateCommentSections(OwnComments, OtherComments, commentArea)

        }
        catch (error) {
            console.log(error)
        }
        gotoprofile(commentArea)

        if (isVisible) {
            commentSection.style.display = 'none';
            // event.target.textContent = 'Comment';
        } else {
            commentSection.style.display = 'flex';
            // event.target.textContent = 'Comment';
        }
    }
})

//Dynamically update LIkeArea Div..
const updateLikeCount = (likes, match, divforlike) => {
    if (likes.length === 0) {
        divforlike.textContent = '0 Likes'
    }
    else if (likes.length === 1) {
        if (match) {
            divforlike.textContent = `Liked by You`
        }
        else {
            divforlike.textContent = `Liked by ${likes[0].userId.fname}`
        }
    }
    else if (likes.length === 2) {
        if (match) {
            divforlike.textContent = `Liked by You and 1 Other`
        }
        else {
            divforlike.textContent = `Liked by ${likes[0].userId.fname} and 1 Other`
        }
    }
    else if (likes.length > 2) {
        if (match) {
            divforlike.textContent = `Liked by You and ${likes.length - 1} Other`
        }
        else {
            divforlike.textContent = `Liked by ${likes[0].userId.fname} and ${likes.length - 1} Other`
        }
    }
    else {
        console.log('Post not working')
    }
}

//Fetch total likes for a post
const getLikes = async (postId) => {

    try {
        const response = await fetch(`http://localhost:5000/api/v1/getalllike/${postId}`)
        const data = await response.json()

        if (response.status === 200) {
            return data
        }
    } catch (error) {
        console.error(error)
    }
}

//Controls like button in case of reload
const updateLikeButtons = async (posts) => {
    try {
        for (const post of posts) {
            const postElement = document.getElementById(post._id)

            const postId = post._id
            const datas = await getLikes(postId)

            const likes = Array.isArray(datas.likes) ? datas.likes : [datas.likes]
            const match = likes.find(like => like.userId._id === UserIdForPost)

            if (postElement) {
                const likeButton = postElement.querySelector('.interactionlike1')
                const likedButton = postElement.querySelector('.interactionlike2')

                const likedByUser = Array.isArray(post.isLikedByUser) ? post.isLikedByUser : []

                if (likedByUser.includes(UserIdForPost)) {
                    likeButton.style.display = 'none'
                    likedButton.style.display = 'inline-block'
                } else {
                    likeButton.style.display = 'inline-block'
                    likedButton.style.display = 'none'
                }
            }

            if (postElement) {
                const divforlike = postElement.querySelector('.LikeArea')

                if (likes.length === 0) {
                    divforlike.textContent = '0 Likes'
                }
                else if (likes.length === 1) {
                    if (match) {
                        divforlike.textContent = `Liked by You`
                    }
                    else {
                        divforlike.textContent = `Liked by ${likes[0].userId.fname}`
                    }
                }
                else if (likes.length === 2) {
                    if (match) {
                        divforlike.textContent = `Liked by You and 1 Other`
                    }
                    else {
                        divforlike.textContent = `Liked by ${likes[0].userId.fname} and 1 Other`
                    }
                }
                else if (likes.length > 2) {
                    if (match) {
                        divforlike.textContent = `Liked by You and ${likes.length - 1} Other`
                    }
                    else {
                        divforlike.textContent = `Liked by ${likes[0].userId.fname} and ${likes.length - 1} Other`
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading posts:', error)
    }
}

//To see all the likes...
const updateLikeAreaSection = () => {

}

//Comments....
const fetchComments = async (postId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/getallcomment/${postId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to fetch comments");
            return [];
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

const updateCommentSections = async (OwnComments, OtherComments, commentArea) => {
    if (OwnComments.length > 0 && OtherComments.length > 0) {
        return commentArea.innerHTML = OwnComments.map(comment => ` <div class="introareacomment">
                         <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                         <div class="commentsectionbypeople">
                             <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                             <span class="dropdownmenu">
                              
                             </span>
                             <p>${comment.text}</p>
                         </div>
                     </div>`).join('')
            +
            OtherComments.map(comment => ` <div class="introareacomment">
                        <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                        <div class="commentsectionbypeople">
                            <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <span class="dropdownmenu">
                             
                            </span>
                            <p>${comment.text}</p>
                        </div>
                    </div>`).join('')
    }
    else if (OwnComments.length > 0 && OtherComments.length === 0) {
        return commentArea.innerHTML = OwnComments.map(comment => ` <div class="introareacomment">
                         <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                         <div class="commentsectionbypeople">
                             <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                             <span class="dropdownmenu">
                              
                             </span>
                             <p>${comment.text}</p>
                         </div>
                     </div>`).join('')
    }
    else if (OwnComments.length === 0 && OtherComments.length > 0) {
        return commentArea.innerHTML = OtherComments.map(comment => ` <div class="introareacomment">
                             <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                             <div class="commentsectionbypeople">
                                 <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                                 <span class="dropdownmenu">
                                  
                                 </span>
                                 <p>${comment.text}</p>
                             </div>
                         </div>`).join('')
    }
    else {
        commentArea.innerHTML = `<p class="No-comments">No Comments</p>`
    }
}

const gotoprofile = (commentArea) => {
    if (commentArea) {
        commentArea.addEventListener('click', async (event) => {

            const profileImage = event.target.closest('.profileimageforpost');
            if (profileImage) {
                const userId = profileImage.getAttribute("data-user-id");
                window.location.href = `/api/v1/userprofile/${userId}`;
            }
        });
    }
}

const gotouserprofile = (posthtml) => {
    if (posthtml) {
        posthtml.addEventListener('click', async (event) => {

            const profileImage = event.target.closest('.profileimageforpost');
            if (profileImage) {
                const userId = profileImage.getAttribute("data-user-id");
                window.location.href = `/api/v1/userprofile/${userId}`;
            }
        });
    }
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

ownprofile.addEventListener('click', async (event) => {
    const addpost = event.target.closest('.addpost')
    const editprofile = event.target.closest('.editprofile')
    if (addpost) {
        window.location.href = "/pages/postpage.html"
    }
    else if (editprofile) {
        window.location.href = '/pages/editProfile.html'
    }
})

//Event listener for aside-menu

const home = document.querySelector('.homepage')
const message = document.querySelector('.Messagepage')
const friends = document.querySelector('.Friends')
const saved = document.querySelector('.SavedPosts')

home.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/homepage.html"
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


//For searching items

const searchInput = document.getElementById('text')

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const query1 = searchInput.value.trim()
        if (query1) {
            sessionStorage.setItem('query', query1)
            window.location.href = "/pages/searchedpost.html"
            searchInput.value = ''
        }
    }
})

//Dropdown menu for posts
posthtml.addEventListener('click', async (event) => {
    const postelement = event.target.closest('.postcontainer')

    const dropDownMenu2 = postelement.querySelector('.dropdownmenu2')
    const tooglebtnIcon2 = postelement.querySelector('.threedot2 i')
    const tooglebtnIcon = postelement.querySelector('.threedot i')

    if (event.target.closest('.threedot i')) {
        event.target.style.display = 'none'
        tooglebtnIcon2.style.display = 'inline-block'
        dropDownMenu2.style.display = 'block'
    }
    else if (event.target.closest('.threedot2 i')) {
        event.target.style.display = 'none'
        tooglebtnIcon.style.display = 'flex'
        dropDownMenu2.style.display = 'none'
    }
})

posthtml.addEventListener('click', async (event) => {
    const postElement = event.target.closest('.postcontainer')

    const postId = postElement.id

    if (event.target.closest('.edit')) {
        window.location.href = `/api/v1/editPost/${postId}`
    }
    else if (event.target.closest('.deletepost')) {
        try {
            (async () => {
                const response = await fetch(`http://localhost:5000/api/v1/deleteOwnPost/${postId}`, {
                    method: "DELETE"
                })
                const data = await response.json()

                if (response.status === 200) {
                  alert('Post deleted Successfully')
                  window.location.reload()
                }
            })()
        } catch (error) {
            console.error(error)
        }

    }
    else if (event.target.closest('.savepost')) {

    }
})


