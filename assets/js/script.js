var $searchFrmEl = $('#search-form');
var $searchTxtEl = $('#search-input');
var $searchBtnEl = $('#search-button');

var $resultCtnEl = $('#result-content');

var $cityResultEl;

var $searchInputTxt;

function getCityName(event) {
    event.preventDefault();

    $searchInputTxt = $searchTxtEl.val().trim();
    console.log($searchInputTxt);

    if (!$searchInputTxt) {
        return;
    }

    getWeatherAPI($searchInputTxt);

    $($searchTxtEl).val('');
}

function getWeatherAPI(city) {
    var APIKey = "467952e5cf21b6ecbc8d9a89b3ec05b9";
    var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    // https://api.openweathermap.org/data/2.5/weather?q=Brunei&appid=467952e5cf21b6ecbc8d9a89b3ec05b9

    fetch(APIUrl)
        .then(function (response) {
            //console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayData(data);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function displayData(info) {
    
    var $cityName = info.name;
    var $cityDate = moment(info.dt,"X").format("DD/MM/YYYY");
    var $weatherIcon;

    for (i=0;i<info.weather.length;i++) {
        $weatherIcon = 'http://openweathermap.org/img/wn/' + info.weather[i].icon + '.png';
    }

    console.log($weatherIcon);
    console.log($cityName);
    console.log($cityDate);


    $cityResultEl = $('<h5>')
        .addClass('text-uppercase px-2 border border-2')
        .append($cityName);

    var $cityDate = $('<i>')
        .append(' [' + $cityDate + '] ');
    
    var $weatherIconEl = $('<img>')
        // .attr('width', '50')
        // .attr('height', '50')
        .attr('src', $weatherIcon);


    var $cd = $cityResultEl.append($cityDate);
    $cd.append($weatherIconEl);

    //$resultCtnEl
    //    .attr('style','background-color: gray;')
    $resultCtnEl.append($cd);
    

}

$($searchFrmEl).on('submit', getCityName);

    