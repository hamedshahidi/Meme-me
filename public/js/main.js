'use strict';

const frm           = document.querySelector('#mediaform');
const inputFile     = document.querySelector('input[type=file]');
// const img = document.querySelector('#image');
// const aud = document.querySelector('#aud');
// const vid = document.querySelector('#vid');

//Function for sending data to server and fetching data back
const sendForm = (evt) => {
  evt.preventDefault();
  const fd = new FormData(frm);
  const settings = {
    method: 'post',
    body: fd,
  };
  fetch('/upload', settings).then((response) => {
    return response.json();
  }).then((json) => {
    console.log('This is called ');
    console.log(json);
  });
};
frm.addEventListener('submit', sendForm);
//Function for previewing meme
const previewFile = () => {
    const preview = document.querySelector('#previewImage');
    const reader  = new FileReader();
    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);
    if (inputFile.files[0]) {
        reader.readAsDataURL(inputFile.files[0]);
    }
};
inputFile.addEventListener('change', previewFile);
