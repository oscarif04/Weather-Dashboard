var theMoment = moment();
var weatherAPIKey = '5d05df2b34ff9a1707887594fcb9ee83';
var searchCity = $('#city')
var searchButton = $('#search-primary')
var resultsGroup = $('#results-group')
var cityTitle = $('#searched-city-title')
var currentTemp = $('#current-temp')
var currentWind = $('#current-wind')
var currentHumidity = $('#current-humidity')
var currentUVIndex = $('#current-UV-index')
var weatherIcon = $('#weather-icon')
var forecastDate = $('.forecast-date')
var forecastIcon = $('.forecast-icon')
var forecastTemp = $('.forecast-temp')
var forecastWind = $('.forecast-wind')
var forecastHumidity = $('.forecast-humidity')
var searchHistory = JSON.parse(localStorage.getItem("searched")) || [];
var searchHistoryEl = $('#search-history')
var searchLon
var searchLat
var weatherIconSRC

function searchButtons() {
    theMoment = moment();
    searchHistoryEl.text('');
    
    for (i = 0; i <searchHistory.length; i++) {
        searchHistoryEl.append($("<button type='submit' class='btn btn-secondary text-black container-fluid search-button'></button>").text(searchHistoryStorage[i]))
    }
}
searchButtons();

function getWeather(input) {
    var cityInput = input.toUpperCase();
    var date = theMoment.format('(M/D/Y)');
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput + '&appid=' + weatherAPIKey + '&units=imperial';

    $.ajax({
        url: queryURL,
        method: 'GET',
    })
    .then(function (response) {
        cityTitle.text(response.name + ' ' + date);
        currentTemp.text(response.main.temp + ' °F');
        currentWind.text(response.wind.speed + ' MPH');
        currentHumidity.text(response.main.humidity + '%');
        searchLon = response.coord.lon;
        searchLat = response.coord.lat;
        var queryURLOneCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + searchLat + '&lon=' + searchLon + '&exclude=minutely,hourly&appID=' + weatherAPIKey + '&units=imperial';

        $.ajax({
            url: queryURLOneCall,
            method: 'GET',
        })
        .then(function (responseOneCall) {
            ifUV = responseOneCall.current.uvi;
            if (ifUV <= 2) {
                currentUVIndex.text(responseOneCall.current.uvi + ' Low')
                $(currentUVIndex).css('background-color', 'green').css('color', 'white')
            }
            else if (ifUV <= 5) {
                currentUVIndex.text(responseOneCall.current.uvi + ' Moderate')
                $(currentUVIndex).css('background-color', 'yellow').css('color', 'black')
            }
            else if (ifUV <= 7) {
                currentUVIndex.text(responseOneCall.current.uvi + ' High')
                $(currentUVIndex).css('background-color', 'orange').css('color', 'black')
            }
            else if (ifUV <= 10) {
                currentUVIndex.text(responseOneCall.current.uvi + ' Very high')
                $(currentUVIndex).css('background-color', 'red').css('color', 'black')
            }
            else {
                currentUVIndex.text(responseOneCall.current.uvi + ' Extreme')
                $(currentUVIndex).css('background-color', 'purple').css('color', 'white')
            }
            weatherIconSRC = 'https://openweathermap.org/img/w/' + responseOneCall.current.weather[0].icon + '.png';
            weatherIcon.attr('src', weatherIconSRC).attr('alt', responseOneCall.current.weather[0].description);

            for (i = 0; i < 5; i++) {
                var thisDate = theMoment.add(1, 'd').format('(M/D/Y)');
                forecastDate[i].innerHTML = thisDate;
                var thisWeatherIconSRC = 'https://openweathermap.org/img/w/' + responseOneCall.daily[i].weather[0].icon + '.png'
                forecastIcon[i].setAttribute('src', thisWeatherIconSRC);
                forecastIcon[i].setAttribute('alt', responseOneCall.daily[i].weather[0].description);
                forecastTemp[i].innerHTML = responseOneCall.daily[i].temp.day + ' °F';
                forecastWind[i].innerHTML = responseOneCall.daily[i].wind_speed + ' MPH';
                forecastHumidity[i].innerHTML = responseOneCall.daily[i].humidity + '%';
            }
            resultsGroup.removeClass('d-none');
        })
        
    })
    
    searchCity.val('');
}

searchButton.on('click', function(event) {
    event.preventDefault();
    var userInput = searchCity.val()
    searchHistory.push(userInput);
    localStorage.setItem('searched', JSON.stringify(searchHistory));
    searchHistoryButtons()
    getWeather(userInput);
})

$('.search-button').on('click', function(event) {
    event.preventDefault();
    var searchInput = event.target.innerHTML;
    getWeather(searchInput);
})