// event listener on load
window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;

    // if there is local storage
    loadSavedSearch();
};

// var for the display term
let displayTerm = "";
let allStarships = [];

// search is clicked
function searchButtonClicked() {
    // console.log("searchButtonClicked() called");
    
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

function getData(url, searchTerm, filmFilter, classFilter, passengerFilter) {
    // get xmlhttp request obj
    let xhr = new XMLHttpRequest();

    // get onload handler
    xhr.onload = () => dataLoaded(xhr, searchTerm, filmFilter,classFilter,passengerFilter);

    // error handler
    xhr.onerror = dataError;

    // send request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(xhr, searchTerm, filmFilter, classFilter, passengerFilter) {
    // console.log(xhr.responseText);
    
    // parse JSON response
    let obj = JSON.parse(xhr.responseText);
    
    // check if data exists
    if (!obj || !obj.length) {
        document.querySelector("#status").innerHTML = "<b class='no-results'>No starships found</b>";
        return;
    }
    
    // store all starships
    allStarships = obj;
    
    // call 
    filteredResults = filterStarships(allStarships, searchTerm, filmFilter, classFilter, passengerFilter);
    
    // display results
    displayResults(filteredResults);
}

function filterStarships(starships, searchTerm, filmFilter, classFilter, passengerFilter) {
    return starships.filter(starship => {
        // filter by name
        if (searchTerm && !starship.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        
        // filter film
        if (filmFilter !== "all") {
            const filmURL = `https://swapi.info/api/films/${filmFilter}`;
            if (!starship.films.includes(filmURL)) {
                return false;
            }
        }
        
        // filter class
        if (classFilter !== "all") {
            if (!starship.starship_class.toLowerCase().includes(classFilter.toLowerCase())) {
                return false;
            }
        }
        
        // passanger filter
        if (passengerFilter !== "0") {
            const passengers = parseInt(starship.passengers.replace(/,/g, ""));
            const minPassengers = parseInt(passengerFilter);
            if (isNaN(passengers) || passengers < minPassengers) {
                return false;
            }
        }
        
        return true;
    });
}

function displayResults(results) {
    // check if there are no results
    if (results.length === 0) {
        document.querySelector("#status").innerHTML = "<b class='no-results'>No starships match your filters</b>";
        document.querySelector("#content").innerHTML = "";
        return;
    }
    
    // start building html string
    let bigString = "";
    
    // loop through results
    for (let i = 0; i < results.length; i++) {
        let starship = results[i];
        bigString += createStarshipCard(starship);
    }
    
    // update content
    document.querySelector("#content").innerHTML = bigString;
    
    // update status
    const filterText = displayTerm ? ` for '${displayTerm}'` : "";
    document.querySelector("#status").innerHTML = `<b>Found ${results.length} starship(s)${filterText}</b>`;
}

function createStarshipCard(starship) {
    // get film numbers
    const filmNumbers = starship.films.map(filmURL => {
        const match = filmURL.match(/\/(\d+)$/);
        return match ? match[1] : "";
    }).filter(num => num);
    
    // map them to film title
    const filmTitles = filmNumbers.map(num => getFilmTitle(num)).join(", ");
    
    // html card
    let card = `
        <div class="starship-card">
            <div class="starship-name">${starship.name}</div>
            <div class="starship-detail"><strong>Model:</strong> ${starship.model}</div>
            <div class="starship-detail"><strong>Class:</strong> ${starship.starship_class}</div>
            <div class="starship-detail"><strong>Manufacturer:</strong> ${starship.manufacturer}</div>
            <div class="starship-detail"><strong>Cost:</strong> ${formatCost(starship.cost_in_credits)} credits</div>
            <div class="starship-detail"><strong>Length:</strong> ${starship.length} meters</div>
            <div class="starship-detail"><strong>Crew:</strong> ${starship.crew}</div>
            <div class="starship-detail"><strong>Passengers:</strong> ${starship.passengers}</div>
            <div class="starship-detail"><strong>Max Speed:</strong> ${starship.max_atmosphering_speed}</div>
            <div class="starship-detail"><strong>Hyperdrive:</strong> ${starship.hyperdrive_rating}</div>
            <div class="starship-detail"><strong>Films:</strong> ${filmTitles || "None"}</div>
        </div>
    `;
    
    return card;
}

function getFilmTitle(filmNumber) {
    const filmTitles = {
        "1": "A New Hope",
        "2": "The Empire Strikes Back",
        "3": "Return of the Jedi",
        "4": "The Phantom Menace",
        "5": "Attack of the Clones",
        "6": "Revenge of the Sith",
    };
    
    return filmTitles[filmNumber] || "Unknown";
}

function formatCost(cost) {
    if (cost === "unknown" || !cost) {
        return "Unknown";
    }
    
    // Remove commas and parse as number
    const numCost = parseFloat(cost.replace(/,/g, ""));
    
    if (isNaN(numCost)) {
        return cost;
    }
    
    // Format with commas
    return numCost.toLocaleString();
}

function dataError(e) {
    // console.log("An error occurred loading data");
    document.querySelector("#status").innerHTML = "<b class='no-results'>Error loading starship data. Please try again.</b>";
}

// load from local storage
function loadSavedSearch() {
    const savedTerm = localStorage.getItem("starshipSearchTerm");
    const savedFilm = localStorage.getItem("starshipFilmFilter");
    const savedClass = localStorage.getItem("starshipClassFilter");
    const savedPassengers = localStorage.getItem("starshipPassengerFilter");
    
    if (savedTerm) {
        document.querySelector("#searchterm").value = savedTerm;
    }
    if (savedFilm) {
        document.querySelector("#filmFilter").value = savedFilm;
    }
    if (savedClass) {
        document.querySelector("#classFilter").value = savedClass;
    }
    if (savedPassengers) {
        document.querySelector("#passengerFilter").value = savedPassengers;
    }
}

// save to local storage
function saveSearchParameters(term, film, classType, passengers) {
    localStorage.setItem("starshipSearchTerm", term);
    localStorage.setItem("starshipFilmFilter", film);
    localStorage.setItem("starshipClassFilter", classType);
    localStorage.setItem("starshipPassengerFilter", passengers);
}
