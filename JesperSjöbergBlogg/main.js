const createNewPostForm = document.getElementById('postForm');
const publishButton = document.getElementById('publishButton');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

//Ladda upp bild
imageUpload.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}); 
 createNewPostForm.addEventListener('submit', function(event) {
    event.preventDefault(); //Så att sidan inte laddar om när man gör en post
    createNewPost();
});

document.querySelectorAll('.likes').forEach(like => {
    like.addEventListener('click', handleLikeClick); // Varje gång knappen trycks på, calla funktionen handleLikeClick
});

document.querySelectorAll('.deleteButton').forEach(btn => {
    btn.addEventListener('click', deletePost); // Loopar alla deleteknappar och callar funktionen deletePost om någon trycks på
});

document.querySelectorAll('.commentToggle').forEach(btn => {
    btn.addEventListener('click', toggleCommentForm); // Calla funktionen toggleCommentForm om någon av dem trycks på
});

document.querySelectorAll('.submitComment').forEach(btn => {
    btn.addEventListener('click', submitComment); // Calla funktionen submitComment när någon av dem trycks på
});

function createNewPost() {
    const title = document.getElementById('postTitle').value; // Sparar elementets värde i variabeln istället för elementet
    const content = document.getElementById('postContent').value;
    const fileInput = document.getElementById('imageUpload'); 
    const imageSrc = imagePreview.src; // Sparar src-länken i variabeln istället för elementet

    const post = document.createElement('div');
    post.className = 'blogPost';

    const now = new Date(); // Tar fram dagens datum
    const formattedDate = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); // Gör datumet till en string och med rätt tidszon för användaren

    const formattedContent = content.split('\n') // Formaterar inlägget så det blir uppsatt på samma sätt oavsett längd och antal paragrafer
        .filter(para => para.trim() !== '')
        .map(para => `<p>${para}</p>`)
        .join('');

    // Sätter värdet/innehållet på post-diven till nedan html-kod
    post.innerHTML = ` 
        <h2>${title}</h2>
        <div class="postInfo">
            <span class="postDate">${formattedDate}</span>
            <span class="postAuthor">By You</span>
        </div>
        <div class="postContent">
            ${formattedContent}
            ${imageSrc ? `<img src="${imageSrc}" id="uploadedContent" style="max-width:100%; margin-top:10px;">` : ""}
        </div>
        <div class="postActions">
            <div class="postActionsLeft">
                <div class="likes" dataLikes="0">❤️ <span>0</span>&nbsp;likes</div>
                <button class="commentToggle">Comments</button>
            </div>
            <div class="postActionsRight">
                <button class="deleteButton">Delete</button>
            </div>
        </div>
        <div class="commentsSection">
            <h3>Comments (0)</h3>
            <div class="commentForm">
                <textarea placeholder="Write a comment..." class="commentInput"></textarea>
                <button class="submitComment buttonTemplate">Submit Comment</button>
            </div>
        </div>
    `;

    const blogPosts = document.getElementById('blogPosts');
    blogPosts.insertBefore(post, blogPosts.firstChild); // Så att nya inlägget hamnar högst upp

    post.querySelector('.likes').addEventListener('click', handleLikeClick); // Assignar funktioner till respektive knappar
    post.querySelector('.deleteButton').addEventListener('click', deletePost);
    post.querySelector('.commentToggle').addEventListener('click', toggleCommentForm);
    post.querySelector('.submitComment').addEventListener('click', submitComment);

createNewPostForm.reset(); // Rensar fälten & eventuell image när man trycker Publish
    fileInput.value = ""; // Rensar eventuell uppladdad fil
    imagePreview.removeAttribute("src") // Så att inte img-placeholder ikonen finns kvar ifall man gör ytterligare posts
    imagePreview.style.display = "none";

    publishButton.textContent = "Published!"; // Visar Published istället för Publish i 2 sekunder efter man tryckt
    setTimeout(() => {
        publishButton.textContent = "Publish Post";
    }, 2000);
}

function handleLikeClick(event) { // Plussar på 1 varje gång man trycker
    const likeElement = event.currentTarget;
    let likes = parseInt(likeElement.getAttribute('dataLikes'));
    likes++;
    likeElement.setAttribute('dataLikes', likes);
    likeElement.querySelector('span').textContent = likes;
}

function deletePost(event) {
    const post = event.currentTarget.closest('.blogPost');
    post.remove();
}

function toggleCommentForm(event) { // Togglar comments så att man även kan gömma comments igen
    const post = event.currentTarget.closest('.blogPost');
    const commentsSection = post.querySelector('.commentsSection');
    
    if (commentsSection.style.display === 'none' || commentsSection.style.display === '') {
        commentsSection.style.display = 'block';
        event.currentTarget.innerHTML = "Hide Comments";
    } else {
        commentsSection.style.display = 'none';
        event.currentTarget.innerHTML = "Comments";
    }
}

function submitComment(event) {
    const post = event.currentTarget.closest('.blogPost');
    const commentInput = post.querySelector('.commentInput');
    const commentContent = commentInput.value.trim(); // Tar bort eventuella mellanrum
    
    if (!commentContent) { // Så att man inte råkar lägga en tom kommentar
        alert('Please write a comment before submitting');
        return;
    }
    
    const comment = document.createElement('div');
    comment.className = 'comment';
    
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    
    comment.innerHTML = `
        <div class="commentInfo">Posted by You on ${formattedDate}</div>
        <div class="commentContent">${commentContent}</div>
    `;
    
    const commentsSection = post.querySelector('.commentsSection');
    const commentForm = post.querySelector('.commentForm');
    commentsSection.insertBefore(comment, commentForm);
    
    commentInput.value = ''; // Rensar kommentarrutan när man submittat
    
    const commentsTitle = post.querySelector('.commentsSection h3');
    const currentCount = parseInt(commentsTitle.textContent.match(/\d+/)[0]); 
    const newCount = currentCount + 1;
    commentsTitle.textContent = `Comments (${newCount})`; // Adderar och displayar +1 i commentsSection h3 när det läggs till en kommentar
}