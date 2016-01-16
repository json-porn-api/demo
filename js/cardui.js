var cardUi = function(){

	function log(message) {
		console.log("JSON Porn UI: " + message);
	}

	var ui = {
		apiKey: null,
		lastRequestTimestamp: -1
	};

	ui.generateCard = function() {
		var card = $("<div>", { "class": "card" })

		card.withImage = function(image) {
			if (card.find(".card-image").length > 0) {
				return card;
			}

			var imageContainer = $("<div>", { "class": "card-image" })
			imageContainer.append(image);
			imageContainer.prependTo(card);

			card.withImageRatio = function(ratio) {

				card.resizeImageContainer = function() {
					var imageContainer = card.find(".card-image");
					var currentImageContainerWidth = imageContainer.width();
					var currentImageContainerHeight = imageContainer.height();

					var desiredHeight = Math.ceil(currentImageContainerWidth / ratio);
					if (currentImageContainerHeight != desiredHeight) {
						imageContainer.height(desiredHeight);
					}

					card.fillImage();
				}

				card.fillImage = function() {
					function adjustImageDimensions(originalWidth, originalHeight) {
						var currentImageWidth = originalWidth;
						var currentImageHeight = originalHeight;

						var imageContainer = card.find(".card-image");
						var currentImageContainerWidth = imageContainer.width();
						var currentImageContainerHeight = imageContainer.height();

						var imageRatio = currentImageWidth / currentImageHeight;
						var imageContainerRatio = currentImageContainerWidth / currentImageContainerHeight;

						var marginTop = 0;
						var marginLeft = 0;

						if (imageRatio >= imageContainerRatio) {
							// fit height
							var newImageWidth = Math.ceil(currentImageContainerHeight * imageRatio);
							var newImageHeight = currentImageContainerHeight;
							marginLeft = (newImageWidth - currentImageContainerWidth) / 2;
						} else {
							// fit width
							var newImageWidth = currentImageContainerWidth;
							var newImageHeight = Math.ceil(currentImageContainerWidth / imageRatio);
							marginTop = 0 - (newImageHeight - currentImageContainerHeight) / 2
						}

						var imageElement = imageContainer.find("img");
						imageElement.width(newImageWidth);
						imageElement.height(newImageHeight);
						imageElement.css({
							"margin-left" : marginLeft + "px", 
							"margin-top" : marginTop + "px"
						});
						imageElement.attr("originalWidth", currentImageWidth);
						imageElement.attr("originalHeight", currentImageHeight);
					}

					var imageContainer = card.find(".card-image");
					var imageElement = imageContainer.find("img");

					if (imageElement.attr("originalWidth") != null && imageElement.attr("originalHeight") != null) {
						adjustImageDimensions(imageElement.attr("originalWidth"), imageElement.attr("originalHeight"));
					} else {
						var image = new Image();
						image.onload = function(){
							adjustImageDimensions(image.width, image.height);
						}
						image.src = imageElement.attr("src");
					}

					return card;
				}

				$(window).resize(card.resizeImageContainer);
			}

			

			return card;
		}

		card.withContent = function(content) {
			if (card.find(".card-content").length > 0) {
				return card;
			}

			var contentContainer = $("<div>", { "class": "card-content" })
			contentContainer.append(content);

			if (card.find(".card-image").length > 0) {
				contentContainer.insertAfter(card.find(".card-image"));
			} else if (card.find(".card-action").length > 0) {
				contentContainer.insertBefore(card.find(".card-action"));
			} else {
				contentContainer.appendTo(card);
			}

			return card;
		}

		card.withActions = function(actions) {
			if (card.find(".card-action").length > 0) {
				return card;
			}
			
			var actionsContainer = $("<div>", { "class": "card-action" })
			actionsContainer.append(actions)

			actionsContainer.appendTo(card);

			return card;
		}

		card.renderIn = function(container) {
			container.html(card);
			window.setTimeout(function() {
				card.resizeImageContainer();
			}, 1);
		}

		return card;
	}

	ui.generateActorCard = function(actor) {
		var card = ui.generateCard()

		if (actor.imageKeyIds != null && actor.imageKeyIds.length > 0) {
			var imageWidth = Math.min(500, $(window).width() / 2);
			var imageSrc = jsonPorn.getResizedImageUrlById(actor.imageKeyIds[0], imageWidth);
			var image = $("<img>", { "src": imageSrc });
			card.withImage(image);
			card.withImageRatio(3/4);
		}

		var content = $("<p>").html(actor.name);
		card.withContent(content);
		
		//var action = $("<a>", { "href": "images/logo.jpg" }).html("Action");
		//card.withActions(action);

		return card;
	}

	return ui;
}();

//$.fn.cardUi = cardUi;