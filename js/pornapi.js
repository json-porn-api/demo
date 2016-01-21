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
	var ENDPOINT_ACTORS = ENDPOINT_API + "actors/";
	var ENDPOINT_PORN = ENDPOINT_API + "porn/";
	var ENDPOINT_PRODUCERS = ENDPOINT_API + "producer/";
	var ENDPOINT_IMAGE = HOST_JSON_PORN + "image/";

	// Entry types
	var ENTRY_TYPE_ACTOR = 1;
	var ENTRY_TYPE_PORN = 2;
	var ENTRY_TYPE_DOWNLOAD = 4;
	var ENTRY_TYPE_PRODUCER = 5;
	var ENTRY_TYPE_GENRE = 6;
	var ENTRY_TYPE_HOSTER = 8;

	// Porn types
	var PORN_TYPE_UNKNOWN = 1;
	var PORN_TYPE_CLIP = 2;
	var PORN_TYPE_PHOTOS = 3;
	var PORN_TYPE_FULL_MOVIE = 4;

	// Download types
	var DOWNLOAD_TYPE_UNKNOWN = 1;
	var DOWNLOAD_TYPE_STREAM = 2;
	var DOWNLOAD_TYPE_TORRENT = 3;
	var DOWNLOAD_TYPE_FILE = 4;

	function log(message) {
		console.log("JSON Porn API: " + message);
	}

	var api = {
		apiKey: null,
		lastRequestTimestamp: -1,
	};

	api.setApiKey = function(apiKey) {
		api.apiKey = apiKey;
	}

	/*
		Requests
	*/
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

		request.invalidateCache = function(value) {
			return request.addParameter("invalidateCache", value);
		}

		request.setCount = function(value) {
			return request.addParameter("count", value);
		}

		request.setOffset = function(value) {
			return request.addParameter("offset", value);
		}

		request.includeDownloads = function(value) {
			return request.addParameter("includeDownloads", value);
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

	/*
		Endpoints
	*/
	api.searchByQuery = function(query) {
		var request = api.request(ENDPOINT_SEARCH);
		request.addParameter("q", query);

		request.advanced = function(value) {
			// performs a deeper query, also looking for actor nicknames
			// and including download links for porn entries
			request.addParameter("advanced", value);
			return request;
		}

		request.fillCount = function(value) {
			// tries to add results until the desired count is reached,
			// even if they don't directly match the query
			request.addParameter("fill", value);
			return request;
		}

		return request;
	}

	api.getPorn = function() {
		var request = api.request(ENDPOINT_PORN);

		request.withEntryId = function(value) {
			request.addParameter("entryId", value);
			return request;
		}

		request.withProducerId = function(value) {
			request.addParameter("producerId", value);
			return request;
		}

		return request;
	}

	api.getActros = function() {
		var request = api.request(ENDPOINT_ACTORS);

		request.withEntryId = function(value) {
			request.addParameter("actorId", value);
			return request;
		}

		request.withName = function(value) {
			request.addParameter("actorName", value);
			return request;
		}

		return request;
	}

	api.getProducers = function() {
		var request = api.request(ENDPOINT_PRODUCERS);

		request.withEntryId = function(value) {
			request.addParameter("producerId", value);
			return request;
		}

		request.withName = function(value) {
			request.addParameter("producerName", value);
			return request;
		}

		request.sortByDate = function() {
			request.addParameter("sort", "date");
			return request;
		}

		request.sortByEntryCount = function() {
			request.addParameter("sort", "count");
			return request;
		}

		request.sortByName = function() {
			request.addParameter("sort", "alphabetical");
			return request;
		}

		return request;
	}

	/*
		Response helper
	*/
	api.getEntriesFromResponse = function(data, entryType) {
		var entries = [];

		if (data == null || data.content == null) {
			return entries;
		}

		var responseEntries = data.content;

		for (var i = 0; i < responseEntries.length; i++) {
			var entry = responseEntries[i];
			if (entry.entryType == entryType) {
				entries.push(entry);
			}
		}

		return entries;
	}

	api.getActorsFromResponse = function(data) {
		return api.getEntriesFromResponse(data, ENTRY_TYPE_ACTOR);
	}

	api.getPornFromResponse = function(data) {
		return api.getEntriesFromResponse(data, ENTRY_TYPE_PORN);
	}

	api.getProducersFromResponse = function(data) {
		return api.getEntriesFromResponse(data, ENTRY_TYPE_PRODUCER);
	}

	api.getGenresFromResponse = function(data) {
		return api.getEntriesFromResponse(data, ENTRY_TYPE_GENRE);
	}

	/*
		Porn helper
	*/
	api.filterPorn = function(porn) {
		var filter = {};

		filter.byPornType = function(pornType) {
			var entries = [];
			if (porn == null) {
				return entries;
			}
			for (var i = 0; i < porn.length; i++) {
				var entry = porn[i];
				if (entry.pornType == pornType) {
					entries.push(entry);
				}
			}
			return entries;
		}

		filter.getClips = function() {
			return filter.byPornType(PORN_TYPE_CLIP);
		}

		filter.getFullMovies = function() {
			return filter.byPornType(PORN_TYPE_FULL_MOVIE);
		}

		filter.getImageSets = function() {
			return filter.byPornType(PORN_TYPE_PHOTOS);
		}

		filter.byDownloadType = function(downloadType) {
			var entries = [];
			if (porn == null) {
				return entries;
			}
			for (var i = 0; i < porn.length; i++) {
				var entry = porn[i];
				if (entry.downloads == null || entry.downloads.length == 0) {
					continue;
				}
				if (entry.downloads[0].downloadType == downloadType) {
					entries.push(entry);
				}
			}
			return entries;
		}

		filter.getFiles = function() {
			return filter.byDownloadType(DOWNLOAD_TYPE_FILE);
		}

		filter.getStreams = function() {
			return filter.byDownloadType(DOWNLOAD_TYPE_STREAM);
		}

		filter.getTorrents = function() {
			return filter.byDownloadType(DOWNLOAD_TYPE_TORRENT);
		}

		return filter;
	}

	/*
		Convenience helper
	*/
	api.getImageUrlById = function(imageKeyId) {
		return api.getResizedImageUrlById(imageKeyId, "original");
	}

	api.getResizedImageUrlById = function(imageKeyId, size) {
		return ENDPOINT_IMAGE + imageKeyId + "/" + size + ".jpg";
	}

	return api;
}();