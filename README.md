# JSON Porn API
The JSON Porn API will serve movies, clips, picture galleries and siterips of adult content. Be it through streams, torrents or direct downloads from well known file hosters. [Learn more](http://json-porn.com).

## Demo website
This repository serves a sample website that shows how the API can be used. You can try it out at:
http://json-porn-api.github.io/demo/

## API Usage
You can call the API directly as specified in the [documentation](https://market.mashape.com/steppschuh/json-porn), but you can also use the handy JavaScript library ([pornapi.js](https://github.com/json-porn-api/demo/blob/gh-pages/js/pornapi.js)) included in this repository.

### Using the JS lib
#### Setup
Include the script in your HTML. Feel free download the file or hotlink the file hosted on here.
```HTML
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
Commonly used requests can also be created through convenience functions. The requests below returns the sme result as the requests above.
```JavaScript
var request = jsonPorn.searchByQuery("Housewife")
  .setCount(10)
```
