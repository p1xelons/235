// event listener on load
window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;
    loadSavedSearch();
};

// var for the display term
let displayTerm = "";
let allStarships = [];

// search is clicked
function searchButtonClicked() {
    console.log("searchButtonClicked() called");
    
    // swapi url
    const SWAPI_URL = "https://swapi.info/api/starships";
    
    // find search term
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;
    
    // get any filters
    let filmFilter = document.querySelector("#filmFilter").value;
    let classFilter = document.querySelector("#classFilter").value;
    let passengerFilter = document.querySelector("#passengerFilter").value;
    
    term = term.trim();
    
    // save term and filters
    saveSearchParameters(term, filmFilter, classFilter, passengerFilter);
    
    // update ui to keep user updated
    document.querySelector("#status").innerHTML = "<b>Searching for starships...</b>";
    
    // call get data
    getData(SWAPI_URL, term, filmFilter, classFilter, passengerFilter);
}

