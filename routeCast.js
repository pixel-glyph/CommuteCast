

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

var origin1;
var destinationA;

var routeDist;
var routeArray;
var routeLength;

var startLat;
var startLng;
var endLat;
var endLng;

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

// invokes distacne matrix service to get distance of route in miles
function calculateDistance() {
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

// callback from distance matrix service
function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        routeDist = results[j].distance.text
      }
    }
    weatherReads();
  }
}

//-------------------- GET ROUTE --------------------

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  // grab start and end lat and lng AND the route's array length, place them in global vars
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      // array of latlngs on a given routet
      routeArray = response.routes[0]["overview_path"];
      routeLength = routeArray.length;

      startLat = routeArray[0].A;
      startLng = routeArray[0].F;
      var pathArrayLength = routeArray.length-1;
      endLat = routeArray[pathArrayLength].A;
      endLng = routeArray[pathArrayLength].F;

      origin1 = new google.maps.LatLng(startLat, startLng);
      destinationA = new google.maps.LatLng(endLat, endLng);

      calculateDistance();
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


function getWeather(coords) {

  for (i=0; i < coords.length; i++) {
    for (var key in coords[i]) {
      var lat = coords[i][key]["lat"];
      var lng = coords[i][key]["lng"];

      // forecast.io API
      var url = "https://api.forecast.io/forecast/168b6b5a68104d52147285a01177bf63/" + lat + "," + lng + "?callback=?";
      // Exclude unneeded data blocks
      var opts = { exclude: "minutely,flags" };

      $.getJSON(url, opts).done(function(data) {
        try {

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
    } 
  }
}

google.maps.event.addDomListener(window, 'load', initialize);


function weatherReads() {
  var readCoords = [];
  if (routeDist > 50) {
    
  } 

  readCoords.unshift( {
    "start": {
      "lat": startLat,
      "lng": startLng
    }
  });
  readCoords.push( {
    "end": {
      "lat": endLat,
      "lng": endLng
    }
  });
  


  getWeather(readCoords);
}

// print out weather at start, destination, and measured intervals between
  // check distance in miles 
    // if under 50 miles, only take start and dest weather reads
    // if over 50 miles, take a number of weather reads equal to how many times the distance is divisible by 50
      // to determine where along the route to read weather, divide the route's array length by the above number + 1
      // take that quotient and grab the coords at each multiple of that number along the route
        // ex: route = 130 miles, array length = 221 
        // 130 / 50 = 2 weather reads
        // 221 / 3 = 77 (rounded)
        // --> first between read is at index 77 in route array
        // --> second between read at index 154 in route array
        // --> reads will also be taken for 1 and 220

// create dropdown for user to select forecast date
  // use selected date to look up daily weather


// program flow:
  // read in start and end from user input
  // calculate the route (polyline)
  // calculate distance (miles)
  // get weather reads
    // start and end weather reads
    // middle weather reads
