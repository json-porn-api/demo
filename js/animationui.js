var animationUi = function(){

    var DEFAULT_FADE_DURATION = 500;

    function log(message) {
        console.log("Animation UI: " + message);
    }

    var ui = {};

    ui.fadeIn = function(element) {
        element.css({opacity: 0});
        $(element).velocity({opacity: 1}, {
            duration: DEFAULT_FADE_DURATION,
            queue: false,
            easing: 'easeOutSine'
          });
        $(element).velocity({opacity: 1}, {
            duration: DEFAULT_FADE_DURATION * 2,
            queue: false,
            easing: 'swing',
            step: function(now, fx) {
                fx.start = 100;
                var grayscale_setting = now/100;
                var brightness_setting = 150 - (100 - now)/1.75;

                if (brightness_setting < 100) {
                    brightness_setting = 100;
                }
                if (now >= 0) {
                    $(this).css({
                        "-webkit-filter": "grayscale("+grayscale_setting+")" + "brightness("+brightness_setting+"%)",
                        "filter": "grayscale("+grayscale_setting+")" + "brightness("+brightness_setting+"%)"
                    });
                }
            }
        });
    }

    return ui;
}();

//$.fn.cardUi = cardUi;