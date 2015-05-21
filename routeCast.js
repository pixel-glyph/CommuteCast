

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

var origin1;
var destinationA;

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var USA = new google.maps.LatLng(38.2192743, -96.2644229);
  var mapOptions = {
    zoom:5,
    center: USA
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

//-------------------- GET DISTANCE --------------------
function calculateDistances() {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin1],
      destinations: [destinationA],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
}

function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        console.log(results[j].distance.text)
      }
    }
  }
}

//-------------------- GET ROUTE --------------------

//get end lat and lng
//place all 4 coords in origin, destination vars
//call distance function 
function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      // array of latlngs on a given routet
      var routeLength = response.routes[0]["overview_path"].length;
      var startLat = response.routes[0]["overview_path"][0].A;
      var startLng = response.routes[0]["overview_path"][0].F;

      var pathArrayLength = response.routes[0]["overview_path"].length-1;
      var endLat = response.routes[0]["overview_path"][pathArrayLength].A;
      var endLng = response.routes[0]["overview_path"][pathArrayLength].F;
      
      origin1 = new google.maps.LatLng(startLat, startLng);
      destinationA = new google.maps.LatLng(endLat, endLng);

      getWeather(startLat, startLng, routeLength);
    }
  });
}

function printWeather(temp, cond) {
  var message = "Current Weather: " + temp + " and " + cond;
  console.log(message);
}

//Print out error messages
function printError(error) {
  console.error(error.message);
}


function getWeather(lat, lng, routeLength) {
  // forecast.io API
  var url = "https://api.forecast.io/forecast/168b6b5a68104d52147285a01177bf63/" + lat + "," + lng + "?callback=?";
  // Exclude unneeded data blocks
  var opts = { exclude: "minutely,flags" }

  $.getJSON(url, opts).done(function(data) {
    try {
      if (routeLength >= 50)
      var temperature = Math.round(data.currently.temperature);
      var condition = data.currently.summary;

      printWeather(temperature, condition);

    } catch(error) {
      printError(error);
    }
      //printError({message: "There was an error getting the forecast for " + latitude + " " + longitude + ". (" + http.STATUS_CODES[res.statusCode] + ")"});
  }).fail(function(e) {
    console.log(e);
  });
  // call to print distance in miles to the console
  calculateDistances();
  console.log(routeLength);
}

google.maps.event.addDomListener(window, 'load', initialize);
