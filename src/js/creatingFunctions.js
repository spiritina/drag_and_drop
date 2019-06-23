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
export function createEpisodeContent (serialTitle, serialID, episodeTitle, date, rating, seasonVal, episode) {
    this.serialTitle = serialTitle;
    this.serialID = serialID;
    this.episodeTitle = episodeTitle;
    this.date = date;
    this.rating = rating;
    this.season = seasonVal;
    this.episode = episode;
}
