(function($){
    $(function(){

        $('.button-collapse').sideNav();
        $('.api-response').rainbowJSON();
        $('ul.tabs').tabs();
        
    }); // end of document ready
})(jQuery); // end of jQuery name space


function getUrlParam(key) {
    return getUrlParams()[key];
}

function getUrlParams() {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query)) {
       urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
}