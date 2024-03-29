function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview image as background
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    cityStr = cityStr.slice(0, 1).toUpperCase() + cityStr.slice(1);
    var address = streetStr + ', ' + cityStr;
    $greeting.text("So, you want to live at " + address + "?");
    var imgUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $body.append('<img class="bgimg" src="' + imgUrl + '">');

    // load NYT articles, searching for City as keyword
    var searchStr = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&api-key=52562f2f953bb8964d949fc0f6263c34%3A1%3A67333739';
    $.getJSON(searchStr, function(data){
        var articleList = data.response.docs;
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        var newArticle;
        for (var i = 0, len = articleList.length; i < len; i++) {
            var article = articleList[i];
            newArticle = '<li class ="article">' + '<a href = "' + article.web_url + '">' + article.headline.main + '</a>' + '</li>' + '<p>' + article.snippet + '</p>';
            $nytElem.append(newArticle);
        }
    }).error(function() {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr + ' Failed to Load');
    });

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Failed to get Wikipedia resources');
    }, 8000);

    var ajaxUrl = 'https://en.wikipedia.org//w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallBack';
    // load Wikipedia article
    $.ajax( {
        url: ajaxUrl,
        dataType: 'jsonp',
        success: function(data) {
           var wikiTitles = data[1];
           for (var i = 0, len = wikiTitles.length; i < len; i++) {
                var wikiStr = wikiTitles[i];
                var wikiUrl = 'https://en.wikipedia.org/wiki/' + wikiStr;
                var newWiki = '<ul id="wikipedia-links"><a href = "' + wikiUrl + '">' + wikiStr + '</a></ul>';
                $wikiElem.append(newWiki);
           }
           clearTimeout(wikiRequestTimeout);
    }
} );
    return false;
}



$('#form-container').submit(loadData);