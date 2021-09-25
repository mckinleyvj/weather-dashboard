// HTML ELEMENTS
var $histContEl = $('#history-container');
var $searchContEl = $('#search-container');

var $searchFrmEl = $('#search-form');
var $searchTxtEl = $('#search-input');
var $searchBtnEl = $('#search-button');
var $resultCtnEl = $('#result-content');
var $errorLblEl;
var $cityResultEl;
var $cityHistLi;
var $liBtn;

// INPUT ELEMENTS VARIABLES
var searchInputTxt;

// GLOBAL VARIABLES
var APIKey = "467952e5cf21b6ecbc8d9a89b3ec05b9";
var UoM;
var temp_unit;
var speed_unit;
var latitu;
var longti;

// STORAGE VARIABLES
var arrHistSearch = [];
var storedHist;

// WEATHER APIs
function getWeatherAPI(city) {

    //Current Weather Data API
    var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=" + UoM;
    console.log(city);
    fetch(APIUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            console.log();
            saveHistory(data.name + ', ' + (data.sys.country).toUpperCase()); //MODIFIED THIS
            displayHistEl();
            displaySearchResult(data);
            getCurrWeatherAPI(data);

            return;
        })
        .catch(function (err) {
            alert("Error: City not found.\n" + err.message);
        });
    
}

function getCurrWeatherAPI(stats) {
    latitu = stats.coord.lat;
    longti = stats.coord.lon;
    var exclusions = "minutely,hourly,daily,alerts"

    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitu + "&lon=" + longti + "&exclude="+ exclusions + "&appid=" + APIKey + "&units=" + UoM;

    fetch(requestURL)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();           
        })
        .then(function(dt) {
            console.log(dt);
            displayWeatherContents(dt);
            return;
        })
        .catch(function (err) {
            alert("Error: Something went wrong. Redo search.\n" + err.message);
        });
    
}

// STORAGE FUNCTIONS
function loadHistory() {
    storedHist = JSON.parse(localStorage.getItem("search_history"));

    if (storedHist !== null) {
        var arrUnsorted = [];
        for (var j=0;j<storedHist.length;j++) {
            arrUnsorted.push(storedHist[j]);
        }
        arrHistSearch = arrUnsorted;
        console.log(arrHistSearch);

    }else {
        return;
    }
}

function saveHistory(inpt) {
    
    //var dt_inpt = inpt.toLowerCase();
    var dt_inpt = inpt;
    console.log(dt_inpt);
    //console.log(arrHistSearch.length);
    for (i=0;i<arrHistSearch.length;i++) {
        if (arrHistSearch[i].includes(dt_inpt)) {
            //if the data exists, do nothing
            return;
        }
    }
    
    //if none of the input matches with any existing items in array, push as new item
    arrHistSearch.push(dt_inpt);
    localStorage.setItem(
        "search_history", JSON.stringify(arrHistSearch)
    );
    console.log(arrHistSearch);
}

// PROCESS
function displaySearchResult(info) {
    
    //clear the result content first
    $resultCtnEl.text('');

    var cityName = info.name + ', ' + (info.sys.country).toUpperCase();
    var currentDate = moment(info.dt,"X").format("DD/MM/YYYY");
    var weatherIconURL = 'http://openweathermap.org/img/wn/' + info.weather[0].icon + '.png';

    //CREATE SEARCH RESULT HEADER ELEMENTS
    $cityResultEl = $('<h5>')
        .addClass('text-uppercase px-2')
        .append(cityName);

    $cityDate = $('<i>')
        .addClass('custom-text')
        .append(' [' + currentDate + '] ');
    
    $weatherIconEl = $('<img>')
        .attr('alt', 'Icon of current weather')
        .attr('src', weatherIconURL);

    var $cd = $cityResultEl.append($cityDate);
    $cd.append($weatherIconEl);

    // Append elements to main result container
    $resultCtnEl.addClass('border border-2 bg-dark text-white');
    $resultCtnEl.append($cd);
}

function displayWeatherContents(i) {
    var currTemp = i.current.temp;
    var windSpd = i.current.wind_speed;
    var humidity = i.current.humidity;
    var UVIndex = i.current.uvi;
    var UVStatus;

    if (UVIndex < 6) {
        UVStatus = "p-2 bg-success text-white rounded-3";
    }else if (UVIndex >= 6 && UVIndex <= 8) {
        UVStatus = "p-2 bg-warning text-dark rounded-3";
    }else if (UVIndex >= 8) {
        UVStatus = "p-2 bg-danger text-white rounded-3";
    }

    $statsTemp = $('<p>')
        .addClass('px-2')
        .append('Temperature: ' + currTemp + " " + temp_unit);

    $statsWindSpd = $('<p>')
        .addClass('px-2')
        .append('Wind: ' + windSpd + " " + speed_unit);

    $statsHumid = $('<p>')
        .addClass('px-2')
        .append('Humidity: ' + humidity + " %");

    $UVBg = $('<span>')
        .addClass(UVStatus)
        .append(UVIndex);

    $statsUV = $('<p>')
        .addClass('px-2')
        .append('UV Index: ');

    $statsUV.append($UVBg);

    $resultCtnEl.append($statsTemp,$statsWindSpd,$statsHumid,$statsUV);

}

function displayHistEl() {

        // $($cityHistLi).remove();
        // $($liBtn).remove();
        $($histContEl).text('');    

    for (x=0;x<arrHistSearch.length;x++) {

        var cityItem = arrHistSearch[x];
        var cap_cityItem = cityItem.charAt(0).toUpperCase() + cityItem.slice(1);

        $cityHistLi = $('<li>')
            .attr('id', 'list-item')
            .attr('data-index', x)
            .addClass('btn btn-secondary btn-block px-2 d-flex justify-content-between');

        $liBtn = $('<button>')
            .attr('id', 'delete-item')
            .attr('data-index', x)
            .addClass('btn-sm justify-content-md-end')
            .append('🗑');
        
        $cityHistLi.append(cap_cityItem,$liBtn);
        
        $histContEl.append($cityHistLi);
    }

    
}

function searchHandler() {
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

    searchInputTxt = "";
    $($searchTxtEl).val('');
    $($searchTxtEl.focus());
}

function handleEvent(event) {

    event.preventDefault();
    event.stopPropagation();
    
    var trig_el = event.target.id;
    console.log(trig_el);
    //$customBtn.attr('id') === "saveBtn"

    if (trig_el === 'search-button') {
        searchInputTxt = $searchTxtEl.val();
        searchHandler();
    }
    
    if (trig_el === 'list-item') {
        var trgt = event.target;
        var name = trgt.textContent;
        var search_name = name.slice(0, name.length - 2);
        searchInputTxt = search_name;
        searchHandler();
    }
    
    if (trig_el === 'delete-item') {
        var trig_el_index = event.target;
        console.log(trig_el_index.attr('data-index'));
    }
}

// function deleteItem(event) {

//     event.stopPropagation();
//     if ($(this).children('li').attr('id') === 'delete-item') {

//         // var list_items = $(this).children('li').length;
//         // console.log($(this).children('li').attr('data-index'));
//         // // for (x=0;x<list_items;x++) {
            
//         // // }
//         // var trgt = $(this).children('li').attr('data-index');
//         // // var i = trgt.attr('data-index');
//         // console.log(trgt);
//         console.log("Delete Item");
//     }
// }

function initial_val() {

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

initial_val();

//$($searchFrmEl).on('submit', handleEvent);

$(window).ready(function () {

    $(window).on('click', handleEvent);
    //$(window).on('click', $($liBtn), deleteItem);

});
