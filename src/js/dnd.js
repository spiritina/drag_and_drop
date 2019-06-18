import {
    createElement,
    setAttributes
} from './creatingFunctions';

let serial, date, episodeTitle, episode, rating;

function dragNdrop(e, obj) {
    let drop = document.getElementsByClassName('drop')[0],
        dropContent = document.getElementById('dropContent');
    let newItem = createItem();
    document.body.appendChild(newItem);
    let coordinats = getElemPos(obj);
    let shiftX = e.pageX - coordinats.left;
    let shiftY = e.pageY - coordinats.top;
    moveAt(e);
    document.body.onmousemove = function (e) {
        e.preventDefault();
        console.log(111)
        moveAt(e);
        checkDown(e);
    };

    function checkDown(e) {
        document.body.onmouseup = function () {
            if (isOver(drop)) {
                 let div = createElement('div', 'episode');
                dragContent.appendChild(div);
                let p = createElement('p', 'title', `${episode}) ${episodeTitle}`);
                let meta = createElement('p', 'meta', `<p>${serial}</p><p>Episode released: ${date}</p> <b>Rating: ${(rating=='N/A')?'Unknown':rating}</b>`);
                div.appendChild(p);
                div.appendChild(meta);
                
                let items = drop.children;
                if (items.length) {
                    for (let i = 0; i < items.length; i++) {
                        if (isOver(items[i])) {
                            if (newItem.getBoundingClientRect().top < items[i].getBoundingClientRect().top) {
                                dropContent.insertBefore(div, items[i]);
                                break;
                            } else {
                                if (items[i + 1]) {
                                    dropContent.insertBefore(div, (items[i + 1]))
                                    break;
                                } else {
                                    dropContent.appendChild(div);
                                    break;
                                }
                            }
                        } else {
                            dropContent.appendChild(div);
                            break;
                        }
                    }
                } else {
                    dropContent.appendChild(div);
                }
                document.body.onmouseup = null;
            }; 
            newItem.remove();
        };

        function isOver(element) {
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
    }


    function createItem(e) {

        serial = obj.dataset.serietitle;
            date = obj.dataset.data;
            episodeTitle = obj.dataset.episodetitle;
            episode = obj.dataset.episode;
            rating = obj.dataset.rating;
        console.log(serial,date,episode,episodeTitle,rating);
        return createElement('div', 'tmp');

    }

    function moveAt(e) {
        newItem.style.left = e.pageX - shiftX + 'px';
        newItem.style.top = e.pageY - shiftY + 'px';
    }


    function getElemPos(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
}


export default dragNdrop;