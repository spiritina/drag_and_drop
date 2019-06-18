import _ from 'lodash';
import {createElement, setAttributes} from './creatingFunctions';
import dragNdrop from './dnd'

let films = {},
    totalSeasons, 
    serieTitle,
    dragEpisode,
    season = document.getElementById('season'),
    dragContent = document.getElementById('dragContent'),
    drag = document.getElementsByClassName('drag')[0],
    drop = document.getElementsByClassName('drop')[0],
    seriesInp = document.getElementById('series');
seriesInp.addEventListener('change', function () {
    getFilms(seriesInp.value, 1,  createSeasons);});
season.addEventListener('change', function () {
    getFilms(seriesInp.value, season.value, function(){});
});

window.onload = function () {
    getFilms(seriesInp.value,1, createSeasons);
};

function getFilms(id, season = 1, callback) {
    let XHR = (new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    let xhr = new XHR();
    xhr.open('post', `http://www.omdbapi.com/?i=${id}&Season=${season}&type=series&apikey=30347daa`, true);

    xhr.onload = function () {
        films = JSON.parse(this.responseText);
        console.log(films);
        let {totalSeasons} = films;
        console.log(totalSeasons);
        drawFilms(films);
        callback(totalSeasons);

        function drawFilms(films) {
            dragContent.innerHTML='';
            let h2 = document.createElement('h2');
            let {Season} = films; 
            h2.innerHTML = `Season ${Season}`;
            let {Episodes, Title} = films;
            serieTitle = Title;
            dragContent.appendChild(h2);
            for (let i = 0; i < Episodes.length; i++) {
                drawEpisode(Episodes[i]);
            }

            function drawEpisode(film) {
            let {Title,Released,Episode,imdbRating} = film;
                let div = createElement('div', 'episode');
                setAttributes(div, {
                    'data-serieTitle':serieTitle,
                    'data-episodeTitle': Title,
                    'data-data': Released,
                    'data-episode': Episode,
                    'data-rating': imdbRating
                });
                dragContent.appendChild(div);
                let p = createElement('p', 'title', `${Episode}) ${Title}`);
                let meta = createElement('p', 'meta', `Episode released: ${Released} <b>Rating: ${(imdbRating=='N/A')?'Unknown':imdbRating}</b>`);
                div.appendChild(p);
                div.appendChild(meta);
                div.addEventListener('mousedown',function(e){
                    dragNdrop(e,this);
                });
                
            }
        }
    }

    xhr.onerror = function () {
        console.log('Ошибка ' + this.status);
        dragContent.innerHTML = 'Sorry, we have some problems!';
    }

    xhr.send();
}

function createSeasons(totalSeasons) {
    season.innerHTML = '';
    for (let i = 1; i <= totalSeasons; i++) {
        let option = createElement('option', 'option', `Season ${i}`);
        option.setAttribute('value', `${i}`);
        season.appendChild(option);
    }
}