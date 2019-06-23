import {
    createElement,
    setAttributes,
    createEpisodeContent
} from './creatingFunctions';

let serialTitle, serialID, date, episodeTitle, episode, rating, savedEpisodes = {},
    enableHandler;
let seriesInp = document.getElementById('series');
let season = document.getElementById('season'),
    seasonVal = '1';
let drop = document.getElementsByClassName('drop')[0],
    dropContent = document.getElementById('dropContent');
season.addEventListener('change', function(e){seasonVal = season.value})
function dragNdrop(e, obj) {

    let newItem = createItem();
    document.body.appendChild(newItem);
    let coordinats = getElemPos(obj);
    let shiftX = e.pageX - coordinats.left;
    let shiftY = e.pageY - coordinats.top;
    moveAt(e);
    document.body.onmousemove = function (e) {
        e.preventDefault();
        if (enableHandler) {
            moveAt(e);
            checkDown(e, newItem);
            enableHandler = false;
        }
    };
    window.setInterval(function () {
        enableHandler = true;
    }, 100);



    function createItem(e) {

        serialTitle = obj.dataset.serietitle;
        date = obj.dataset.data;
        episodeTitle = obj.dataset.episodetitle;
        episode = obj.dataset.episode;
        rating = obj.dataset.rating;
        serialID = obj.dataset.serialid;
        return createElement('div', 'tmp');

    }

    function moveAt(e) {
        newItem.style.left = e.pageX - shiftX + 'px';
        newItem.style.top = e.pageY - shiftY + 'px';
    }



}

function saveChosenToLocalStorage() {
    localStorage.setItem('episodes', JSON.stringify(savedEpisodes));
}

function getEpisodes() {
    if (localStorage.getItem('episodes')) {
        savedEpisodes = JSON.parse(localStorage.getItem('episodes'));
        for (let key in savedEpisodes) {
            let episode = createChosenEpisode(savedEpisodes[key].serialTitle, savedEpisodes[key].episodeTitle, savedEpisodes[key].date, savedEpisodes[key].rating, savedEpisodes[key].serialID, savedEpisodes[key].season, savedEpisodes[key].episode);
            let dropContent = document.getElementById('dropContent');
            dropContent.appendChild(episode);
        }
    }
}

function createChosenEpisode(serialTitle, episodeTitle, date, rating, serialID, seasonVal, episode) {
    let div = createElement('div', 'episode');
    div.setAttribute('data-serialID', `${serialID}s${seasonVal}e${episode}`);
    let a = createElement('a', 'toSerial');
    a.setAttribute('href', `serial.html?i=${serialID}`);
    let p = createElement('p', 'title', ` ${episodeTitle}`);
    a.appendChild(p);
    let meta = createElement('p', 'meta', `<div class="col"><p>${serialTitle}</p><p>Episode released: ${date}</p> </div><b>Serial rating: ${(rating=='N/A')?'Unknown':rating}</b>`);
    let deleteBtn = createElement('button', 'delete');
    deleteBtn.setAttribute('type', 'button');

    div.appendChild(a);
    div.appendChild(meta);
    div.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        let removeKey = this.parentNode.dataset.serialid;
        console.log(removeKey);
        console.log(savedEpisodes);
        delete savedEpisodes[removeKey];
        saveChosenToLocalStorage();
        this.parentNode.remove();
    });
    div.style.cursor = 'default';
    return div;
}

function isOver(newItem, element) {
    let dropCoordinats = element.getBoundingClientRect();
    let itemCoordinats = newItem.getBoundingClientRect();
    let result = false;

    const coordsArray = [
        {
            x: itemCoordinats.left,
            y: itemCoordinats.top
                },
        {
            x: itemCoordinats.left,
            y: itemCoordinats.bottom
                },
        {
            x: itemCoordinats.right,
            y: itemCoordinats.top
                },
        {
            x: itemCoordinats.right,
            y: itemCoordinats.bottom
                }
            ];

    return coordsArray.find(coord => {
        return isElementCornerIntoContainerView(coord, dropCoordinats)
    })
}

function isElementCornerIntoContainerView(coords, containerCoords) {
    const {
        x,
        y
    } = coords
    const {
        top,
        left,
        bottom,
        right
    } = containerCoords;

    return x >= left && x <= right && y >= top && y <= bottom
}

function whereToDropElement(newItem, div) {
    let items = dropContent.children;
    let attrValue = div.dataset.serialid;
   for (let i=0; i<items.length; i++){  
    if (items[i].dataset.serialid==attrValue) {
        newItem.remove();
        return;
    }}
    if (items.length) {
        for (let i = 0; i < items.length; i++) {
            if (isOver(newItem, items[i])) {
                if (newItem.getBoundingClientRect().top < items[i].getBoundingClientRect().top) {
                    dropContent.insertBefore(div, items[i]);
                addEpisoteToSavedEpisodes();
                 saveChosenToLocalStorage();
                    break;
                } else {
                dropContent.insertBefore(div, items[i + 1]);
                   addEpisoteToSavedEpisodes();
                   saveChosenToLocalStorage();
                    break;
                }
            } else if (i == items.length - 1) {
                dropContent.appendChild(div);
                addEpisoteToSavedEpisodes();
                saveChosenToLocalStorage();
            }
        }

    } else {
        dropContent.appendChild(div);
        addEpisoteToSavedEpisodes();
        saveChosenToLocalStorage();
    }
}

function addEpisoteToSavedEpisodes() {
savedEpisodes[`${seriesInp.value}s${seasonVal}e${episode}`] = new createEpisodeContent(serialTitle, serialID, episodeTitle, date, rating, seasonVal, episode);
    console.log(savedEpisodes);
}

function checkDown(e, newItem) {
    document.body.onmouseup = function () {
        if (isOver(newItem, drop)) {
            let div = createChosenEpisode(serialTitle, episodeTitle, date, rating, serialID, seasonVal, episode);
            whereToDropElement(newItem, div);

        };
        document.body.onmouseup = null;
        newItem.remove();
    };
}

function getElemPos(elem) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}
export {
    dragNdrop,
    savedEpisodes,
    createChosenEpisode,
    getEpisodes
};