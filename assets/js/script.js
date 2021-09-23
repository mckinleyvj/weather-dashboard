var $searchFrmEl = $('#search-form');
var $searchTxtEl = $('#search-text');
var $searchBtnEl = $('#search-button');

var $searchInputTxt;

function getCityName(event) {
    event.preventDefault();

    $searchInputTxt = $searchTxtEl.val().trim();
    console.log($searchInputTxt);

    getWeatherAPI($searchInputTxt);


    $($searchTxtEl).val('');
}

function getWeatherAPI(city) {
    APIKey = "467952e5cf21b6ecbc8d9a89b3ec05b9";
    APIUrl = "api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
}


$($searchFrmEl).on('submit', getCityName);

    