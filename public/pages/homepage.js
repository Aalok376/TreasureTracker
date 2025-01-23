const posthtml = document.querySelector('.containerforpost');
const ownprofile = document.querySelector('.containerforphoto');
const ownprofile2 = document.querySelector('.pp');

const changepasswordbtn = document.querySelector('.cgp')
const deleteUser = document.querySelector('.dlu')
const logoutUser = document.querySelector('.lgu')

let UserIdForPost
let ownPosts = []
let otherPosts = []

let posts = []

//Comments
const getProfilepic = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile")
        const data = await response.json()

        const profiles = Array.isArray(data) ? data : [data]
        UserIdForPost = profiles[0].user._id

        ownprofile.innerHTML = profiles.map(profile => `
            <a class="profile two" href="profile.html" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
            <a class="text" href="postpage.html">What have you Lost or Found?</a>
        `).join('')

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('')
    } catch (error) {
        console.error("Error fetching profile picture:", error)
    }
};

//Posts....
const getPost = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/getPosts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json()
        posts = Array.isArray(data.posts) ? data.posts : []

        for (let i = 0; i < posts.length; i++) {
            if (posts[i].userId._id === UserIdForPost) {
                ownPosts.push(posts[i]);
            } else {
                otherPosts.push(posts[i]);
            }
        }

        if (ownPosts.length > 0 || otherPosts.length > 0) {
            posthtml.innerHTML = ownPosts.map(post => `
                <div class="postcontainer" id=${post._id}>
                    <div class="identitycontainer">
                   <section class="hello">
                                           <div class="profileimageforpost" data-user-id="${post.userId._id}"style="background-image: url('http://localhost:5000/${post.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                        <span class="nameforpost">${post.userId.fname} ${post.userId.lname}</span>
                        <div id="date-container">
                            <span id="current-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                   </section>
                        <span class="dropdownmenu2">
                             <span><i class="fa-solid fa-ellipsis fa-2xl"></i><span>
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
                        <button class="interactionlike1"><i class="fa-regular fa-heart"></i>Like</button>
                        <button class="interactionlike2"><i class="fa-solid fa-heart"style="color:black;"></i>Like</button>
                        <button class="interactioncomment"><i class="fa-regular fa-comment"></i>Comment</button>
                        <button class="interactionshare"><i class="fa-solid fa-share"></i>Share</button>
                    </div>
                    <div class="comment-container">
                        <div class="comment-area">
                           
                        </div>
                        <textarea class="comment-box" placeholder="Write a comment..."></textarea>
                        <button class="post-comment-btn">Post</button>
                    </div>
                </div>
            `).join('')
                +
                otherPosts.map(post => `
                <div class="postcontainer" id=${post._id}>
                    <div class="identitycontainer">
                                          <section class="hello">
                                           <div class="profileimageforpost" data-user-id="${post.userId._id}"style="background-image: url('http://localhost:5000/${post.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
                        <span class="nameforpost">${post.userId.fname} ${post.userId.lname}</span>
                        <div id="date-container">
                            <span id="current-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                   </section>
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
                        <button class="interactionlike1"><i class="fa-regular fa-heart"></i>Like</button>
                        <button class="interactionlike2"><i class="fa-solid fa-heart"style="color:black;"></i>Like</button>
                        <button class="interactioncomment"><i class="fa-regular fa-comment"></i>Comment</button>
                        <button class="interactionshare"><i class="fa-solid fa-share"></i>Share</button>
                    </div>
                    <div class="comment-container">
                        <div class="comment-area">
                           
                        </div>
                        <textarea class="comment-box" placeholder="Write a comment..."></textarea>
                        <button class="post-comment-btn">Post</button>
                    </div>
                </div>
            `).join('')
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
})()


//Comments and like
const commentbtn = document.querySelector('.containerforpost')

commentbtn.addEventListener('click', async (event) => {
    const postElement = event.target.closest('.postcontainer')
    if (!postElement) return
    const postId = postElement.id

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

                    updateLikeCount(likes, divforlike)
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

                    updateLikeCount(likes, divforlike)
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
        let OtherCommentsOnOwnPost = []
        let OtherCommentsOnOtherPost = []

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

                    const comments = Array.isArray(datas.comments) ? datas.comments : [datas.comments]

                    OwnComments = []
                    OtherComments = []
                    OtherCommentsOnOwnPost = []
                    OtherCommentsOnOtherPost = []
                    for (let i = 0; i < comments.length; i++) {
                        if (comments[i].userId._id === UserIdForPost) {
                            OwnComments.push(comments[i]);
                        } else {
                            OtherComments.push(comments[i]);
                        }
                    }

                    const FilteredOwnPost = ownPosts.filter(post => post._id === postId)

                    OtherComments.forEach(comment => {
                        if (FilteredOwnPost.length > 0 && FilteredOwnPost._id === comment.postId._id) {
                            OtherCommentsOnOwnPost.push(comment);
                        } else {
                            OtherCommentsOnOtherPost.push(comment);
                        }
                    })

                    updateCommentSections(OwnComments, OtherCommentsOnOwnPost, OtherCommentsOnOtherPost, commentArea)

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

            const FilteredOwnPost = ownPosts.filter(post => post._id === postId)

            OtherComments.forEach(comment => {
                if (FilteredOwnPost.length > 0 && FilteredOwnPost._id === comment.postId._id) {
                    OtherCommentsOnOwnPost.push(comment);
                } else {
                    OtherCommentsOnOtherPost.push(comment);
                }
            })

            updateCommentSections(OwnComments, OtherCommentsOnOwnPost, OtherCommentsOnOtherPost, commentArea)

        }
        catch (error) {
            console.log(error)
        }

        gotoprofile(commentArea)

        if (isVisible) {
            commentSection.style.display = 'none';

        } else {
            commentSection.style.display = 'flex';

        }
    }
})

//Fetch all comments of a post
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

//Dynamically update LIkeArea Div..
const updateLikeCount = (likes, divforlike) => {
    if (likes.length === 0) {
        divforlike.textContent = '0 Likes';
    } else if (likes.length === 1) {
        divforlike.textContent = `Liked by ${likes[0].userId.fname}`;
    } else if (likes.length > 1) {
        divforlike.textContent = `Liked by ${likes[0].userId.fname} and others`;
    }
    else {
        console.log('Post not working')
    }
}

//Update comment section 
const updateCommentSections = async (OwnComments, OtherCommentsOnOwnPost, OtherCommentsOnOtherPost, commentArea) => {
    if (OwnComments.length > 0 && OtherCommentsOnOwnPost.length === 0 && OtherCommentsOnOtherPost.length === 0) {
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
    else if (OwnComments.length > 0 && OtherCommentsOnOwnPost.length > 0 && OtherCommentsOnOtherPost.length === 0) {
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
            OtherCommentsOnOwnPost.map(comment => ` <div class="introareacomment">
            <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
            <div class="commentsectionbypeople">
                <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                <span class="dropdownmenu">
                             
                </span>
                <p>${comment.text}</p>
            </div>
        </div>`)
    }
    else if (OwnComments.length > 0 && OtherCommentsOnOwnPost.length > 0 && OtherCommentsOnOtherPost.length > 0) {
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
            OtherCommentsOnOwnPost.map(comment => ` <div class="introareacomment">
            <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
            <div class="commentsectionbypeople">
                <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                <span class="dropdownmenu">
                             
                </span>
                <p>${comment.text}</p>
            </div>
        </div>`)
            +
            OtherCommentsOnOtherPost.map(comment => ` <div class="introareacomment">
            <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
            <div class="commentsectionbypeople">
                <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                <p>${comment.text}</p>
            </div>
        </div>`)
    }
    else if (OwnComments.length === 0 && OtherCommentsOnOwnPost.length > 0 && OtherCommentsOnOtherPost.length === 0) {
        return commentArea.innerHTML = OtherCommentsOnOwnPost.map(comment => ` <div class="introareacomment">
            <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
            <div class="commentsectionbypeople">
                <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                <span class="dropdownmenu">
                             
                </span>
                <p>${comment.text}</p>
            </div>
        </div>`)
    }
    else if (OwnComments.length === 0 && OtherCommentsOnOwnPost.length > 0 && OtherCommentsOnOtherPost.length > 0) {
        return commentArea.innerHTML = OtherCommentsOnOwnPost.map(comment => ` <div class="introareacomment">
            <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
            <div class="commentsectionbypeople">
                <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                <span class="dropdownmenu">
                             
                </span>
                <p>${comment.text}</p>
            </div>
        </div>`)
            +
            OtherCommentsOnOtherPost.map(comment => ` <div class="introareacomment">
            <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
            <div class="commentsectionbypeople">
                <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                <p>${comment.text}</p>
            </div>
        </div>`)
    }
    else if (OwnComments.length === 0 && OtherCommentsOnOwnPost.length === 0 && OtherCommentsOnOtherPost.length > 0) {
        return commentArea.innerHTML = OtherCommentsOnOtherPost.map(comment => ` <div class="introareacomment">
            <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('http://localhost:5000/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
            <div class="commentsectionbypeople">
                <p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                <p>${comment.text}</p>
            </div>
        </div>`)

    }
    else if (OwnComments.length > 0 && OtherCommentsOnOwnPost.length === 0 && OtherCommentsOnOtherPost.length > 0) {
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
            OtherCommentsOnOtherPost.map(comment => ` <div class="introareacomment">
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

//fetching other profile from comment section
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

//For going to other profile through post
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

//event for change password btn
changepasswordbtn.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/changepassword.html"
})

//event for delete btn
deleteUser.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/delete.html"
})

//Event for logout btn
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

const sideBar = document.querySelector('.sidemenu')
const hideSidebar = () => {
    sideBar.classList.add('disappear')
    sideBar.classList.remove('appear')
}
const openSidebar = () => {
    sideBar.classList.add('appear')
    sideBar.classList.remove('disappear')
}
