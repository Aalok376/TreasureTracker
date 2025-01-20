const posthtml = document.querySelector('.containerforpost');
const ownprofile = document.querySelector('.containerforphoto');
const ownprofile2 = document.querySelector('.pp');


const getProfilepic = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/profile");
        const data = await response.json();

        const profiles = Array.isArray(data) ? data : [data];

        ownprofile.innerHTML = profiles.map(profile => `
                <div class="coverphoto" style="background-image: url('http://localhost:5000/${profile.user?.coverPicture?.replace(/\\/g, '/')}')"></div>
                <div class="profilephoto" style="background-image: url('http://localhost:5000/${profile.user?.profilePicture?.replace(/\\/g, '/')}')"></div>
                <div class="content">
                  <h2>${profile.user.fname} ${profile.user.lname}</h2>
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
                            ${Array.isArray(post.image) && post.image.length > 0
                    ? post.image.map(img => `
                                    <img 
                                        src="http://localhost:5000/${img.replace(/\\/g, '/')}" 
                                        alt="${post.caption || 'Image'}" 
                                        class="post-image" 
                                        height="100" 
                                        width="100" 
                                    />`).join('')
                    : "<p>No images available</p>"
                }
                        </div>
                    </div>
                    <hr class="custom-line1">
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
};

(async () => {
    await getProfilepic();
    await getPost();
})();


const commentbtn = document.querySelector('.containerforpost')

commentbtn.addEventListener('click', async (event) => {
    const postElement = event.target.closest('.postcontainer');
    if (!postElement) return;

    const commentSection = postElement.querySelector('.comment-container')

    if (event.target.classList.contains('interactionlike1')) {

        event.target.style.display = 'none';
        const likedButton = postElement.querySelector('.interactionlike2');
        if (likedButton) {
            likedButton.style.display = 'inline-block';
        }
    }
    else if (event.target.classList.contains('interactionlike2')) {
        event.target.style.display = 'none';

        const likeButton = postElement.querySelector('.interactionlike1');
        if (likeButton) {
            likeButton.style.display = 'inline-block';
        }
    }
    else if (event.target.classList.contains('interactioncomment')) {
        const isVisible = commentSection.style.display === 'flex';

        const postId = postElement.id;
        const commentArea = postElement.querySelector('.comment-area')

        const submitbtn = postElement.querySelector('.post-comment-btn')
        const textt = postElement.querySelector('.comment-box')

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
                     const datas=await fetchComments(postId)

                     var comments = Array.isArray(datas.comments) ? datas.comments : [datas.comments]

                     updateCommentSections(comments,commentArea)

                     textt.value=''

                }
                else{
                    console.error('Failed to create comment')
                }
            } catch (error) {
                console.log(error)
            }
        })
        try {

            const datas = await fetchComments(postId)

            var comments = Array.isArray(datas.comments) ? datas.comments : [datas.comments]

            updateCommentSections(comments,commentArea)

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

const updateCommentSections = async (comments, commentArea) => {
    if (comments.length > 0) {
        commentArea.innerHTML = comments.map(comment => ` <div class="introareacomment">
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

const gotoprofile=(commentArea)=>{
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

const gotouserprofile=(posthtml)=>{
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

ownprofile2.addEventListener('click',async(event)=>{
    const ppbtn=event.target.closest('.profile')
    if(ppbtn){
        window.location.href="/pages/profile.html"
    }
})

