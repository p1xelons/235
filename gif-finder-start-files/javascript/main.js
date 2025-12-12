    // 1
  	window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
	// 2
	let displayTerm = "";
	
	// 3
	function searchButtonClicked(){
		console.log("searchButtonClicked() called");
		
        // 1
        const GIPHYY_URL = "https://api.giphy.com/v1/gifs/search?";

        // 2
        // public api
        let GIPHY_KEY = "mAIuVSGxyW83Lu7zNAfahzkhDs6m3iW3";

        // 3 build url
        let url = GIPHYY_URL;
        url += "api_key=" + GIPHY_KEY;

        // parse document for search
        let term = document.querySelector("#searchterm").value;
        displayTerm = term;

        // 5 get rid of leeading/trailing space
        term = term.trim();

        // 6 encode spaced
        term = encodeURIComponent(term);

        // 7 bail out of function if error
        if (term.length < 1) return;

        // 8 append search term to url
        url += "&q=" + term;

        // 9 grab user chosen serach
        let limit = document.querySelector("#limit").value;
        url += "&limit=" + limit;

        // 10 update ui
        document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

        // 11 see url
        console.log(url);

        // 12 Request data!
        getData(url);
	}

    function getData(url) {
        // 1 create XHR object
        let xhr = new XMLHttpRequest();

        // set onload handler
        xhr.onload = dataLoaded;

        // set on error handler
        xhr.onerror = dataError;

        // 4 open connectino and get request
        xhr.open("GET", url);
        xhr.send();
    }

    function dataLoaded(e) {
        // event target is xhr
        let xhr = e.target;

        // log
        console.log(xhr.responseText);

        // turn text into JS object
        let obj = JSON.parse(xhr.responseText);

        // 8 if no results, return
        if (!obj.data || obj.data.length == 0) {
            document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
            return;
        }

        // build html strin
        let results = obj.data;
        console.log("results.length = " + results.length);
        let bigString = "";

        // loop through array of results
        for (let i=0;i<results.length;i++) {
            let result = results[i];

            // get url for gif
            let smallURL = result.images.fixed_width_downsampled.url;
            if (!smallURL) smallURL = "images/no-image-found.png";

            // get url to giphy page
            let url = result.url;

            let rating = (result.rating ? result.rating : "NA").toUpperCase();

            // build div for result
            let line = "<div class='result'>";
            line += "<image src='${smallURL}' title='${result.id}' />";
            line += "<span><a target='_blank' href='${url}'>View on Giphy</a>";
            line += "<p>Rating: " + rating + "</span>";
            line += "</div>";

            // add div to big string
            bigString += line;

            // show to user
            document.querySelector("#content").innerHTML = bigString;

            // update status
            document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + "results for '" + displayTerm + "'</i></p>"
        }
    }

    function dataError(e) {
        console.log("An error occured");
    }