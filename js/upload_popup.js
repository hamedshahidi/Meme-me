'use strict';
const backdrop = document.createElement("div");
const modal = document.getElementById("modal");

document.addEventListener("click", function(event) {
    // element.matches() polyfill for IE10+ support
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector;
    }

    if (event.target.matches(".btn--launch-modal")) {
        modal.classList.add("open");
        backdrop.setAttribute("class", "backdrop");
        document.body.appendChild(backdrop);
    }

    if (event.target.matches(".modal__dismiss") || event.target.matches(".backdrop")) {
        modal.classList.remove("open");
        document.body.removeChild(backdrop);
    }
}, false);
