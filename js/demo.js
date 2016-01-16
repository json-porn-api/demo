(function($){
    $(function(){

        setupPornApi();
        setupSearchBar();
        requestRandomSearchResult();

    }); // end of document ready
})(jQuery); // end of jQuery name space

function setupPornApi() {
    var apiKey = getUrlParam("apiKey");
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
        .setCount(3) // limit to 3 entries per type (actor, genre, ...)
        .onSuccess(function(data) {
            // optional: handle data here or in promise
        })
        .onError(function(error) {
            // optional: handle error here or in promise
        });
    
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
        "Anal",
        "Black",
        "Cute",
        "Abby",
        "Beauty",
        "Red",
        "Alex",
        "Cock"
    ];

    var lastQuery = $("#search").val();
    var newQuery = lastQuery;

    do {
        newQuery = queries[Math.floor(Math.random() * queries.length)];
    } while (newQuery === lastQuery);

    return newQuery;
}