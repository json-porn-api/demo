# JSON Porn API
The JSON Porn API will serve movies, clips, picture galleries and siterips of adult content. Be it through streams, torrents or direct downloads from well known file hosters. [Learn more](http://json-porn.com).

## Demo website
This repository serves a sample website that shows how the API can be used. May not be safe for work.
Live version: http://json-porn-api.github.io/demo/

![Demo website screenshot](http://json-porn-api.github.io/demo/images/github_cover.jpg "Demo website screenshot")

## API Usage
You can call the API directly as specified in the [documentation](https://market.mashape.com/steppschuh/json-porn), but you can also use the handy JavaScript library ([pornapi.js](https://github.com/json-porn-api/demo/blob/gh-pages/js/pornapi.js)) included in this repository.

### Using the JS lib
#### Setup
Include the script in your HTML. Feel free download the file or hotlink the file hosted on here.
```HTML
<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="http://json-porn-api.github.io/demo/js/pornapi.js"></script>
```
Make sure that you've set your Mashape API key before sending requests. You can get a free one [here](https://market.mashape.com/steppschuh/json-porn/pricing).
```JavaScript
var apiKey = getUrlParam("apiKey");
jsonPorn.setApiKey(apiKey);
```

#### Creating requests
Use the `jsonPorn.request(endpoint)` function to get a request object that you can later pass to the API. Commonly used parameters like `count` or `offset` have their own setters. You can specify additional parameters using the `request.addParameter(key, value)` function. Method chaining is supported.
```JavaScript
var request = jsonPorn.request(ENDPOINT_API + "search/")
  .addParameter("q", "Housewife")
  .setCount(10);
```
Commonly used requests can also be created through convenience functions. The requests below returns the same result as the requests above.
```JavaScript
var request = jsonPorn.searchByQuery("Housewife")
  .setCount(10)
```

#### Sending requests
The `request.send()` function invokes an [AJAX](https://en.wikipedia.org/wiki/Ajax_(programming)) request and returns a [promise](https://www.promisejs.org/) object. You can use that promise to handle the returned result or error.
```JavaScript
request.send().then(function(data) {
  console.log(data);
}).catch(function(error) {
  console.log(error);
});
```
If you don't want to work with promises, use set a `request.onSuccess(callback)` and `request.onError(callback)` and pass a function that deals with the result.
```JavaScript
request.onSuccess(function(data) {
  console.log(data);
}).onError(function(error) {
  console.log(error);
});
request.send():
```

#### Handling responses
Each valid request will return a JSON object structured like this:
```JSON
{
  "statusCode": 200,
  "statusMessage": "OK",
  "lastUpdated": 1453027213052,
  "content": []
}
```
Key | Value | Comment
--- | --- | ---
statusCode | HTTP Status Code | If not 200, check statusMessage
statusMessage | String | Holds "OK" or an error message
lastUpdated | Timestamp | Indicates when the response was generated
content | JSON Array | Holds the response objects, if any

> Note about the `lastUpdated` timestamp: A response might have been generated before you've sent your request, because the API returned a cached response. To force a new response, call `request.invalidateCache(true)` before sending your request. Cache control will be ignored for requests from free users, though.

## Create stuff
If you're missing some endpoints or features, please request them. I'd love to hear about whatever you build using the API, so feel free to [get in touch](http://steppschuh.net).
