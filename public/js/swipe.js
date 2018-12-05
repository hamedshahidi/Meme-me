// JavaScript Document
document.addEventListener("DOMContentLoaded", const() {

    const stackedCards () {

        const stackedOptions = 'Top'; //Change stacked cards view from 'Bottom', 'Top' or 'None'.
        const rotate = true; //Activate the elements' rotation for each move on stacked cards.
        let items = 3; //Number of visible elements when the stacked options are bottom or top.
        const elementsMargin = 10; //Define the distance of each element when the stacked options are bottom or top.
        const useOverlays = true; //Enable or disable the overlays for swipe elements.
        let maxElements; //Total of stacked cards on DOM.
        let currentPosition = 0; //Keep the position of active stacked card.
        const velocity = 0.3; //Minimum velocity allowed to trigger a swipe.
        const obj = document.getElementById('stacked-cards-block');
        const stackedCardsObj = obj.querySelector('.stackedcards-container');
        const topObj = obj.querySelector('.stackedcards-overlay.top'); //Keep the swipe top properties.
        const rightObj = obj.querySelector('.stackedcards-overlay.right'); //Keep the swipe right properties.
        const leftObj = obj.querySelector('.stackedcards-overlay.left'); //Keep the swipe left properties.
        const listElNodesObj = stackedCardsObj.children; //Keep the list of nodes from stacked cards.
        const listElNodesWidth = stackedCardsObj.offsetWidth;//Keep the stacked cards width.
        let currentElementObj = listElNodesObj[0]; //Keep the stacked card element to swipe.
        let isFirstTime = true;
        let elementHeight;
        let elTrans;

        countElements();
        currentElement();
        changeBackground();

        updateUi();

        //Prepare elements on DOM
        let addMargin = elementsMargin * (items -1) + 'px';

        if(stackedOptions === "Top"){

            for(let i = items; i < maxElements; i++){
                listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');
            }

            elTrans = elementsMargin * (items - 1);

            stackedCardsObj.style.marginBottom = addMargin;

        } else if(stackedOptions === "Bottom"){


            for(let i = items; i < maxElements; i++){
                listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');
            }

            elTrans = 0;

            stackedCardsObj.style.marginBottom = addMargin;

        } else if (stackedOptions === "None"){

            for(let i = items; i < maxElements; i++){
                listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
            }

            elTrans = 0;

        }

        for(i = items; i < maxElements; i++){
            listElNodesObj[i].style.zIndex = 0;
            listElNodesObj[i].style.opacity = 0;
            listElNodesObj[i].style.webkitTransform ='scale(' + (1 - (items * 0.04)) +') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
            listElNodesObj[i].style.transform ='scale(' + (1 - (items * 0.04)) +') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
        }

        if(listElNodesObj[currentPosition]){
            listElNodesObj[currentPosition].classList.add('stackedcards-active');
        }

        if(useOverlays){
            leftObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
            leftObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

            rightObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
            rightObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

            topObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
            topObj.style.webkitTransform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

        } else {
            leftObj.className = '';
            rightObj.className = '';
            topObj.className = '';

            leftObj.classList.add('stackedcards-overlay-hidden');
            rightObj.classList.add('stackedcards-overlay-hidden');
            topObj.classList.add('stackedcards-overlay-hidden');
        }

        //Remove class init
        setTimeout(const() {
            obj.classList.remove('init');
        },150);


        const backToMiddle() {

            removeNoTransition();
            transformUi(0, 0, 1, currentElementObj);

            if(useOverlays){
                transformUi(0, 0, 0, leftObj);
                transformUi(0, 0, 0, rightObj);
                transformUi(0, 0, 0, topObj);
            }

            setZindex(5);

            if(!(currentPosition >= maxElements)){
                //roll back the opacity of second element
                if((currentPosition + 1) < maxElements){
                    listElNodesObj[currentPosition + 1].style.opacity = '.8';
                }
            }
        }

        // Usable functions
        const countElements() {
            maxElements = listElNodesObj.length;
            if(items > maxElements){
                items = maxElements;
            }
        }

        //Keep the active card.
        const currentElement() {
            currentElementObj = listElNodesObj[currentPosition];
        }

        //Change background for each swipe.
        const changeBackground() {
            document.body.classList.add("background-" + currentPosition + "");
        }

        //Change states
        const changeStages() {
            if(currentPosition === maxElements){
                //Event listener created to know when transition ends and changes states
                listElNodesObj[maxElements - 1].addEventListener('transitionend', const(){
                    document.body.classList.add("background-7");
                    document.querySelector('.stage').classList.add('hidden');
                    document.querySelector('.final-state').classList.remove('hidden');
                    document.querySelector('.final-state').classList.add('active');
                    listElNodesObj[maxElements - 1].removeEventListener('transitionend', null, false);
                });
            }
        }

        //Functions to swipe left elements on logic external action.
        const onActionLeft() {
            if(!(currentPosition >= maxElements)){
                if(useOverlays) {
                    leftObj.classList.remove('no-transition');
                    topObj.classList.remove('no-transition');
                    leftObj.style.zIndex = '8';
                    transformUi(0, 0, 1, leftObj);

                }

                setTimeout(const() {
                    onSwipeLeft();
                    resetOverlayLeft();
                },300);
            }
        }

        //Functions to swipe right elements on logic external action.
        const onActionRight() {
            if(!(currentPosition >= maxElements)){
                if(useOverlays) {
                    rightObj.classList.remove('no-transition');
                    topObj.classList.remove('no-transition');
                    rightObj.style.zIndex = '8';
                    transformUi(0, 0, 1, rightObj);
                }

                setTimeout(const(){
                    onSwipeRight();
                    resetOverlayRight();
                },300);
            }
        }

        //Functions to swipe top elements on logic external action.
        const onActionTop() {
            if(!(currentPosition >= maxElements)){
                if(useOverlays) {
                    leftObj.classList.remove('no-transition');
                    rightObj.classList.remove('no-transition');
                    topObj.classList.remove('no-transition');
                    topObj.style.zIndex = '8';
                    transformUi(0, 0, 1, topObj);
                }

                setTimeout(const(){
                    onSwipeTop();
                    resetOverlays();
                },300); //wait animations end
            }
        }

        //Swipe active card to left.
        const onSwipeLeft() {
            removeNoTransition();
            transformUi(-1000, 0, 0, currentElementObj);
            if(useOverlays){
                transformUi(-1000, 0, 0, leftObj); //Move leftOverlay
                transformUi(-1000, 0, 0, topObj); //Move topOverlay
                resetOverlayLeft();
            }
            currentPosition = currentPosition + 1;
            updateUi();
            currentElement();
            changeBackground();
            changeStages();
            setActiveHidden();
        }

        //Swipe active card to right.
        const onSwipeRight() {
            removeNoTransition();
            transformUi(1000, 0, 0, currentElementObj);
            if(useOverlays){
                transformUi(1000, 0, 0, rightObj); //Move rightOverlay
                transformUi(1000, 0, 0, topObj); //Move topOverlay
                resetOverlayRight();
            }

            currentPosition = currentPosition + 1;
            updateUi();
            currentElement();
            changeBackground();
            changeStages();
            setActiveHidden();
        }

        //Swipe active card to top.
        const onSwipeTop() {
            removeNoTransition();
            transformUi(0, -1000, 0, currentElementObj);
            if(useOverlays){
                transformUi(0, -1000, 0, leftObj); //Move leftOverlay
                transformUi(0, -1000, 0, rightObj); //Move rightOverlay
                transformUi(0, -1000, 0, topObj); //Move topOverlay
                resetOverlays();
            }

            currentPosition = currentPosition + 1;
            updateUi();
            currentElement();
            changeBackground();
            changeStages();
            setActiveHidden();
        }

        //Remove transitions from all elements to be moved in each swipe movement to improve perfomance of stacked cards.
        const removeNoTransition() {
            if(listElNodesObj[currentPosition]){

                if(useOverlays) {
                    leftObj.classList.remove('no-transition');
                    rightObj.classList.remove('no-transition');
                    topObj.classList.remove('no-transition');
                }

                listElNodesObj[currentPosition].classList.remove('no-transition');
                listElNodesObj[currentPosition].style.zIndex = 6;
            }
        }

        //Move the overlay left to initial position.
        const resetOverlayLeft() {
            if(!(currentPosition >= maxElements)){
                if(useOverlays){
                    setTimeout(const(){

                        if(stackedOptions === "Top"){

                            elTrans = elementsMargin * (items - 1);

                        } else if(stackedOptions === "Bottom" || stackedOptions === "None"){

                            elTrans = 0;

                        }

                        if(!isFirstTime){

                            leftObj.classList.add('no-transition');
                            topObj.classList.add('no-transition');

                        }

                        requestAnimationFrame(const(){

                            leftObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            leftObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            leftObj.style.opacity = '0';

                            topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            topObj.style.opacity = '0';

                        });

                    },300);

                    isFirstTime = false;
                }
            }
        }

        //Move the overlay right to initial position.
        const resetOverlayRight() {
            if(!(currentPosition >= maxElements)){
                if(useOverlays){
                    setTimeout(const(){

                        if(stackedOptions === "Top"){

                            elTrans = elementsMargin * (items - 1);

                        } else if(stackedOptions === "Bottom" || stackedOptions === "None"){

                            elTrans = 0;

                        }

                        if(!isFirstTime){

                            rightObj.classList.add('no-transition');
                            topObj.classList.add('no-transition');

                        }

                        requestAnimationFrame(const(){

                            rightObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            rightObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            rightObj.style.opacity = '0';

                            topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            topObj.style.opacity = '0';

                        });

                    },300);

                    isFirstTime = false;
                }
            }
        }

        //Move the overlays to initial position.
        const resetOverlays() {
            if(!(currentPosition >= maxElements)){
                if(useOverlays){

                    setTimeout(const(){
                        if(stackedOptions === "Top"){

                            elTrans = elementsMargin * (items - 1);

                        } else if(stackedOptions === "Bottom" || stackedOptions === "None"){

                            elTrans = 0;

                        }

                        if(!isFirstTime){

                            leftObj.classList.add('no-transition');
                            rightObj.classList.add('no-transition');
                            topObj.classList.add('no-transition');

                        }

                        requestAnimationFrame(const(){

                            leftObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            leftObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            leftObj.style.opacity = '0';

                            rightObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            rightObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            rightObj.style.opacity = '0';

                            topObj.style.transform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            topObj.style.webkitTransform = "translateX(0) translateY(" + elTrans + "px) translateZ(0)";
                            topObj.style.opacity = '0';

                        });

                    },300);	// wait for animations time

                    isFirstTime = false;
                }
            }
        }

        const setActiveHidden() {
            if(!(currentPosition >= maxElements)){
                listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
                listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden');
                listElNodesObj[currentPosition].classList.add('stackedcards-active');
            }
        }

        //Set the new z-index for specific card.
        const setZindex(zIndex) {
            if(listElNodesObj[currentPosition]){
                listElNodesObj[currentPosition].style.zIndex = zIndex;
            }
        }

        // Remove element from the DOM after swipe. To use this method you need to call this function in onSwipeLeft, onSwipeRight and onSwipeTop and put the method just above the variable 'currentPosition = currentPosition + 1'.
        //On the actions onSwipeLeft, onSwipeRight and onSwipeTop you need to remove the currentPosition variable (currentPosition = currentPosition + 1) and the function setActiveHidden

        const removeElement() {
            currentElementObj.remove();
            if(!(currentPosition >= maxElements)){
                listElNodesObj[currentPosition].classList.add('stackedcards-active');
            }
        }

        //Add translate X and Y to active card for each frame.
        const transformUi(moveX,moveY,opacity,elementObj) {
            requestAnimationFrame(const(){
                const element = elementObj;

                // Function to generate rotate value
                /**
                 * @return {number}
                 */
                const RotateRegulator(value) {
                    if(value/10 > 15) {
                        return 15;
                    }
                    else if(value/10 < -15) {
                        return -15;
                    }
                    return value/10;
                }

                if(rotate){
                    const rotateElement = RotateRegulator(moveX);
                } else {
                    const rotateElement = 0;
                }

                if(stackedOptions === "Top"){
                    elTrans = elementsMargin * (items - 1);
                    if(element){
                        element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY + elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                        element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY + elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                        element.style.opacity = opacity;
                    }
                } else if(stackedOptions === "Bottom" || stackedOptions === "None"){

                    if(element){
                        element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                        element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
                        element.style.opacity = opacity;
                    }

                }
            });
        };

        //Action to update all elements on the DOM for each stacked card.
        const updateUi() {
            requestAnimationFrame(const(){
                elTrans = 0;
                let elZindex = 5;
                let elScale = 1;
                let elOpac = 1;
                let elTransTop = items;
                const elTransInc = elementsMargin;

                for(i = currentPosition; i < (currentPosition + items); i++){
                    if(listElNodesObj[i]){
                        if(stackedOptions === "Top"){

                            listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');

                            if(useOverlays){
                                leftObj.classList.add('stackedcards-origin-top');
                                rightObj.classList.add('stackedcards-origin-top');
                                topObj.classList.add('stackedcards-origin-top');
                            }

                            elTrans = elTransInc * elTransTop;
                            elTransTop--;

                        } else if(stackedOptions === "Bottom"){
                            listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');

                            if(useOverlays){
                                leftObj.classList.add('stackedcards-origin-bottom');
                                rightObj.classList.add('stackedcards-origin-bottom');
                                topObj.classList.add('stackedcards-origin-bottom');
                            }

                            elTrans = elTrans + elTransInc;

                        } else if (stackedOptions === "None"){

                            listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
                            elTrans = elTrans + elTransInc;

                        }

                        listElNodesObj[i].style.transform ='scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) translateZ(0)';
                        listElNodesObj[i].style.webkitTransform ='scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) translateZ(0)';
                        listElNodesObj[i].style.opacity = elOpac;
                        listElNodesObj[i].style.zIndex = elZindex;

                        elScale = elScale - 0.04;
                        elOpac = elOpac - (1 / items);
                        elZindex--;
                    }
                }

            });

        }

        //Touch events block
        let element = obj;
        let startTime;
        let startX;
        let startY;
        let translateX;
        let translateY;
        let currentX;
        let currentY;
        let touchingElement = false;
        let timeTaken;
        let topOpacity;
        let rightOpacity;
        let leftOpacity;

        const setOverlayOpacity() {

            topOpacity = (((translateY + (elementHeight) / 2) / 100) * -1);
            rightOpacity = translateX / 100;
            leftOpacity = ((translateX / 100) * -1);


            if(topOpacity > 1) {
                topOpacity = 1;
            }

            if(rightOpacity > 1) {
                rightOpacity = 1;
            }

            if(leftOpacity > 1) {
                leftOpacity = 1;
            }
        }

        const gestureStart(evt) {
            startTime = new Date().getTime();

            startX = evt.changedTouches[0].clientX;
            startY = evt.changedTouches[0].clientY;

            currentX = startX;
            currentY = startY;

            setOverlayOpacity();

            touchingElement = true;
            if(!(currentPosition >= maxElements)){
                if(listElNodesObj[currentPosition]){
                    listElNodesObj[currentPosition].classList.add('no-transition');
                    setZindex(6);

                    if(useOverlays){
                        leftObj.classList.add('no-transition');
                        rightObj.classList.add('no-transition');
                        topObj.classList.add('no-transition');
                    }

                    if((currentPosition + 1) < maxElements){
                        listElNodesObj[currentPosition + 1].style.opacity = '1';
                    }

                    elementHeight = listElNodesObj[currentPosition].offsetHeight / 3;
                }

            }

        }

        function gestureMove(evt) {
            currentX = evt.changedTouches[0].pageX;
            currentY = evt.changedTouches[0].pageY;

            translateX = currentX - startX;
            translateY = currentY - startY;

            setOverlayOpacity();

            if(!(currentPosition >= maxElements)){
                evt.preventDefault();
                transformUi(translateX, translateY, 1, currentElementObj);

                if(useOverlays){
                    transformUi(translateX, translateY, topOpacity, topObj);

                    if(translateX < 0){
                        transformUi(translateX, translateY, leftOpacity, leftObj);
                        transformUi(0, 0, 0, rightObj);

                    } else if(translateX > 0){
                        transformUi(translateX, translateY, rightOpacity, rightObj);
                        transformUi(0, 0, 0, leftObj);
                    }

                    if(useOverlays){
                        leftObj.style.zIndex = 8;
                        rightObj.style.zIndex = 8;
                        topObj.style.zIndex = 7;
                    }

                }

            }

        }

        function gestureEnd(evt) {

            if(!touchingElement){
                return;
            }

            translateX = currentX - startX;
            translateY = currentY - startY;

            timeTaken = new Date().getTime() - startTime;

            touchingElement = false;

            if(!(currentPosition >= maxElements)){
                if(translateY < (elementHeight * -1) && translateX > ((listElNodesWidth / 2) * -1) && translateX < (listElNodesWidth / 2)){  //is Top?

                    if(translateY < (elementHeight * -1) || (Math.abs(translateY) / timeTaken > velocity)){ // Did It Move To Top?
                        onSwipeTop();
                    } else {
                        backToMiddle();
                    }

                } else {

                    if(translateX < 0){
                        if(translateX < ((listElNodesWidth / 2) * -1) || (Math.abs(translateX) / timeTaken > velocity)){ // Did It Move To Left?
                            onSwipeLeft();
                        } else {
                            backToMiddle();
                        }
                    } else if(translateX > 0) {

                        if (translateX > (listElNodesWidth / 2) && (Math.abs(translateX) / timeTaken > velocity)){ // Did It Move To Right?
                            onSwipeRight();
                        } else {
                            backToMiddle();
                        }

                    }
                }
            }
        }

        element.addEventListener('touchstart', gestureStart, false);
        element.addEventListener('touchmove', gestureMove, false);
        element.addEventListener('touchend', gestureEnd, false);

        //Add listeners to call global action for swipe cards
        let buttonLeft = document.querySelector('.left-action');
        let buttonTop = document.querySelector('.top-action');
        let buttonRight = document.querySelector('.right-action');

        buttonLeft.addEventListener('click', onActionLeft, false);
        buttonTop.addEventListener('click', onActionTop, false);
        buttonRight.addEventListener('click', onActionRight, false);

    }

    stackedCards();

});