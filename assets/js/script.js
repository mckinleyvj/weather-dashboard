// HTML ELEMENTS
var $histContEl = $('#history-container');
var $searchContEl = $('#search-container');

var $searchFrmEl = $('#search-form');
var $searchTxtEl = $('#search-input');
var $searchBtnEl = $('#search-button');
var $resultCtnEl = $('#result-content');
var $fivedayCtnEl = $('#five-day-content');
var $errorLblEl;
var $cityResultEl;
var $cityHistLi;
var $liBtn;

var $linebreak = '<br>';

// INPUT ELEMENTS VARIABLES
var searchInputTxt;

// GLOBAL VARIABLES
var APIKey = "467952e5cf21b6ecbc8d9a89b3ec05b9";
var UoM;
var temp_unit;
var speed_unit;
var latitude;
var longtitude;

// STORAGE VARIABLES
var arrHistSearch = [];
var storedHist;

// STORAGE FUNCTIONS
function storeData() {
    localStorage.setItem(
        "search_history", JSON.stringify(arrHistSearch)
    );
}

function saveHistory(inpt) {
    
    var dt_inpt = inpt;
    for (i=0;i<arrHistSearch.length;i++) {
        if (arrHistSearch[i].includes(dt_inpt)) {
            //if the data exists, do nothing
            return;
        }
    }
    //if none of the input matches with any existing items in array, push as new item
    arrHistSearch.push(dt_inpt);

    storeData();
}

function loadHistory() {
    storedHist = JSON.parse(localStorage.getItem("search_history"));

    if (storedHist !== null) {
        var arrUnsorted = [];
        for (var j=0;j<storedHist.length;j++) {
            arrUnsorted.push(storedHist[j]);
        }
        arrHistSearch = arrUnsorted;
    }else {
        return;
    }
}
// WEATHER APIs
function getWeatherAPI(city) {

    //Current Weather Data API
    var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=" + UoM;

    fetch(APIUrl, {
        credentials: "same-origin",
        referrerPolicy: "same-origin",
      })
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            saveHistory(data.name + ', ' + (data.sys.country).toUpperCase());
            displaySearchResult(data);
            getCurrWeatherAPI(data);
            displayHistEl();
            return;
        })
        .catch(function (err) {
            alert("Error: City not found.\n" + err.message);
        });
}

function getCurrWeatherAPI(stats) {
    latitude = stats.coord.lat;
    longtitude = stats.coord.lon;
    //var exclusions = "minutely,hourly,daily,alerts";
    var exclusions = "minutely,hourly,alerts";

    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longtitude + "&exclude="+ exclusions + "&appid=" + APIKey + "&units=" + UoM;

    fetch(requestURL, {
        credentials: "same-origin",
        referrerPolicy: "same-origin",
    })
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();           
        })
        .then(function(dt) {
            console.log(dt);
            displayWeatherContents(dt);
            getFiveDayWeatherAPI(dt);
            return;
        })
        .catch(function (err) {
            alert("Error: Something went wrong. Redo search.\n" + err.message);
        });
}

// DISPLAY ELEMENTS
function displaySearchResult(info) {
    
    //clear the result content first
    $resultCtnEl.text('');

    var cityName = info.name + ', ' + (info.sys.country).toUpperCase();
    var currentDate = moment(info.dt,"X").format("DD/MM/YYYY");
    //enhancement - show day
    var currentDay = moment(currentDate, "DD/MM/YYYY").format("dddd");
    var weatherIconURL = 'https://openweathermap.org/img/wn/' + info.weather[0].icon + '.png';
    
    //CREATE SEARCH RESULT HEADER ELEMENTS
    $cityResultEl = $('<h5>')
        .addClass('text-uppercase fw-bold px-2 text-white custom-bg border-bottom rounded-3')
        .append(cityName);

    $cityDate = $('<i>')
        .addClass('custom-text')
        .append(' [ ' + currentDay + ', ' + currentDate + ' ] ');
    
    $weatherIconEl = $('<img>')
        .attr('alt', 'Icon of current weather')
        .attr('src', weatherIconURL);

    var $cd = $cityResultEl.append($cityDate);
    $cd.append($weatherIconEl);

    // Append elements to main result container
    $resultCtnEl.addClass('text-dark');
    $resultCtnEl.append($cd);
}

function displayWeatherContents(i) {
    var currTemp = i.current.temp;
    var windSpd = i.current.wind_speed;
    var humidity = i.current.humidity;
    var UVIndex = i.current.uvi;
    var UVStatus;

    if (UVIndex < 6) {
        UVStatus = "p-1 mb-0 bg-success text-white rounded-3";
    }else if (UVIndex >= 6 && UVIndex <= 8) {
        UVStatus = "p-1 mb-0 bg-warning text-dark rounded-3";
    }else if (UVIndex >= 8) {
        UVStatus = "p-1 mb-0 bg-danger text-white rounded-3";
    }

    $statsTemp = $('<p>')
        .addClass('px-2 mb-1 fw-bold')
        .append('Temperature :&emsp;' + currTemp + " " + temp_unit);

    $statsWindSpd = $('<p>')
        .addClass('px-2 mb-1 fw-bold')
        .append('Wind :&emsp;' + windSpd + " " + speed_unit);

    $statsHumid = $('<p>')
        .addClass('px-2 mb-1 fw-bold')
        .append('Humidity :&emsp;' + humidity + " %");

    $UVBg = $('<span>')
        .addClass(UVStatus)
        .append(UVIndex);

    $statsUV = $('<p>')
        .addClass('px-2 mb-1 fw-bold')
        .append('UV Index :&emsp;');

    $statsUV.append($UVBg);

    $resultCtnEl.append($statsTemp,$statsWindSpd,$statsHumid,$statsUV);
    
}

function getFiveDayWeatherAPI(forecast) {

    $fivedayCtnEl.text('');
    $($inner_card_row).text('');

    var $main_card = $('<h5>')
        .addClass('text-uppercase fw-bold px-2 text-white align-middle border-bottom rounded-3 custom-bg custom-header')
        .append('5-day Forecast');

    var $inner_card = $('<div>')
        .attr('id', 'five-day-containers')

    var $inner_card_row = $('<div>')
        .addClass('row custom-row');

    var forecastDaily = forecast.daily;

    for (i=1;i<forecastDaily.length;i++) {

        var $weatherContent = $('<div>')
        .addClass('px-2 col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 text-dark border border-info rounded-3');

        var forecastDt = moment(forecastDaily[i].dt,"X").format("DD/MM/YYYY");
        var forecastDay = moment(forecastDt,"DD/MM/YYYY").format("dddd");
        var forecastIcon = 'https://openweathermap.org/img/wn/' + forecastDaily[i].weather[0].icon + '.png';
        var forecastMaxTemp = forecastDaily[i].temp.max;
        var forecastMinTemp = forecastDaily[i].temp.min;
        var forecastWind = forecastDaily[i].wind_speed;
        var forecastHumid = forecastDaily[i].humidity;

        if (i === 6) {
            break;
        }
        $forecastDt = $('<h6>')
        .addClass('mt-2 mb-1 fw-bold text-dark')
        .append(forecastDay,$linebreak,forecastDt);

        $forecastIcon = $('<img>')
        .attr('alt', 'Icon of forecast weather')
        .attr('height', '50px')
        .attr('width','50px')
        .attr('src', forecastIcon)
        .addClass('custom-bg')

        $forecastMaxTemp = $('<p>')
        .addClass('mt-2 mb-1 fw-bold text-danger')
        .append("Max Temp.: " + forecastMaxTemp + " " + temp_unit);

        $forecastMinTemp = $('<p>')
        .addClass('mt-2 mb-1 fw-bold text-success')
        .append("Min Temp.: " + forecastMinTemp + " " + temp_unit);

        $forecastWind = $('<p>')
        .addClass('mt-2 mb-1 text-dark')
        .append('Wind: ' + forecastWind + ' ' + speed_unit);

        $forecastHumid = $('<p>')
        .addClass('mt-2 mb-4 text-dark')
        .append('Humidity: ' + forecastHumid + " %");

        $weatherContent.append($forecastDt,$forecastIcon,$forecastMaxTemp,$forecastMinTemp,$forecastWind,$forecastHumid);

        $inner_card_row.append($weatherContent);
    }

    $inner_card.append($inner_card_row);
    $fivedayCtnEl.append($main_card,$inner_card);
    return;
}

// SEARCH HISTORY ELEMENTS
function displayHistEl() {

    $($histContEl).text('');    

    for (x=0;x<arrHistSearch.length;x++) {

        var cityItem = arrHistSearch[x];
        var cap_cityItem = cityItem.charAt(0).toUpperCase() + cityItem.slice(1);

        $cityHistLi = $('<li>')
            .attr('id', 'list-item')
            .attr('data-index', x)
            .addClass('btn btn-outline-secondary text-light custom-bg mb-1 d-flex justify-content-between align-items-center');

        $liBtn = $('<button>')
            .attr('id', 'delete-item')
            .attr('data-index', x)
            .addClass('btn-sm justify-content-md-end')
            .append('🗑');
        
        $cityHistLi.append(cap_cityItem,$liBtn);
        
        $histContEl.append($cityHistLi);
    }
    return;
}

// PAGE EVENTS
function clearForm() {
    searchInputTxt = "";
    $($searchTxtEl).val('');
    $($searchTxtEl.focus());
}

function handleEvent(event) {

    event.preventDefault();
    event.stopPropagation();
    
    var trig_el = event.target;

    if (trig_el.id === 'search-button') {
        searchInputTxt = $searchTxtEl.val();
        handleSearch();
        clearForm();
    }
    
    if (trig_el.id === 'list-item') {
        var trgt = event.target;
        var name = trgt.textContent;
        var search_name = name.slice(0, name.length - 2);
        searchInputTxt = search_name;
        handleSearch();
    }
    
    if (trig_el.id === 'delete-item') {
        var index = trig_el.parentElement.getAttribute("data-index");
        arrHistSearch.splice(index, 1);

        storeData();
        displayHistEl();

        clearForm();
    }
}

function handleSearch() {
    if (!searchInputTxt) {

        console.log("Error: Input string not found.");

        if ($errorLblEl) {
            $errorLblEl.remove();
        }        

        $errorLblEl = $('<label>')
            .attr('type', 'text')
            .addClass('custom-error')
            .append('*Error: Please enter a value');

        $searchFrmEl.append($errorLblEl);

        $($searchTxtEl.focus());
        return;
    }

    //if !empty, clear error label, open function and clear textbox value
    if ($errorLblEl) {
        $errorLblEl.remove();
    }
    getWeatherAPI(searchInputTxt);
    return;
}

function initiate() {

    loadHistory();
    displayHistEl();

    UoM = "metric";
    if (UoM === "metric") {
        temp_unit = "\xB0" + "C";
        speed_unit = "KPH";
    }else if (UoM === "imperial") {
        temp_unit = "\xB0" + "F";
        speed_unit = "MPH";
    }
}

initiate();

$(window).ready(function () {

    $(window).on('click', handleEvent);

});