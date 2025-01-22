const posthtml = document.querySelector('.containerforpost');
const ownprofile = document.querySelector('.containerforphoto');
const ownprofile2 = document.querySelector('.pp');

const userId = window.location.pathname.split('/').pop();

const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')

let UserIdForPost
let posts = []

const getotherProfilepic = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/getotherprofile/${userId}`);
        const data = await response.json();

        profiles = Array.isArray(data) ? data : [data];

        ownprofile.innerHTML = profiles.map(profile => `
                <div class="coverphoto" style="background-image: url('http://localhost:5000/${profile.user?.coverPicture?.replace(/\\/g, '/')}')"></div>
                <div class="profilephoto" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></div>
                <div class="content">
                  <h2>${profile.user.fname} ${profile.user.lname}</h2>
                </div>
                <div class="edit">
                  <div class="addfriend">
                    <span><i class="fa-solid fa-plus"></i></span>
                    <span>Add Friend</span>
                  </div>
                  <div class="message">
                    <span><i class="fa-solid fa-message"></i></span>
                    <span>Message</span>
                  </div>
                </div>
        `).join('');

    } catch (error) {
        console.error("Error fetching profile picture:", error);
    }
};

const ownProfile = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data];

        UserIdForPost = profiles[0].user._id

        ownprofile2.innerHTML = profiles.map(profile => `
            <div class="profile" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></div>
        `).join('');
    } catch (error) {
        console.error(error)
    }
}

const getPost = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/v1//getotherposts/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        const posts = Array.isArray(data.posts) ? data.posts : [];

        if (posts.length > 0) {
            posthtml.innerHTML = posts.map(post => `
                <div class="postcontainer" id=${post._id}>
                    <div class="identitycontainer">
                         <div class="profileimageforpost" data-user-id="${post.userId._id}"style="background-image: url('http://localhost:5000/${post.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                        <span class="nameforpost">${post.userId.fname} ${post.userId.lname}</span>
                        <div id="date-container">
                            <span id="current-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span class="dropdownmenu">
                             
                        </span>
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
    await getotherProfilepic();
    await getPost();
    await ownProfile();
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
        
                    updateLikeCount(likes,divforlike)
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
        
                    updateLikeCount(likes,divforlike)
                }
            })()
        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.classList.contains('interactioncomment')) {
        const isVisible = commentSection.style.display === 'flex'

        const commentArea = postElement.querySelector('.comment-area')

        const submitbtn = postElement.querySelector('.post-comment-btn')
        const textt = postElement.querySelector('.comment-box')

        let OwnComments = []
        let OtherComments = []

        submitbtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const text = textt.value;
                const response = await fetch(`http://localhost:5000/api/v1//commentinpost/${postId}`, {
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

                    updateCommentSections(OwnComments,OtherComments,commentArea)

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

            const comments = Array.isArray(datas.comments) ? datas.comments : [datas.comments]
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].userId._id === UserIdForPost) {
                    OwnComments.push(comments[i]);
                } else {
                    OtherComments.push(comments[i]);
                }
            }

            updateCommentSections(OwnComments,OtherComments,commentArea)

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
const updateLikeCount=(likes,divforlike)=> {
    if (likes.length === 0) {
        divforlike.textContent = '0 Likes';
    } else if (likes.length === 1) {
        divforlike.textContent = `Liked by ${likes[0].userId.fname}`;
    } else if (likes.length > 1) {
        divforlike.textContent = `Liked by ${likes[0].userId.fname} and others`;
    }
    else{
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

            if (postElement) {
                const likeButton = postElement.querySelector('.interactionlike1')
                const likedButton = postElement.querySelector('.interactionlike2')

                if (post.isLikedByUser===UserIdForPost) {
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
                    divforlike.textContent = `Liked by ${likes[0].userId.fname}`
                }
                else if (likes.length > 1) {
                    divforlike.textContent = `Liked by ${likes[0].userId.fname} and others`
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

//Comments
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

const updateCommentSections = async (OwnComments,OtherComments, commentArea) => {
    if (OwnComments.length > 0 && OtherComments.length>0) {
        return commentArea.innerHTML = OwnComments.map(comment => ` <div class="introareacomment">
                         <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                         <div class="commentsectionbypeople">
                             <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                             <span class="dropdownmenu">
                              
                             </span>
                             <p>${comment.text}</p>
                         </div>
                     </div>`)
                     +
                     OtherComments.map(comment => ` <div class="introareacomment">
                        <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                        <div class="commentsectionbypeople">
                            <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p>${comment.text}</p>
                        </div>
                    </div>`)
     }
     else if (OwnComments.length > 0 && OtherComments.length===0) {
        return commentArea.innerHTML = OwnComments.map(comment => ` <div class="introareacomment">
                         <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                         <div class="commentsectionbypeople">
                             <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                             <span class="dropdownmenu">
                              
                             </span>
                             <p>${comment.text}</p>
                         </div>
                     </div>`)
        }
        else if (OwnComments.length === 0 && OtherComments.length>0) {
            return commentArea.innerHTML = OtherComments.map(comment => ` <div class="introareacomment">
                             <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                             <div class="commentsectionbypeople">
                                 <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                                 <p>${comment.text}</p>
                             </div>
                         </div>`)
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

ownprofile2.addEventListener('click', async (event) => {
    const ppbtn = event.target.closest('.profile')
    if (ppbtn) {
        window.location.href = "/pages/profile.html"
    }
})

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

document.querySelector('.HomeBtn').addEventListener('click',async(e)=>{
    e.preventDefault()

    window.location.href='/pages/homepage.html'
}
)

