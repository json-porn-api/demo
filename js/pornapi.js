var jsonPorn = function(){

	// Website (for displaying links)
	var HOST_JSON_PORN = "http://json-porn.com/";

	// Mashape (for API requests)
	var MASHAPE_VERSION = 1;
	var HOST_MASHAPE = "https://steppschuh-json-porn-v" + MASHAPE_VERSION + ".p.mashape.com/";
	
	// App Engine (serves through Mashape proxy)
	var APP_ENGINE_VERSION = 3;
	var HOST_APP_ENGINE = "http://" + APP_ENGINE_VERSION + "-dot-winged-octagon-86816.appspot.com/";

	// Request endpoints
	var ENDPOINT_API = HOST_MASHAPE;
	var ENDPOINT_SEARCH = ENDPOINT_API + "search/";

	function log(message) {
		console.log("JSON Porn API: " + message);
	}

	var api = {
		apiKey: null,
		lastRequestTimestamp: -1
	};

	api.setApiKey = function(apiKey) {
		api.apiKey = apiKey;
	}

	api.request = function(endpoint) {
		var request = {};

		request.endpoint = endpoint;

		request.addParameters = function(params) {
			for (var i = 0; i < params.length; i++) {
				request.addParameter(params[i]);
			}
			return request;
		}

		request.addParameter = function(key, value) {
			if (request.params == null) {
				request.params = [];
			}

			// type-check the passed argument
			var param;
			if (typeof key == 'string') {
				param = [key, value];
			} else {
				param = key;
			}

			// make sure that key & value are not null
			if (param == null || param[0] == null || param[1] == null) {
				return request;
			}

			// avoid dublicate keys
			for (var i = 0; i < request.params.length; i++) {
				if (request.params[i][0] == param[0]) {
					//log("Overwriting dublicate parameter: " + request.params[i][0]);
					request.params.splice(i, 1);
				}
			}

			request.params.push(param);
			return request;
		}

		request.setCount = function(value) {
			return request.addParameter("count", value);
		}

		request.setOffset = function(value) {
			return request.addParameter("offset", value);
		}

		request.onSuccess = function(callback) {
			request.onSuccessCallback = callback;
			return request;
		}

		request.onError = function(callback) {
			request.onErrorCallback = callback;
			return request;
		}

		request.buildRequestUrl = function() {
			var requestUrl = request.endpoint;
			if (request.params) {
				requestUrl += "?";
				for (var i = 0; i < request.params.length; i++) {
					requestUrl += request.params[i][0] + "=" + encodeURIComponent(request.params[i][1]) + "&";
				}
				requestUrl = requestUrl.substring(0, requestUrl.length - 1);
			}
			return requestUrl;
		}

		request.send = function() {
			request.url = request.buildRequestUrl();
			return api.sendRequest(request);
		}

		request.reload = function() {
			if (request.data != null && request.onSuccessCallback != null) {
				request.onSuccessCallback(request.data);
				return request;
			} else {
				return request.send();
			}
		}
		
		return request;
	}

	api.sendRequest = function(request) {
		var promise = new Promise(function(resolve, reject) {
			if (api.apiKey == null) {
				reject("API key is not set.");
				return;
			}
			if (request.completed != null && !request.completed) {
				reject("Previous request has not completed yet.");
				return;
			}
			$.ajax({
				url : request.url,
				type : 'GET',
				dataType : 'json',
				beforeSend : function(xhr) {
					log("Requesting: " + request.url);
					request.completed = false;
					lastRequestTimestamp = (new Date()).getTime();
					xhr.setRequestHeader("X-Mashape-Authorization", api.apiKey);
				},
				success : function(data) {
					request.data = data;
					// check if the API returned a valid response
					if (data.statusCode != null && data.statusCode == 200) {
						// looks good
						if (request.onSuccessCallback != null) {
							request.onSuccessCallback(data);
						}
						resolve(data);
					} else {
						// something went wrong, try to extract error message
						if (data.statusMessage != null) {
							this.error(data.statusMessage);
						} else {
							this.error("Request didn't return a valid response: " + data);
						}
					}
				},
				error : function(error) {
					request.error = error;

					if (typeof error == 'string') {
						log(error);
						request.data = "{ \"error\": \"" + error + "\" }";
					} else {
						log(error.responseText);
						request.data = error.responseJSON;
					}

					if (request.onErrorCallback != null) {
						request.onErrorCallback(error);
					}
					reject(error);
				},
				complete : function (){
					request.completed = true;
				}
			});
		});
		return promise;
	}

	api.searchByQuery = function(query) {
		var request = api.request(ENDPOINT_SEARCH);
		request.addParameter("q", query);

		request.advanced = function(value) {
			// performs a deeper query, also looking for actor nicknames
			// and including download links for porn entries
			request.addParameter("advanced", query);
			return request;
		}

		request.fillCount = function(value) {
			// tries to add results until the desired count is reached,
			// even if they don't directly match the query
			request.addParameter("fill", query);
			return request;
		}

		return request;
	}

	return api;
}();