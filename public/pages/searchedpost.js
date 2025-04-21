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

const searchQuery = sessionStorage.getItem('query')

//Comments
const getProfilepic = async () => {
    try {
        const response = await fetch("https://treasuretracker.onrender.com/api/v1/profile")
        const data = await response.json()

        const profiles = Array.isArray(data) ? data : [data]
        UserIdForPost = profiles[0].user._id

        ownprofile.innerHTML = profiles.map(profile => `
            <p class="extratext">Search result for</p>
            <p class="searchid"> ${searchQuery}</p>
        `).join('')

        ownprofile2.innerHTML = profiles.map(profile => `
            <a href="profile.html" class="profile" style="background-image: url('https://treasuretracker.onrender.com/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></a>
        `).join('')
    } catch (error) {
        console.error("Error fetching profile picture:", error)
    }
}

//Posts....
const getPost = async () => {
    try {
        const response = await fetch("https://treasuretracker.onrender.com/api/v1/getPosts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json()

        posts = []
        ownPosts = []
        otherPosts = []

        const totalposts = Array.isArray(data.posts) ? data.posts : []

        posts = searchItems(totalposts, searchQuery)

        for (let i = 0; i < posts.length; i++) {
            if (posts[i].userId._id === UserIdForPost) {
                ownPosts.push(posts[i]);
            } else {
                otherPosts.push(posts[i]);
            }
        }

        UpdatePosts(ownPosts, otherPosts)

    } catch (error) {
        console.error("Error fetching posts:", error);
        posthtml.innerHTML = "<p>Error fetching posts. Please try again later.</p>";
    }
    gotouserprofile(posthtml)
    updateLikeButtons(posts)
    updateSavedButton(posts)
}

const searchItems = (totalposts, searchQuery) => {
    const query = searchQuery.toLowerCase()

    return totalposts.filter(post =>
        post.category.toLowerCase().includes(query) ||
        post.caption.toLowerCase().includes(query)
    )
}

(async () => {
    await getProfilepic()
    await getPost()
})()

//Update Posts

const UpdatePosts = (ownPosts, otherPosts) => {
    if (ownPosts.length > 0 || otherPosts.length > 0) {
        posthtml.innerHTML = ownPosts.map(post => `
            <div class="postcontainer" id=${post._id}>
                <div class="identitycontainer">
                    <section class="hello">
                        <div class="profileimageforpost" data-user-id="${post.userId._id}"
                                    style="background-image: url('https://treasuretracker.onrender.com/${post.userId.profilePicture?.replace(/\\/g, '/')}')">
                        </div>
                        <span class="nameforpost">${post.userId.fname} ${post.userId.lname}</span>
                        <div id="date-container">
                            <span id="current-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </section>
                <span class="spaceforthreedot">
                    <div class="threedot"><i class="fa-solid fa-ellipsis fa-2xl"></i></div>
                    <div class="threedot2"><i class="fa-solid fa-xmark fa-2xl"></i></div>
                </span>
                <div class="dropdownmenu2">
                    <li>
                        <div class="edit"><i class="fa-solid fa-pen"></i> Edit</div>
                    </li>
                    <li>
                        <div class="deletepost"><i class="fa-solid fa-trash"></i> Delete</div>
                    </li>
                    <li>
                        <div class="savepost"><i class="fa-regular fa-bookmark"></i> Save</div>
                        <div class="savedpost" style="display: none;"><i class="fa-solid fa-bookmark"></i> Saved</div>
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
                                        <div class="divforimage1">
                                          <img 
                                            src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                    style="width: 100%; height: 400px; background-size: contain; background-position: center;"   
                                          />
                                        </div>`
                            )
                            .join('');
                    }

                    if (imagesLength === 2) {
                        return post.image
                            .map(
                                (img) => `
                                        <div class="divforimage2">
                                          <img 
                                            src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                         style="width: 100%; height: 400px; background-size: contain; background-position: center;"   
                                          />
                                        </div>`
                            )
                            .join('');
                    }

                    if (imagesLength === 3) {
                        return post.image
                            .map(
                                (img) => `
                                        <div class="divforimage3">
                                          <img 
                                            src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                          style="width: 100%; height: 300px; background-size: contain; background-position: center;"   
                                          />
                                        </div>`
                            )
                            .join('');
                    }

                    if (imagesLength === 4) {
                        return post.image
                            .map(
                                (img) => `
                                            <div class="divforimage4">
                                              <img 
                                                src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                                alt="${post.caption || 'Image'}" 
                                                class="post-image" 
                                          style="width: 100%; height: 300px; background-size: contain; background-position: center;"   
                                              />
                                            </div>`
                            )
                            .join('');
                    }

                    if (imagesLength >= 5) {
                        return (
                            post.image
                                .slice(0, 3)
                                .map(
                                    (img) => `
                                              <div class="divforimage4">
                                                <img 
                                                  src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                                  alt="${post.caption || 'Image'}" 
                                                  class="post-image" 
                                           style="width: 100%; height: 300px; background-size: contain; background-position: center;"   
                                                />
                                              </div>`
                                )
                                .join('') +
                            `
                                      <div class="divforimage4" style="background-image: url('https://treasuretracker.onrender.com/${post.image[3].replace(/\\/g, '/')}');">
                                      <p id="moreimages" style="color:black;">+${imagesLength - 4}</p>
                                      </div>
                                    `
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
                    <button class="interactionlike2"><i class="fa-solid fa-heart" style="color: red;"></i>Liked</button>
                    <button class="interactioncomment"><i class="fa-regular fa-comment"></i>Comment</button>
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
                        <div class="profileimageforpost" data-user-id="${post.userId._id}"
                                    style="background-image: url('https://treasuretracker.onrender.com/${post.userId.profilePicture?.replace(/\\/g, '/')}')">
                        </div>
                        <span class="nameforpost">${post.userId.fname} ${post.userId.lname}</span>
                        <div id="date-container">
                            <span id="current-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </section>
                    <span class="spaceforthreedot">
                        <div class="threedot"><i class="fa-solid fa-ellipsis fa-2xl"></i></div>
                        <div class="threedot2"><i class="fa-solid fa-xmark fa-2xl"></i></div>
                    </span>
                    <div class="dropdownmenu2">
                        <li>
                            <div class="savepost"><i class="fa-regular fa-bookmark"></i> Save</div>
                             <div class="savedpost" style="display: none;"><i class="fa-solid fa-bookmark"></i> Saved</div>
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
                                        <div class="divforimage1">
                                          <img 
                                            src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                    style="width: 100%; height: 400px; background-size: contain; background-position: center;"   
                                          />
                                        </div>`
                                )
                                .join('');
                        }

                        if (imagesLength === 2) {
                            return post.image
                                .map(
                                    (img) => `
                                        <div class="divforimage2">
                                          <img 
                                            src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                         style="width: 100%; height: 400px; background-size: contain; background-position: center;"   
                                          />
                                        </div>`
                                )
                                .join('');
                        }

                        if (imagesLength === 3) {
                            return post.image
                                .map(
                                    (img) => `
                                        <div class="divforimage3">
                                          <img 
                                            src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                            alt="${post.caption || 'Image'}" 
                                            class="post-image" 
                                          style="width: 100%; height: 300px; background-size: contain; background-position: center;"   
                                          />
                                        </div>`
                                )
                                .join('');
                        }

                        if (imagesLength === 4) {
                            return post.image
                                .map(
                                    (img) => `
                                            <div class="divforimage4">
                                              <img 
                                                src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                                alt="${post.caption || 'Image'}" 
                                                class="post-image" 
                                          style="width: 100%; height: 300px; background-size: contain; background-position: center;"   
                                              />
                                            </div>`
                                )
                                .join('');
                        }

                        if (imagesLength >= 5) {
                            return (
                                post.image
                                    .slice(0, 3)
                                    .map(
                                        (img) => `
                                              <div class="divforimage4">
                                                <img 
                                                  src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
                                                  alt="${post.caption || 'Image'}" 
                                                  class="post-image" 
                                           style="width: 100%; height: 300px; background-size: contain; background-position: center;"   
                                                />
                                              </div>`
                                    )
                                    .join('') +
                                `
                                      <div class="divforimage4" style="background-image: url('https://treasuretracker.onrender.com/${post.image[3].replace(/\\/g, '/')}');">
                                      <p id="moreimages" style="color:black;">+${imagesLength - 4}</p>
                                      </div>
                                    `
                            );
                        }
                    }

                    return '<p>No images available</p>';
                })()
                }            
                    </div>
                </div>
                <hr class="custom-line1">
                <div class="LikeArea" style="height:30px;"></div>
                <hr class="custom-line2">
                
                <div class="likecontainer">
                    <button class="interactionlike1"><i class="fa-regular fa-heart"></i>Like</button>
                    <button class="interactionlike2"><i class="fa-solid fa-heart"style="color: red;"></i>Liked</button>
                    <button class="interactioncomment"><i class="fa-regular fa-comment"></i>Comment</button>
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
}

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
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/likeapost/${postId}`, {
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

                    const response = await fetch(`https://treasuretracker.onrender.com/api/v1/createNotification`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ type: 'liked', postId }),
                    })
                }
            })()
        } catch (error) {
            console.error(error)
        }

    }
    else if (event.target.classList.contains('interactionlike2')) {

        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/removelike/${postId}`, {
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

                    const response = await fetch(`https://treasuretracker.onrender.com/api/v1/deletenotificationforremoval`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ type: 'liked', postId }),
                    })

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
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/commentinpost/${postId}`, {
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
                    const response = await fetch(`https://treasuretracker.onrender.com/api/v1/createNotification`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ type: 'commented on', postId }),
                    })

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
            editComment(OwnComments, OtherCommentsOnOwnPost, OtherCommentsOnOtherPost, commentArea, postId)

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
        const response = await fetch(`https://treasuretracker.onrender.com/api/v1/getallcomment/${postId}`);
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

//Update comment section 
const updateCommentSections = async (OwnComments, OtherCommentsOnOwnPost, OtherCommentsOnOtherPost, commentArea) => {
    if (OwnComments.length > 0 && OtherCommentsOnOwnPost.length === 0 && OtherCommentsOnOtherPost.length === 0) {
        return commentArea.innerHTML = OwnComments.map(comment => ` <div class="introareacomment" id="${comment._id}">
                       <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
                            <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
                                <li>
                                    <div class="cedit"><i class="fa-solid fa-pen"></i> Edit</div>
                                </li>
                                <li>
                                    <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                                </li>
                            </div>
                    </div>`).join('')
    }
    else if (OwnComments.length > 0 && OtherCommentsOnOwnPost.length > 0 && OtherCommentsOnOtherPost.length === 0) {
        return commentArea.innerHTML = OwnComments.map(comment => `<div class="introareacomment" id="${comment._id}">
              <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
                            <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
                                <li>
                                    <div class="cedit"><i class="fa-solid fa-pen"></i> Edit</div>
                                </li>
                                <li>
                                    <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                                </li>
                            </div>
        </div>`).join('')
            +
            OtherCommentsOnOwnPost.map(comment => `<div class="introareacomment" id="${comment._id}">
            <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
                            <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
                            
                                <li>
                                    <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                                </li>
                            </div>
        </div>`).join('')
    }
    else if (OwnComments.length > 0 && OtherCommentsOnOwnPost.length > 0 && OtherCommentsOnOtherPost.length > 0) {
        return commentArea.innerHTML = OwnComments.map(comment => `<div class="introareacomment" id="${comment._id}">
            <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
                            <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
                                <li>
                                    <div class="cedit"><i class="fa-solid fa-pen"></i> Edit</div>
                                </li>
                                <li>
                                    <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                                </li>
                            </div>
        </div>`).join('')
            +
            OtherCommentsOnOwnPost.map(comment => `<div class="introareacomment" id="${comment._id}">
            <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
                            <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
                               
                                <li>
                                    <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                                </li>
                            </div>
        </div>`).join('')
            +
            OtherCommentsOnOtherPost.map(comment => `<div class="introareacomment" id="${comment._id}">
             <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
        </div>`).join('')
    }
    else if (OwnComments.length === 0 && OtherCommentsOnOwnPost.length > 0 && OtherCommentsOnOtherPost.length === 0) {
        return commentArea.innerHTML = OtherCommentsOnOwnPost.map(comment => `<div class="introareacomment" id="${comment._id}">
           <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
                            <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
                                <li>
                                    <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                                </li>
                            </div>
        </div>`).join('')
    }
    else if (OwnComments.length === 0 && OtherCommentsOnOwnPost.length > 0 && OtherCommentsOnOtherPost.length > 0) {
        return commentArea.innerHTML = OtherCommentsOnOwnPost.map(comment => `<div class="introareacomment" id="${comment._id}">
            <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
                            <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
    
                                <li>
                                    <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                                </li>
                            </div>
        </div>`).join('')
            +
            OtherCommentsOnOtherPost.map(comment => `<div class="introareacomment" id="${comment._id}">
             <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
        </div>`).join('')
    }
    else if (OwnComments.length === 0 && OtherCommentsOnOwnPost.length === 0 && OtherCommentsOnOtherPost.length > 0) {
        return commentArea.innerHTML = OtherCommentsOnOtherPost.map(comment => `<div class="introareacomment" id="${comment._id}">
             <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
        </div>`).join('')

    }
    else if (OwnComments.length > 0 && OtherCommentsOnOwnPost.length === 0 && OtherCommentsOnOtherPost.length > 0) {
        return commentArea.innerHTML = OwnComments.map(comment => `<div class="introareacomment" id="${comment._id}">
            <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
                            <span class="cspaceforthreedot">
                                    <div class="cthreedot"><i class="fa-solid fa-ellipsis"></i></div>
                                    <div class="cthreedot2"><i class="fa-solid fa-xmark"></i></div>
                            </span>
                            <div class="dropdownmenu">
                                <li>
                                    <div class="cedit"><i class="fa-solid fa-pen"></i> Edit</div>
                                </li>
                                <li>
                                    <div class="cdelete"><i class="fa-solid fa-trash"></i> Delete</div>
                                </li>
                            </div>
        </div>`).join('')
            +
            OtherCommentsOnOtherPost.map(comment => `<div class="introareacomment" id="${comment._id}">
             <div class="sectionforprofile"> <div class="profileimageforpost" data-user-id="${comment.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${comment.userId.profilePicture?.replace(/\\/g, '/')}')"></div>

                            <div class="placeforcommentandname"><p class="nameincommentarea">${comment.userId.fname} ${comment.userId.lname}</p>
                            <p class="comment-text">${comment.text}</p>
                            </div>
                            </div>
        </div>`).join('')
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
                const userId = profileImage.getAttribute("data-user-id")
                window.location.href = `/api/v1/userprofile/${userId}`
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

        const response = await fetch('https://treasuretracker.onrender.com/api/v1/logout')

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
        const response = await fetch(`https://treasuretracker.onrender.com/api/v1/getalllike/${postId}`)
        const data = await response.json()

        if (response.status === 200) {
            return data
        }
    } catch (error) {
        console.error(error)
    }
}

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
                divforlike.addEventListener('click', async (e) => {
                    e.preventDefault()

                    const modal = document.querySelector(".modal1")
                    modal.showModal()
                    document.body.style.overflow = 'hidden'

                    const closeButton = document.querySelector(".closebutton1")
                    const divareaforlike = document.querySelector(".divareaforlike")

                    modal.addEventListener('click', async (e) => {
                        e.preventDefault()
                        if (e.target === modal) {
                            modal.close()
                            document.body.style.overflow = ''
                        }
                    })
                    closeButton.addEventListener("click", () => {
                        modal.close()
                        document.body.style.overflow = ''
                    })

                    console.log(likes)
                    updateLikeAreaSection(postId, divareaforlike)
                    gotoprofile(divareaforlike)
                })
            }
        }
    } catch (error) {
        console.error('Error loading posts:', error)
    }
}

//To see all the likes...
const updateLikeAreaSection = async(postId, divareaforlike) => {

    const datas = await getLikes(postId)

    const likes = Array.isArray(datas.likes) ? datas.likes : [datas.likes]
    if (likes.length > 0) {
        return divareaforlike.innerHTML = likes.map(like => `<div class="introarealike" id="${like._id}">
            <div class="sectionforprofileinlike"> <div class="profileimageforpost" data-user-id="${like.userId._id}" style="background-image: url('https://treasuretracker.onrender.com/${like.userId.profilePicture?.replace(/\\/g, '/')}')"></div>
            <div class="placeforlikeandname"><p class="nameinlikearea">${like.userId.fname} ${like.userId.lname}</p></div>
        </div>`
        ).join('')
    }
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

//Event listener for aside-menu

const home = document.querySelector('.homepage')
const message = document.querySelector('.Messagepage')
const friends = document.querySelector('.Friends')
const saved = document.querySelector('.SavedPosts')
const notification = document.querySelector('.Notifications')

home.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/homepage.html"
})
message.addEventListener('click',async(e)=>{
    e.preventDefault()

    window.location.href="/pages/messagehomepage.html"
})

friends.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "/pages/friends.html"
})

saved.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "savedPosts.html"
})

notification.addEventListener('click', async (e) => {
    e.preventDefault()

    window.location.href = "notification.html"
})


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
    const savebtn = postElement.querySelector('.savepost')
    const savedbtn = postElement.querySelector('.savedpost')

    const postId = postElement.id

    if (event.target.closest('.edit')) {
        window.location.href = `/api/v1/editPost/${postId}`
    }
    else if (event.target.closest('.deletepost')) {
        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/deleteOwnPost/${postId}`, {
                    method: "DELETE"
                })
                const data = await response.json()

                if (response.status === 200) {
                    alert('Post deleted Successfully')
                    await getPost()
                }
            })()
        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.savepost')) {
        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/savePosts/${postId}`, {
                    method: "POST"
                })
                const data = await response.json()

                if (response.status === 200) {
                    event.target.closest('.savepost').style.display = 'none'
                    savedbtn.style.display = 'flex'
                }
            })()

        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.savedpost')) {

        try {
            (async () => {
                const response = await fetch(`https://treasuretracker.onrender.com/api/v1/unsavePosts/${postId}`, {
                    method: "DELETE"
                })
                const data = await response.json()

                if (response.status === 200) {
                    event.target.closest('.savedpost').style.display = 'none'
                    savebtn.style.display = 'flex'
                }
            })()

        } catch (error) {
            console.error(error)
        }
    }
    else if (event.target.closest('.divforimage1') || event.target.closest('.divforimage2') || event.target.closest('.divforimage3') || event.target.closest('.divforimage4')) {

        const specificPost = posts.filter(post => post._id === postId)
        const Images = specificPost[0].image

        const modal3 = document.querySelector(".modal3")
        const closeButton3 = document.querySelector(".closebutton3")
        const tobemapped = document.querySelector('.divareafornotification')

     
        tobemapped.innerHTML = Images.map((img) => `
        <div class="imageone">
        <img 
            src="https://treasuretracker.onrender.com/${img.replace(/\\/g, '/')}" 
            alt="'Image'" 
            class="post-image" 
            style="width: 100%; height: 300px; border:3px solid black; background-size: contain; background-position: center;"   
            /></div>
        `)
        modal3.showModal()
        document.body.style.overflow = 'hidden'

        modal3.addEventListener('click', async (e) => {
            e.preventDefault()
            if (e.target === modal3) {
                modal3.close()
                document.body.style.overflow = ''
            }
        })

        closeButton3.addEventListener("click", () => {
            modal3.close()
            document.body.style.overflow = ''
        })
    }
})

const updateSavedButton = async (posts) => {
    try {
        for (const post of posts) {
            const postElement = document.getElementById(post._id)

            if (postElement) {
                const saveButton = postElement.querySelector('.savepost')
                const savedButton = postElement.querySelector('.savedpost')

                const SavedByUser = Array.isArray(post.isSavedByUser) ? post.isSavedByUser : []

                if (SavedByUser.includes(UserIdForPost)) {
                    saveButton.style.display = 'none'
                    savedButton.style.display = 'flex'
                } else {
                    saveButton.style.display = 'flex'
                    savedButton.style.display = 'none'
                }
            }
        }
    } catch (error) {
        console.error('Error loading posts:', error)
    }
}

//Dropdown menu for comments
const editComment = async (OwnComments, OtherCommentsOnOwnPost, OtherCommentsOnOtherPost, commentArea, postId) => {

    commentArea.addEventListener('click', async (event) => {

        const specificComment = event.target.closest('.introareacomment')

        const commentId = specificComment.getAttribute('Id')

        const dropDownMenu = specificComment.querySelector('.dropdownmenu')
        const ctooglebtnIcon2 = specificComment.querySelector('.cthreedot2 i')
        const ctooglebtnIcon = specificComment.querySelector('.cthreedot i')
        const commentTextElement = specificComment.querySelector('.comment-text')

        if (event.target.closest('.cthreedot i')) {
            event.target.style.display = 'none'
            ctooglebtnIcon2.style.display = 'inline-block'
            dropDownMenu.style.display = 'block'
        }
        else if (event.target.closest('.cthreedot2 i')) {
            event.target.style.display = 'none'
            ctooglebtnIcon.style.display = 'flex'
            dropDownMenu.style.display = 'none'
        }
        else if (event.target.closest('.cdelete')) {
            try {
                (async () => {
                    const response = await fetch(`https://treasuretracker.onrender.com/api/v1/removecomment/${commentId}`, {
                        method: "DELETE"
                    })
                    const data = await response.json()

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
                                OtherCommentsOnOwnPost.push(comment)
                            } else {
                                OtherCommentsOnOtherPost.push(comment)
                            }
                        })

                        updateCommentSections(OwnComments, OtherCommentsOnOwnPost, OtherCommentsOnOtherPost, commentArea)
                    }
                })()
            } catch (error) {
                console.error(error)
            }
        }
        else if (event.target.closest('.cedit')) {
            const input = document.createElement('input')
            input.type = 'text'
            input.className = 'edit-input'
            input.value = commentTextElement.innerText.trim()

            commentTextElement.replaceWith(input)
            input.focus()

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {

                    const text = input.value
                    try {
                        (async () => {
                            const response = await fetch(`https://treasuretracker.onrender.com/api/v1/updatecomment/${commentId}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ text }),
                            })
                            const data = await response.json()

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
                                        OtherCommentsOnOwnPost.push(comment)
                                    } else {
                                        OtherCommentsOnOtherPost.push(comment)
                                    }
                                })

                                updateCommentSections(OwnComments, OtherCommentsOnOwnPost, OtherCommentsOnOtherPost, commentArea)
                            }
                        })()
                    } catch (error) {
                        console.error(error)
                    }
                }
            })
        }
    })
}