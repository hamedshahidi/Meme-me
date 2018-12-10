let prevScrollpos = window.pageYOffset;
window.onscroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
    } else {
        document.getElementById("navbar").style.top = "-150px";
    }
    prevScrollpos = currentScrollPos;
};

window.onload = () => {
    if(document.URL==='https://10.114.32.124/node/profile'){
        console.log('Profile page is active.');
        document.getElementById('profile').style.color='#d94f5c';
    }
};