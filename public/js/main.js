'use strict';
const frm = document.querySelector('#mediaform');
const memeDiv = document.querySelector('#meme');
const inputFile = document.querySelector('input[type=file]');

//Function for liking
const likeMeme = (evt) => {
    console.log('Liking func');
    const data = {
        meme_medium: evt.target.id.substring(5),
        like: 1,
        dislike: 0,
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
        meme_medium: evt.target.id.substring(8),
        like: 0,
        dislike: 1,
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

//Function for listing all memes
const listAllMemes = () => {
    fetch('/listMeme').then((response) => {
        return response.json();
    }).then((json) => {
        json.reverse();
        console.log(json);
        memeDiv.innerHTML = '';
        json.forEach(meme => {
            console.log(meme);
            const gallery_item = document.createElement('div');
            gallery_item.className = 'gallery_item';

            const image = document.createElement('img');
            image.src = 'medium/' + meme.meme_medium;

            const voteDiv = document.createElement('div');
            voteDiv.id = `${meme.meme_medium}`;

            const numOfLike = document.createElement('p');
            numOfLike.className = 'numLike';
            numOfLike.innerText = meme.NumLikes;

            const like = document.createElement('button');
            like.id = 'like' + '_' + meme.meme_medium;
            like.innerText = 'Like';

            const numOfDisLike = document.createElement('p');
            numOfDisLike.className = 'numDislike';
            numOfDisLike.innerText = meme.NumDislikes;

            const dislike = document.createElement('button');
            dislike.id = 'dislike' + '_' + meme.meme_medium;
            dislike.innerText = 'Dislike';

            voteDiv.innerHTML = numOfLike.outerHTML + like.outerHTML +
                numOfDisLike.outerHTML + dislike.outerHTML;
            gallery_item.innerHTML = image.outerHTML + voteDiv.outerHTML;
            memeDiv.innerHTML += gallery_item.outerHTML;
            vote();
        });
    });
};

//Function for previewing meme
const previewFile = () => {
    const preview = document.querySelector('#previewImage');
    const reader = new FileReader();
    reader.addEventListener('load', const() {
        preview.src = reader.result;
    }, false);
    if (inputFile.files[0]) {
        reader.readAsDataURL(inputFile.files[0]);
    }
};

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

listAllMemes();
inputFile.addEventListener('change', previewFile);
frm.addEventListener('submit', sendForm);

