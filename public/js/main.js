'use strict';
const frm = document.querySelector('#mediaform');
const memeDiv = document.querySelector('#meme');
// const img = document.querySelector('#image');
// const aud = document.querySelector('#aud');
// const vid = document.querySelector('#vid');

//Function for liking
const likeMeme = (evt) => {
    console.log('Liking func');
    const data = {
        user: 1,
        meme_medium: evt.target.id.substring(5),
        vote: 1,
    };
    fetch('/voted', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
    }).then((response) => {
        console.log(response.toString());
    });
};

//Function for disliking
const dislikeMeme = (evt) => {
    console.log('Disliking func');
    const data = {
        user: 1,
        meme_medium: evt.target.id.substring(8),
        vote: -1,
    };
    fetch('/voted', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
    }).then((response) => {
        return response.text();
    }).then((text) => {
        console.log(text);
    });
};
//Function for adding event listener to like and dislike buttons
const vote = () => {
    const likeButtons = document.querySelectorAll('*[id^="like_"]');
    likeButtons.forEach(button => {
        button.addEventListener('click', likeMeme);
    });
    const dislikeButtons = document.querySelectorAll('*[id^="dislike_"]');
    dislikeButtons.forEach(button => {
        button.addEventListener('click', dislikeMeme);
    });
};

//Function for previewing meme
const listAllMemes = () => {
    fetch('/listMeme').then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        memeDiv.innerHTML = '';
        json.forEach(meme => {
            const image = document.createElement('img');
            image.src = 'medium/' + meme.meme_medium;

            const numOfLike = document.createElement('p');
            numOfLike.innerText = 'Number of likes';

            const like = document.createElement('button');
            like.id = 'like' + '_' + meme.meme_medium;
            like.innerText = 'Like';

            const numOfDisLike = document.createElement('p');
            numOfDisLike.innerText = 'Number of dislikes';

            const dislike = document.createElement('button');
            dislike.id = 'dislike' + '_' + meme.meme_medium;
            dislike.innerText = 'Dislike';

            memeDiv.innerHTML += image.outerHTML + numOfLike.outerHTML + like.outerHTML + numOfDisLike.outerHTML + dislike.outerHTML;
            vote();
        });
    });
};

listAllMemes();
//Function for sending data form to server and fetching data back
const sendForm = (evt) => {
    evt.preventDefault();
    const fd = new FormData(frm);
    const settings = {
        method: 'post',
        body: fd,
    };

    fetch('/upload', settings).then((response) => {
        return response.text();
    }).then((text) => {
        console.log(text);
        listAllMemes();
    });
};

frm.addEventListener('submit', sendForm);

