
// Create and declare variables
var APIkey = "6199e90c9358dfd397f2a94006cb5625";
var weatherDetails = $("#weather-details");
var currentDate = (moment().format('MMMM Do, YYYY'));
var cityName = $("<h4>");
var fiveDayForecastDiv = $("#five-day-forecast");
var searchCity = $("#search-city")
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
// var city = "";

// A function to get and display the current weather
function displayWeather(event) {

    // // event.preventDefault() can be used to prevent an event's default behavior.
    // // Here, it prevents the submit button from trying to submit a form when clicked
    event.preventDefault();

    // Here we grab the text from the input box
    var city = $("#search-city").val().trim();

    // Building the url needed to query the OpenWeather database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

    // Creating the AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {

        // Adding the weather-details-class to the weather-details div
        $("#weather-details").addClass("weather-details-class")

        // Creating a new list item and storing it in a variable
        var listItem = $("<li>").attr("id", "city-list-item");

        // Creating a new <a> and storing it in a variable
        var listItemLink = $("<a>").attr("href", "#")

        // Adding a class to the list items
        listItem.addClass("list-group-item");

        // Adding an id to the listItemLink
        listItemLink.attr("id", "city-list-item-link");

        // Setting the text for the list item URL equal to the city's name
        listItemLink.text(response.name);

        // Appending the link to the list item
        listItem.append(listItemLink)

        // Appending the list item to the ul
        $("#city-names").append(listItem)

        // Setting the text for the city name
        cityName.text(response.name);

        // Adding an ID to the cityName H4
        $(cityName).attr("id","city-name");

        // Creating a variable for the weather icon and image URL
        var weatherIcon = response.weather[0].icon
        var WeatherIconURL = "http://openweathermap.org/img/wn/" + weatherIcon + ".png";
        var WeatherIconImg = $("<img>").attr("src", WeatherIconURL);
        $("#weather-details").append(cityName)
        cityName.append(" " + "(" + currentDate + ") ")
        $("#weather-details").append(WeatherIconImg);

        // Creating a variable for the temperature
        var temperature = $("<p>");
        temperature.text("Temperature: " + convertTemp(response.main.temp) + "°F");
        $("#weather-details").append(temperature);

        // Creating a variable for the humidity
        var humidity = $("<p>");
        humidity.text("Humidity: " + response.main.humidity + "%");
        $("#weather-details").append(humidity);

        // Creating a variable for the wind-speed
        var windSpeed = $("<p>");
        windSpeed.text("Wind Speed: " + response.wind.speed + "mph");
        $("#weather-details").append(windSpeed);

        // Creating variables for latitude and longitude and the query URL for the AJAX call
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var indexQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
        
        // Creating the AJAX call to get the UV index
        $.ajax({
            url: indexQueryURL,
            method: "GET"
        }).then(function(response) {

            // Creating new span and paragraph elements for the UVI information and storing them in variables
            var UVindex = $("<span>");
            var UVindexP = $("<p>");
            // Creating a variable for the uvi response data from the AJAX call
            var UVindexValue = response.current.uvi;
            // Setting the text for the UVindex variable
            UVindex.text("UV index: ");
            // Appending the new span and paragraph elements and uv index data to the weather-details div
            $("#weather-details").append(UVindex);
            $(UVindex).append(UVindexP)
            $(UVindexP).append(UVindexValue)

            // Conditional statements to change the class based on the current UV
                if(UVindexValue >= 1 && UVindexValue < 3) {
                UVindexP.addClass("favorable");
            } else if(UVindexValue > 3 && UVindexValue < 6) {
                UVindexP.addClass("moderate");
            } else {
                UVindexP.addClass("severe");
            }

        })
        fiveDayForecast(city);
      });
      weatherDetails.empty()
    };
    
    // Creating a function to convert the temperature from Kelvin to Fahrenheit
    function convertTemp(temperature){
        return Math.floor((temperature - 273.15) * 1.8 + 32);
    }

    // A function to get the five day forecast
    function fiveDayForecast(city){

        var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + "&appid=" + APIkey;

        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        }).then(function(response) {
    
            for (i=0;i<5;i++){
                var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
                var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
                var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
                var tempK= response.list[((i+1)*8)-1].main.temp;
                var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
                var humidity= response.list[((i+1)*8)-1].main.humidity;
    
                fiveDayForecastDiv.removeClass("hide");
                $("#fDate"+i).html(date);
                $("#fImg"+i).html("<img src="+iconurl+">");
                $("#fTemp"+i).html(tempF+"&#8457");
                $("#fHumidity"+i).html(humidity+"%");
            }
    
        });
    }

// A function to clear the city list from the page
function clearHistory(event){
    event.preventDefault();
    document.location.reload();
}

// display the past search again when the list group item is clicked in search history
function invokePastSearch(event){
    var urlClick=event.target;
    if (event.target.matches("a")){
        city=urlClick.textContent.trim();

    // Building the url needed to query the OpenWeather database
    var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    
    // Creating the AJAX call
    $.ajax({
        url: cityURL,
        method: "GET"
      }).then(function(response) {

        // Adding the weather-details-class to the weather-details div
        $("#weather-details").addClass("weather-details-class")

        // Setting the text for the city name
        cityName.text(response.name);

        // Adding an ID to the cityName H4
        $(cityName).attr("id","city-name");

        // Creating a variable for the weather icon and image URL
        var weatherIcon = response.weather[0].icon
        var WeatherIconURL = "http://openweathermap.org/img/wn/" + weatherIcon + ".png";
        var WeatherIconImg = $("<img>").attr("src", WeatherIconURL);
        $("#weather-details").append(cityName)
        cityName.append(" " + "(" + currentDate + ") ")
        $("#weather-details").append(WeatherIconImg);

        // Creating a variable for the temperature
        var temperature = $("<p>");
        temperature.text("Temperature: " + convertTemp(response.main.temp) + "°F");
        $("#weather-details").append(temperature);

        // Creating a variable for the humidity
        var humidity = $("<p>");
        humidity.text("Humidity: " + response.main.humidity + "%");
        $("#weather-details").append(humidity);

        // Creating a variable for the wind-speed
        var windSpeed = $("<p>");
        windSpeed.text("Wind Speed: " + response.wind.speed + "mph");
        $("#weather-details").append(windSpeed);

        // Creating variables for latitude and longitude and the query URL for the AJAX call
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var indexQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
        
        // Creating the AJAX call to get the UV index
        $.ajax({
            url: indexQueryURL,
            method: "GET"
        }).then(function(response) {

            // Creating new span and paragraph elements for the UVI information and storing them in variables
            var UVindex = $("<span>");
            var UVindexP = $("<p>");
            // Creating a variable for the uvi response data from the AJAX call
            var UVindexValue = response.current.uvi;
            // Setting the text for the UVindex variable
            UVindex.text("UV index: ");
            // Appending the new span and paragraph elements and uv index data to the weather-details div
            $("#weather-details").append(UVindex);
            $(UVindex).append(UVindexP)
            $(UVindexP).append(UVindexValue)

            // Conditional statements to change the class based on the current UV
                if(UVindexValue >= 1 && UVindexValue < 3) {
                UVindexP.addClass("favorable");
            } else if(UVindexValue > 3 && UVindexValue < 6) {
                UVindexP.addClass("moderate");
            } else {
                UVindexP.addClass("severe");
            }

        })
        fiveDayForecast(city);
      });
      weatherDetails.empty()
    }
}


// Event listeners
$("#search-button").on("click",displayWeather);
$("#clear-history").on("click",clearHistory);
$(document).on("click",invokePastSearch);




