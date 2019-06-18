export function createElement(tag, className, txt = '') {
    let elem = document.createElement(tag);
    elem.classList.add(className);
    elem.innerHTML = txt;
    return elem;
}

export function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

//export default {createElement, setAttributes};