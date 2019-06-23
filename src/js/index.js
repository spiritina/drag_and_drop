import _ from 'lodash';
import { createElement, setAttributes } from './creatingFunctions';
import {
    dragNdrop,
    savedEpisodes,
    getEpisodes,
    createChosenEpisode,
    getElemPos,
    moveAt
} from './dnd';
import axios from 'axios';

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
    getFilms(seriesInp.value, 1, createSeasons);
});
season.addEventListener('change', function () {
    getFilms(seriesInp.value, season.value, function () {});
});

window.addEventListener('load', function () {
    getFilms(seriesInp.value, 1, createSeasons);
    getEpisodes();
});

function drawFilms(films) {
    dragContent.innerHTML = '';
    if (document.getElementsByClassName('head')[0]) {
        document.getElementsByClassName('head')[0].remove();
    }
    let { Season } = films;
    let h2 = createElement('h2', 'head', `Season ${Season}`);
    let { Episodes, Title } = films;
    serieTitle = Title;
    drag.insertBefore(h2, dragContent);
    for (let i = 0; i < Episodes.length; i++) {
        drawEpisode(Episodes[i]);
    }

    function drawEpisode(film) {
        let { Title, Released, Episode, imdbRating } = film;
        let div = createElement('div', 'episode');
        setAttributes(div, {
            'data-serieTitle': serieTitle,
            'data-episodeTitle': Title,
            'data-data': Released,
            'data-episode': Episode,
            'data-rating': imdbRating,
            'data-serialid': seriesInp.value
        });
        dragContent.appendChild(div);
        let p = createElement('p', 'title', `${Episode}) ${Title}`);
        let rating = imdbRating === 'N/A' ? 'Unknown' : imdbRating
        let meta = createElement('p', 'meta', `Episode released: ${Released} <b>Rating: ${rating}</b>`);
        div.appendChild(p);
        div.appendChild(meta);
        div.addEventListener('mousedown', function (e) {
            dragNdrop(e, this);
        });

    }
}

async function getFilms(id, season = 1, callback) {
    try {
        const { data } = await axios.post(`http://www.omdbapi.com/?i=${id}&Season=${season}&type=series&apikey=30347daa`)
        let { totalSeasons } = data;
        drawFilms(data);
        callback(totalSeasons);
    } catch (error) {
        if (error.code = 500) console.log('server not response')
    }
}

function createSeasons(totalSeasons) {
    season.innerHTML = '';
    for (let i = 1; i <= totalSeasons; i++) {
        let option = createElement('option', 'option', `Season ${i}`);
        option.setAttribute('value', `${i}`);
        season.appendChild(option);
    }
}