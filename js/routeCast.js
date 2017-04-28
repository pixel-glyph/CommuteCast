
const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const cities = [];

var directionsDisplay, map, origin1, destinationA,
    routeArray, routeLength, startLat, startLng, endLat, endLng,
    readCoords = [],
    contentStart =
        '<div id="content"><div id="siteNotice"></div><div id="bodyContent">';


//----------------INITIALIZE---------------------------------------

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var USA = new google.maps.LatLng(40.2192743, -96.2644229),
      mapOptions = {
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
    var origins = response.originAddresses,
        destinations = response.destinationAddresses,
        routeDist, results;

    for (var i = 0; i < origins.length; i++) {
      results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++)
        // value returned in meters is divided by the number of meters in a mile
        routeDist = Math.round(results[j].distance.value/1609.34);
    }
    weatherReads(routeDist);
  }
}

//-------------------- GET ROUTE --------------------

function calcRoute() {
  var directionsService = new google.maps.DirectionsService(),
      start = document.getElementById('start').value,
      end = document.getElementById('end').value,
      request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
      };
  // grab start and end lat and lng AND the route's array length, place them in global vars
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      // array of latlngs on a given route
      routeArray = response.routes[0].overview_path;
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
  var day = $("#commute-day").val(),
      weather, temp, temp2, condition, icn, lat, lng, url, opts,
      contentString;

  for (i=0; i < readCoords.length; i++) {
    lat = readCoords[i].lat;
    lng = readCoords[i].lng;
    // forecast.io API
    url = "https://api.forecast.io/forecast/168b6b5a68104d52147285a01177bf63/"+
          lat + "," + lng + "?callback=?";
    // Exclude unneeded data blocks
    opts = { exclude: "minutely,flags" };

    $.getJSON(url, opts).done(function(data) {
      weather = data;
      try {
        if(day === "today") {
          temp = Math.round(weather.currently.temperature);
          condition = weather.currently.summary;
          icn =  weather.currently.icon;
          // html for current info windows
          contentString = contentStart + '<p>'+ temp +'&#8457;</p>'+
              '<p><strong>'+ condition +'</strong></p></div></div>';

        } else {
          temp = Math.round(weather.daily.data[day].temperatureMax);
          temp2 = Math.round(weather.daily.data[day].temperatureMin);
          condition = weather.daily.data[day].summary;
          icn = weather.daily.data[day].icon;
          // html for future info windows
          contentString = contentStart + '<p>High: '+ temp +'&#8457; / Low: '+
              temp2 +'&#8457;</p><p><strong>'+ condition +'</strong></p></div></div>';
        }
            // weather icon options
        var weatherIcon = {
              path: iconPaths[icn],
              scale: 0.02,
              rotation: 180,
              fillColor: "black",
              fillOpacity: 1.0
            },
            // add weather icon to map as a symbol
            pos = new google.maps.LatLng(weather.latitude, weather.longitude),
            marker = new google.maps.Marker({
              position: pos,
              icon: weatherIcon,
              map: map
            }),
            // create info window for weather icon using above html
            infowindow = new google.maps.InfoWindow({
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
    }).fail(function(e) { console.log(e); });
  }
  // jQuery to disable used input fields and show New Route button
  $("#start, #end, #commute-day, #get-route").attr("disabled", true).css("opacity",0.6);
  $("#get-route").replaceWith(
      '<button id="new-route" class="btn btn-success btn-lg" type="button">New Route</button>');
}

// creates an array of objects containing lat/lngs at desired intervals
function weatherReads(routeDist) {
  if (routeDist > 50) {
    var numReads = Math.floor(routeDist/50),
        interval = Math.floor(routeLength/(numReads + 1));
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

//---------------------- SEARCH TYPE-AHEAD ------------------------

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => cities.push(...data));
  
function findMatches(wordToMatch, cities) {
  return cities.filter(place => {
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.state.match(regex);
  }); 
}

function displayMatches(e) {
  if(e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40) {
    listSelect(e);
  } else {
    let targetSuggestions = e.target.nextElementSibling;
    if(/^[a-z\s]+$/i.test(e.key) && e.target.value !== '') {
      const matchArray = findMatches(e.target.value, cities);
      const html = matchArray.map( place => {
        const regex = new RegExp(e.target.value, 'gi'),
              cityName = place.city.replace(regex, `<span class="hl">${e.target.value}</span>`),
              stateName = place.state.replace(regex, `<span class="hl">${e.target.value}</span>`);
        
        return `
          <li>
            <span class="name">${cityName}, ${stateName}</span>
          </li>
        `;    
      }).join('');
      
      targetSuggestions.innerHTML = html;
      
    } else if(e.key === 'Tab' || e.target.value === '') { 
      removeSuggestions(targetSuggestions);
    }
  }
}

function isSuggestions(e) {
  if(!document.querySelectorAll('.suggestions > li').length) return;
    
  const suggestionList = e.target.closest('li').parentNode,
        input = suggestionList.previousElementSibling;
  
  if(suggestionList !== e.target && suggestionList.contains(e.target)) {
    let currentPlace = e.target.closest('li').querySelector('.name').textContent;
    input.value = currentPlace;
    removeSuggestions(suggestionList);
  } else {
    removeSuggestions(suggestionList);
  }
}

function listSelect(e) {
  let places = document.querySelectorAll('.suggestions > li');
  if(!places.length) return;
  
  let key = e.keyCode,
      selected = document.querySelector('li.selected'),
      current;

  if(selected) {
    selected.classList.remove('selected');
  }
  
  // down key
  if(key === 40) {  
    if(!selected || !selected.nextElementSibling) {
      current = places[0];
    } else {
      current = selected.nextElementSibling;
    }
  // up key    
  } else if(key === 38) {
    if(!selected || !selected.previousElementSibling) {
      current = places[places.length - 1];
    } else {
      current = selected.previousElementSibling;
    }
  // enter key  
  } else if((key === 13 || key === 9) && selected) {
    removeSuggestions(selected.parentNode);
  }
  
  if(current) {
    current.classList.add('selected');
  }
  const newSelected = document.querySelector('li.selected');
  
  if(newSelected) {
    const input = newSelected.parentNode.previousElementSibling;
    const placeName = newSelected.querySelector('.name').textContent;
    input.value = placeName;
  }
}

function removeSuggestions(list) {
  if(list.textContent !== '') {
    list.textContent = '';
  }
}

function clearSuggs(e) {
  if(e.keyCode !== 9) return;
  if(document.querySelector('li.selected')) {
    listSelect(e);
  }
  let suggs = document.querySelectorAll('.suggestions');
  suggs.forEach(sug => sug.textContent = '');
}

const searchInput = document.querySelectorAll('.search');
const suggestions = document.querySelectorAll('.suggestions');

document.addEventListener('click', isSuggestions);
searchInput.forEach(input => input.addEventListener('keyup', displayMatches));
searchInput.forEach(input => input.addEventListener('keydown', clearSuggs));



//-------------------------------------------------------------------------------------------

google.maps.event.addDomListener(window, 'load', initialize);

var d_names = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    d = new Date();

// populates dropdown with proper dates
for (i=1; i <= $("#commute-day option").length; i++) {
  d.setDate(d.getDate() + 1);
  $("#commute-day option:nth-child("+ (i+1) +")")
      .html((d.getMonth() + 1) + "/" + (d.getDate() + " - " + d_names[d.getDay()]));
}

$('#start').focus();

$(document).on('click', '#new-route', function() {
  readCoords = [];
  $("#start, #end, #commute-day, #get-route").attr("disabled", false);
  $("#start, #end, #commute-day, #get-route").css("opacity", 1);
  $("#start, #end").val("");
  $("#new-route").replaceWith('<button type="button" id="get-route" class="btn btn-primary" onclick="calcRoute();">Get Route</button>');
  initialize();
  $('#start').focus();
});
