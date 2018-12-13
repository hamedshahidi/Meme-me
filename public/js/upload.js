/*
 * Create by 'The missing semicolon' team @author
 * Upload js file is for processing file data when upload button is clicked
 */

'use strict';

const backdrop = document.createElement("div");
const upload = document.querySelector('#upload');
const uploadHam = document.querySelector('#uploadHam');
const modal = document.getElementById("modal");
const fileSelect    = document.getElementById('file-upload');
const fileDrag      = document.getElementById('file-drag');
const submitButton  = document.getElementById('submit-button');
//
// File Upload
//

// Function for file uploading
const ekUpload = () =>{
    const Init = () => {
        fileSelect.addEventListener('change', fileSelectHandler, false);

        // Is XHR2 available?
        const xhr = new XMLHttpRequest();
        if (xhr.upload) {
            // File Drop
            fileDrag.addEventListener('dragover', fileDragHover, false);
            fileDrag.addEventListener('dragleave', fileDragHover, false);
            fileDrag.addEventListener('drop', fileSelectHandler, false);
        }
    };

    const fileDragHover = (e) => {
        const fileDrag = document.getElementById('file-drag');

        e.stopPropagation();
        e.preventDefault();

        fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
    };

    const fileSelectHandler = (e) => {
        // Fetch FileList object
        const files = e.target.files || e.dataTransfer.files;

        // Cancel event and hover styling
        fileDragHover(e);

        // Process all File objects
        for (let i = 0, f; f = files[i]; i++) {
            parseFile(f);
            console.log('got it');
        }
    };

    // Output
    const output = (msg) => {
        // Response
        const m = document.getElementById('messages');
        m.innerHTML = msg;
    };

    const parseFile = (file) => {

        console.log(file.name);
        /*output(
            '<strong>' + encodeURI(file.name) + '</strong>'
        );*/

        // var fileType = file.type;
        // console.log(fileType);
        const imageName = file.name;

        const isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
        if (isGood) {
            console.log('is good');
            document.getElementById('start').classList.add("hidden");
            document.getElementById('response').classList.remove("hidden");
            document.getElementById('notimage').classList.add("hidden");
            // Thumbnail Preview
            document.getElementById('file-image').classList.remove("hidden");
            document.getElementById('file-image').src = URL.createObjectURL(file);
        }
        else {
            document.getElementById('file-image').classList.add("hidden");
            document.getElementById('notimage').classList.remove("hidden");
            document.getElementById('start').classList.remove("hidden");
            document.getElementById('response').classList.add("hidden");
            document.getElementById("file-upload-form").reset();
        }
    };

    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
        Init();
    } else {
        document.getElementById('file-drag').style.display = 'none';
    }
};

//Prevent upload button from sending
upload.addEventListener('click', (event) => {
    event.preventDefault();
});

//Prevent upload hamburger button from sending
uploadHam.addEventListener('click', (event) => {
    event.preventDefault();
});

//Addeventlistener to document for it to listen to a click event for upload button
document.addEventListener('click', (event) => {
    // element.matches() polyfill for IE10+ support
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector;
    }

    if (event.target.matches("#upload") || event.target.matches("#uploadHam")) {
        console.log('Upload is called');
        modal.classList.add("open");
        backdrop.setAttribute("class", "backdrop");
        document.body.appendChild(backdrop);
    }

    if (event.target.matches(".modal__dismiss") || event.target.matches(".backdrop")) {
        modal.classList.remove("open");
        document.body.removeChild(backdrop);
    }
});

//Addeventlistener for submit button
submitButton.addEventListener('click', () => {
    modal.classList.remove("open");
    document.body.removeChild(backdrop);
    document.getElementById('start').classList.remove("hidden");
    document.getElementById('response').classList.add("hidden");
    document.getElementById('notimage').classList.add("hidden");
    document.getElementById('file-image').classList.add("hidden");
    document.getElementById('file-image').src = '';
});

ekUpload();