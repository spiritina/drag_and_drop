import {
    createElement,
    setAttributes
} from './creatingFunctions';

let serial, date, episodeTitle, episode, rating, enableHandler;

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
        if (enableHandler) {

            moveAt(e);
            checkDown(e);
            enableHandler = false;
        }
    };
    window.setInterval(function () {
        enableHandler = true;
    }, 100);

    function checkDown(e) {
        document.body.onmouseup = function () {
            if (isOver(drop)) {
                let div = createElement('div', 'episode');
                let p = createElement('p', 'title', ` ${episodeTitle}`);
                let meta = createElement('p', 'meta', `<div class="col"><p>${serial}</p><p>Episode released: ${date}</p> </div><b>Rating: ${(rating=='N/A')?'Unknown':rating}</b>`);
                let deleteBtn = createElement('button', 'delete');
                deleteBtn.setAttribute('type', 'button');

                div.appendChild(p);
                div.appendChild(meta);
                div.appendChild(deleteBtn);
                deleteBtn.addEventListener('click', function () {
                    this.parentNode.remove();
                });
                let items = dropContent.children;
                if (items.length) {
                    for (let i = 0; i < items.length; i++) {
                        if (isOver(items[i])) {
                            if (newItem.getBoundingClientRect().top < items[i].getBoundingClientRect().top) {
                                dropContent.insertBefore(div, items[i]);
                                break;
                            } else {
                                dropContent.insertBefore(div, items[i+1]);
                                break;
                            }
                        } else if (i == items.length - 1) {
                            dropContent.appendChild(div);
                        }
                    }

                } else {
                    dropContent.appendChild(div);
                }
            };
            document.body.onmouseup = null;
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
        rating = obj.dataset.rating;
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