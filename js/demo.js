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
        .setCount(3) // limit to 3 entries per type (actor, genre, producer, ...)
        .fillCount(true) // fill with results that don't directly match the query
        .advanced(true); // deeper query, including actor nicknames, porn downloads, ...
    
    // send the request and use the returned promise
    request.send().then(function(data) {
        console.log(data);
        renderApiRequest(request);
    }).catch(function(error) {
        console.log(error);
        Materialize.toast("Something went wrong", 5000);
        renderApiRequest(request);
    });
}

function renderApiRequest(request) {
    // update the JSON viewer
    $('.api-response').rainbowJSON({
        json: request.data,
        url: request.url
    });
}

function getRandomSearchQuery() {
    var queries = [
        "Nubiles",
        "Teen",
        "Virgin",
        "Angel",
        "Abby",
        "Black",
        "Cute",
        "Abby",
        "Beauty",
        "Alex",
        "Lisa"
    ];

    var lastQuery = $("#search").val();
    var newQuery = lastQuery;

    do {
        newQuery = queries[Math.floor(Math.random() * queries.length)];
    } while (newQuery == lastQuery);

    return newQuery;
}