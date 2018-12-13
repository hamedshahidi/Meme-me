/*
 * Create by 'The missing semicolon' team @author
 * Login js for sign in and sign up animation
 */

'use stricts';

const signInContainer = document.getElementById('signIn-container');
const signInbox = document.getElementById('signIn-box');
const signInbtn = document.getElementById('btn-signIn');

const signUpContainer = document.getElementById('signUp-container');
const signUpbox = document.getElementById('signUp-box');
const signUpbtn = document.getElementById('btn-signUp');

/* hides the container and modal */
const hideIt = (cont, box) => {
  cont.style.visibility = 'hidden';
  cont.style.opacity = '0';
  box.style.visibility = 'hidden';
  box.style.opacity = '0';
};

/* shows container and modal */
const showIt = (cont, box) => {
  cont.style.visibility = 'visible';
  cont.style.opacity = '1';
  box.style.visibility = 'visible';

  box.style.opacity = '1';
};

/* hides pair and shows 2nd pair */
const hide1show2 = (cont1, box1, cont2, box2) => {
  hideIt(cont1, box1);
  console.log(cont1.id + ' + ' + box1.id + ' ==> hidden.');
  showIt(cont2, box2);
  console.log(cont2.id + ' + ' + box2.id + ' ==> shown.');
};

/* adds jello motion animation from mdoal */
const addAnimationTo = (box) => {
  box.classList.add('jellyMotion');
  console.log(box.id + ' ==> +anim');
};

/* removes jelly motion animation from mdoal */
const removeAnimationFrom = (box) => {
  box.classList.remove('jellyMotion');
  console.log(box.id + ' ==> -anim');
};

/* switching process between sign in/up forms in event listener */
signUpbtn.addEventListener('click', (e) => {
  e.preventDefault();
  removeAnimationFrom(signInbox);
  addAnimationTo(signUpbox);
  hide1show2(signInContainer, signInbox, signUpContainer, signUpbox);
}, false);

/* switching process between sign in/up forms in event listener */
signInbtn.addEventListener('click', (e) => {
  e.preventDefault();
  removeAnimationFrom(signUpbox);
  addAnimationTo(signInbox);
  hide1show2(signUpContainer, signUpbox, signInContainer, signInbox);
}, false);

/* checks for signup form errors on page load
   to pick which form to be shown on screen
 */
window.onload = () => {
  if (document.querySelector('p[id^="err-"]')) {
    hide1show2(signInContainer, signInbox, signUpContainer, signUpbox);
    removeAnimationFrom(signInbox);
    addAnimationTo(signUpbox);
  } else {
    showIt(signInContainer,signInbox);
    addAnimationTo(signInbox);
  }
};

console.log('js loaded!');
