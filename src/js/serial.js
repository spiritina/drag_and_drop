import _ from 'lodash';
import axios from 'axios';
import {
    createElement,
    setAttributes
} from './creatingFunctions';
let showCommentFormBtn = document.getElementById('comment'),
    isFormShown = false,
 commentForm = document.getElementById('comment-form');

showCommentFormBtn.addEventListener('click', (e)=>{
if(isFormShown){commentForm.style.display = 'none';
               showCommentFormBtn.innerHTML = "Leave comment"}else{
                   commentForm.style.display = 'block';
               showCommentFormBtn.innerHTML = "Hide comment form"
               }  
});

let {
    search
} = window.location;
search += '&apikey=30347daa';
window.onload = () => {
    getSerial();
}
async function getSerial() {
    try {
        var serial = await axios.post(`http://www.omdbapi.com/${search}`);
        drawSerial(serial);
    } catch (error) {
        console.log(error);
    }
}

function drawSerial(serial) {
    let {
        data
    } = serial;
    let {
        Actors,
        Awards,
        Country,
        Director,
        Genre,
        Language,
        Plot,
        Poster,
        imdbRating,
        Title,
        totalSeasons
    } = data;
    setInnerHTML('title', Title);
    setInnerHTML('actors', Actors);
    setInnerHTML('director', Director);
    setInnerHTML('awards', Awards);
    setInnerHTML('country', Country);
    setInnerHTML('genre', Genre);
    setInnerHTML('language', Language);
    setInnerHTML('plot', Plot);
    setInnerHTML('seasons', totalSeasons);
    let posterImg = document.getElementById('posterImg');
    posterImg.setAttribute('src', Poster);
    let svg = document.getElementsByTagName('path');
    for (let i = 0; i < Math.floor(imdbRating / 2); i++) {
        svg[i].style.fill = 'yellow';
    }
    let gradient = createGradient(svg[Math.floor(imdbRating / 2)].parentNode, 'grad1', [{
            'offset': `0%`,
            'stop-color': 'yellow'
        },
        {
            'offset': `${(imdbRating%2)/2*100}%`,
            'stop-color': 'yellow'
        }, {
            'offset': `${(imdbRating%2)/2*100}%`,
            'stop-color': '#424242'
        }]);

    function createGradient(svg, id, stops) {
        var svgNS = svg.namespaceURI;
        var grad = document.createElementNS(svgNS, 'linearGradient');
        grad.setAttribute('id', id);
        for (var i = 0; i < stops.length; i++) {
            var attrs = stops[i];
            var stop = document.createElementNS(svgNS, 'stop');
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr, attrs[attr]);
            }
            grad.appendChild(stop);
        }

        var defs = document.createElement('defs');
        return defs.appendChild(grad);
    }
    svg[Math.floor(imdbRating / 2)].parentNode.insertBefore(gradient, svg[Math.floor(imdbRating / 2)]);
    svg[Math.floor(imdbRating / 2)].style.fill = "url(#grad1)";

}

function setInnerHTML(elementID, innerValue) {
    let elem = document.getElementById(elementID);
    elem.innerHTML = `<span>${elem.dataset.title}</span> ${innerValue}`;
}