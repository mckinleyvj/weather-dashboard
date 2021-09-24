// HTML ELEMENTS
var $searchFrmEl = $('#search-form');
var $searchTxtEl = $('#search-input');
var $searchBtnEl = $('#search-button');
var $resultCtnEl = $('#result-content');
var errorLblEl;

// INPUT ELEMENTS VARIABLES
var $searchInputTxt;
var $cityResultEl;

function handleSearch(event) {
    event.preventDefault();

    //lets get the value of the text input
    $searchInputTxt = $searchTxtEl.val().trim();
    //console.log($searchInputTxt);

    //if empty, return
    if (!$searchInputTxt) {

        console.log("Error: Input string not found.");

        if (errorLblEl) {
            errorLblEl.remove();
        }        

        errorLblEl = $('<label>')
            .attr('type', 'text')
            .addClass('custom-error')
            .append('*Error: Please enter a value');

        $searchFrmEl.append(errorLblEl);

        $($searchTxtEl.focus());
        return;
    }

    if (errorLblEl) {
        errorLblEl.remove();
    }
    getWeatherAPI($searchInputTxt);

    $($searchTxtEl).val('');
}

function getWeatherAPI(city) {
    var APIKey = "467952e5cf21b6ecbc8d9a89b3ec05b9";
    var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

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
    //CREATE SEARCH RESULT HEADER ELEMENTS
    $cityResultEl = $('<h5>')
        .addClass('text-uppercase px-2 border border-2')
        .append($cityName);

    var $cityDate = $('<i>')
        .addClass('custom-text')
        .append(' [' + $cityDate + '] ');
    
    var $weatherIconEl = $('<img>')
        .attr('src', $weatherIcon);

    var $cd = $cityResultEl.append($cityDate);
    $cd.append($weatherIconEl);

    //CREATE CITY WEATHER ELEMENTS




    // Append elements to main result container
    $resultCtnEl.append($cd);
    

}

$($searchFrmEl).on('submit', handleSearch);

    