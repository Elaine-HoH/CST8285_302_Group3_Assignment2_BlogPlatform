document.addEventListener('DOMContentLoaded', function() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    loadPost(postId, function() {
        console.log(1);
        const commentButton = document.getElementById("commentButton");
        commentButton.addEventListener('click', function () {
            const postsDiv = document.getElementById('posts');
            const postCard = document.getElementById('post-card');
            const addComment = document.createElement('form');
            addComment.innerHTML = `
            <div class="comment-card">
                <div class="comment-header">
                    <input class="comment-profile-name" type="text" id="comName" name="comName" placeholder="Name" required>
                </div>
                <input class="comment-content" type="text" id="comContent" name="comContent" placeholder="Content" required>
                <button type="submit">Submit</button>
            </div>
            `;
            if (postCard.nextSibling) {
                postsDiv.insertBefore(addComment, postCard.nextSibling);
            } else {
                postsDiv.appendChild(addComment);
            }
        });
    }); 
});

function loadPost(postId, callback) {

    fetch(`apps/filter_posts.php?postId=${postId}`)
        .then(response => response.json())
        .then(data => {

            const postsDiv = document.getElementById('posts');
            postsDiv.innerHTML = ''; // Clear existing posts
            const postComment = document.createElement('div');
            postComment.className = 'comment-card';
            
            data.forEach((post, index, array) => {
                const postCard = document.createElement('div');
                postCard.className = 'post-card';
                postCard.id = 'post-card';

                if (post.comment) {
                    postComment.innerHTML += `
                    <div class="comment-header">
                        <div>
                            <span class="comment-profile-name">${post.comment_author}</span>
                            <span class="comment-profile-verified">&#10003;</span>
                        </div>
                    </div>
                    <div class="comment-content">
                        ${post.comment}
                    </div>
                    `;
                }

                if (index === 0) {
                    postCard.innerHTML = `
                    <div class="post-header">
                        <span class="post-category">${post.category}</span>
                        <button class="delete-button" onclick="deletePost(${post.id})">Delete</button>
                    </div>
                    <img src="${post.image_path}" alt="" class="post-image">
                    <div class="post-content">
                        <div class="post-meta">${post.category.toUpperCase()} • ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        <h2 class="post-title">${post.title}</h2>
                        <p class="post-excerpt">${post.content}</p>
                        <div class="post-author">${post.author}</div>
                        <div class="post-actions">
                            <div class="post-action">Like</div>
                            <div id="commentButton" class="post-action">Comment</div>
                            <div class="post-action">Share</div>
                        </div>
                    </div>
                    `;
                    postsDiv.appendChild(postCard);
                    console.log(0);
                }
                // use insertBefore let postCard showing at the very begining
                if (index === array.length - 1){
                    postsDiv.appendChild(postComment);
                }
            });
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

