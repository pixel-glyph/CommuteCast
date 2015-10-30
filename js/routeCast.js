
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

var weather;
var d = new Date();
var d_names = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var readCoords = [];

//-------------------------------------------------------------------------------------

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var USA = new google.maps.LatLng(40.2192743, -96.2644229);
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
      for (var j = 0; j < results.length; j++)
        // value returned in meters is divided by the number of meters in a mile
        routeDist = Math.round(results[j].distance.value/1609.34);
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
      // array of latlngs on a given route
      routeArray = response.routes[0]["overview_path"];
      routeLength = routeArray.length;

      startLat = routeArray[0].lat();
      startLng = routeArray[0].lng();

      var pathArrayLength = routeArray.length-1;
      endLat = routeArray[pathArrayLength].lat();
      endLng = routeArray[pathArrayLength].lng();

      origin1 = new google.maps.LatLng(startLat, startLng);
      destinationA = new google.maps.LatLng(endLat, endLng);

      calculateDistance();
    }
  });
}

//Print out error messages
function printError(error) {
  console.error(error.message);
}

function getWeather() {
  var temp;
  var temp2;
  var condition;
  var icn;
  var day = $("#commute-day").val();

  for (i=0; i < readCoords.length; i++) {

    var lat = readCoords[i]["lat"];
    var lng = readCoords[i]["lng"];
    // forecast.io API
    var url = "https://api.forecast.io/forecast/168b6b5a68104d52147285a01177bf63/" + lat + "," + lng + "?callback=?";
    // Exclude unneeded data blocks
    var opts = { exclude: "minutely,flags" };

    $.getJSON(url, opts).done(function(data) {
      try {
        if(day === "today") {
          weather = data;
          temp = Math.round(data.currently.temperature);
          condition = data.currently.summary;
          icn =  data.currently.icon;
          // html for current info windows
          var contentString =
          '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent">'+
              '<p>'+ temp +'&#8457;</p>'+
              '<p><strong>'+ condition +'</strong></p>'+
            '</div>'+
          '</div>';
        } else {
          temp = Math.round(data.daily.data[day].temperatureMax);
          temp2 = Math.round(data.daily.data[day].temperatureMin);
          condition = data.daily.data[day].summary;
          icn = data.daily.data[day].icon;
          // html for future info windows
          var contentString =
          '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent">'+
              '<p>High: '+ temp +'&#8457; / Low: '+ temp2 +'&#8457;</p>'+
              '<p><strong>'+ condition +'</strong></p>'+
            '</div>'+
          '</div>';
        }

        // weather icon options
        var weatherIcon = {
          path: iconPaths[icn],
          scale: 0.02,
          rotation: 180,
          fillColor: "black",
          fillOpacity: 1.0
        };

        // add weather icon to map as a symbol
        var pos = new google.maps.LatLng(data.latitude, data.longitude);
        var marker = new google.maps.Marker({
          position: pos,
          icon: weatherIcon,
          map: map
        });

        // create info window for weather icon using above html
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        // 3 event listners added to each info window
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        google.maps.event.addListener(marker, 'mouseover', function(){
          infowindow.open(map,marker);
        });

        google.maps.event.addListener(marker, 'mouseout', function(){
          infowindow.close(map,marker);
        });

      } catch(error) {
        printError(error);
      }

        //printError({message: "There was an error getting the forecast for " + latitude + " " + longitude + ". (" + http.STATUS_CODES[res.statusCode] + ")"});
    }).fail(function(e) {
      console.log(e);
    });
  }
  // jQuery to disable used input fields and show New Route button
  $("#start, #end, #commute-day, #get-route").attr("disabled", true);
  $("#start, #end, #commute-day, #get-route").css("opacity",0.6);
  $("#get-route").replaceWith('<button id="new-route" class="btn btn-success btn-lg" type="button">New Route</button>');
}


// creates an array of objects containing lat/lngs at desired intervals
function weatherReads() {
  if (routeDist > 50) {
    var numReads = Math.floor(routeDist/50);
    var interval = Math.floor(routeLength/(numReads + 1));
    for (i=interval; i < routeLength && (routeLength - i) > (interval/2); i+=interval) {
      readCoords.push({
        "lat": routeArray[i].lat(),
        "lng": routeArray[i].lng(),
      });
    }
  }

  readCoords.unshift(
    {
      "lat": startLat,
      "lng": startLng,
    });

  readCoords.push(
    {
      "lat": endLat,
      "lng": endLng,
    });

  getWeather();
}


google.maps.event.addDomListener(window, 'load', initialize);

// populates dropdown with proper dates
for (i=1; i <= $("#commute-day option").length; i++) {
  d.setDate(d.getDate() + 1);
  $("#commute-day option:nth-child("+ (i+1) +")").html((d.getMonth() + 1) + "/" + (d.getDate() + " - " + d_names[d.getDay()]));
}

$(document).on('click', '#new-route', function(){
  readCoords = [];
  $("#start, #end, #commute-day, #get-route").attr("disabled", false);
  $("#start, #end, #commute-day, #get-route").css("opacity", 1);
  $("#start, #end").val("");
  $("#new-route").replaceWith('<button type="button" id="get-route" class="btn btn-primary" onclick="calcRoute();">Get Route</button>');
  initialize();
});



// add a bootstrap tooltip pointing to search bar on first search


// in the dropdown have "today" be the heading for the first set of options, which
// will be times for the current day (morning, afternoon, evening). Place a divider
// under these options


// program flow:
  // read in start, end, and date from user input
  // calculate the route (polyline)
  // get start and ent latlng
  // calculate distance (miles)
  // get weather read intervals
    // start and end reads
    // middle interval reads
  // pull weather info from API
  // print weather info
