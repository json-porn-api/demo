// CAUTION: This api key will be invalidated in random intervals.
// Get a free api key for your own project from: https://market.mashape.com/steppschuh/json-porn
var DEMO_API_KEY = "yr5GZAQe5DmshVbMYpWvI2yXAk9Qp1fY3cAjsnbQumq1kB7jhL";

(function($){
    $(function(){

        setupPornApi();
        setupSearchBar();
        requestRandomSearchResult();

    }); // end of document ready
})(jQuery); // end of jQuery name space

function setupPornApi() {
    var apiKey = getUrlParam("apiKey");
    if (apiKey == null) {
        console.log("CAUTION: Using demo API key. This key will be invalidated in random intervals. " + 
            "Get a free api key for your own project from: https://market.mashape.com/steppschuh/json-porn");
        apiKey = DEMO_API_KEY;
    }
    jsonPorn.setApiKey(apiKey);
}

function setupSearchBar() {
    var searchBar = $("#search");
    searchBar.keyup(function(event){
        if(event.keyCode == 13){
            event.preventDefault();
            onSearchBarValueSubmitted();
        }
    });
    searchBar.on('input', onSearchBarValueChanged);
    searchBar.on('change', onSearchBarValueSubmitted);
}

function requestRandomSearchResult() {
    // get a random query string
    var query = getRandomSearchQuery();

    // update the search bar value
    $("#search").val(query);

    // perform API request
    requestSearchResult(query);
}

function onSearchBarValueChanged() {
    // TODO: implement auto-completion
}

function onSearchBarValueSubmitted() {
    var query = $("#search").val();
    requestSearchResult(query);
}

function requestSearchResult(query) {
    // create an API request object
    var request = jsonPorn.searchByQuery(query)
        .setCount(4) // limit to 4 entries per type (actor, genre, producer, ...)
        .fillCount(true) // fill with results that don't directly match the query
        .advanced(true); // deeper query, including actor nicknames, porn downloads, ...
    
    // send the request and use the returned promise
    request.send().then(function(data) {
        console.log(data);
        renderApiRequest(request);
        renderApiResponse(data);
    }).catch(function(error) {
        console.log(error);
        Materialize.toast("Something went wrong", 5000);
        renderApiRequest(request);
    });

    // prepare result wrapper
    $("#actor-entries").empty();
}

function renderApiRequest(request) {
    // update the JSON viewer
    $('.api-response').rainbowJSON({
        json: request.data,
        url: request.url
    });
}

function renderApiResponse(response) {
    $("#actor-entries").empty();

    // add cards for the returned entries
    var actors = jsonPorn.getActorsFromResponse(response);
    for (var i = 0; i < actors.length; i++) {
        try {
            // create a card
            var card = cardUi.generateActorCard(actors[i]);

            // create a div that wraps the actor card
            var cardWrapper = $("<div>", { "class": "col s6 m3 l3" });

            // render the card in the wrapper
            card.renderIn(cardWrapper);

            // add the wrapper to the actor container
            $("#actor-entries").append(cardWrapper)
        } catch (ex) {
            console.log("Unable to render actor");
            console.log(ex);
        }
    }

    
}

function getRandomSearchQuery() {
    var queries = [
        "Nubiles", "Teen", "Virgin", "Angel", "Abby",
        "Grey", "Lexi", "Allie", "Vanessa", "Sandy",
        "Love", "Abby", "Alex", "Lisa", "Amy"
    ];

    var lastQuery = $("#search").val();
    var newQuery = lastQuery;

    do {
        newQuery = queries[Math.floor(Math.random() * queries.length)];
    } while (newQuery == lastQuery);

    return newQuery;
}