

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

var readCoords = [];

// -------------------- WEATHER ICONS -------------------------------------------------

var iconPaths = {
    "clear-day":"M0 771q0 39 27 66q28 26 64 26h218q37 0 61.5 -27t24.5 -65t-24.5 -64.5t-61.5 -26.5h-218q-37 0 -64 27t-27 64zM305 32q0 37 25 65l157 152q24 25 63 25q38 0 63.5 -24t25.5 -61q0 -39 -26 -68l-152 -152q-65 -51 -131 0q-25 27 -25 63zM305 1509q0 37 25 65 q31 26 68 26q35 0 63 -26l152 -157q26 -24 26 -63q0 -38 -25.5 -63.5t-63.5 -25.5q-39 0 -63 26l-157 152q-25 27 -25 66zM577 771q0 149 75 277.5t203.5 203.5t277.5 75q112 0 215 -44.5t177.5 -119t118.5 -177.5t44 -215q0 -150 -74.5 -278t-202.5 -202.5t-278 -74.5 t-278 74.5t-203 202.5t-75 278zM758 771q0 -156 109.5 -266.5t265.5 -110.5t266.5 110.5t110.5 266.5q0 154 -110.5 263t-266.5 109q-155 0 -265 -109t-110 -263zM1042 -58q0 38 26.5 64t64.5 26q39 0 65 -26t26 -64v-212q0 -39 -26.5 -66t-64.5 -27t-64.5 27t-26.5 66v212z M1042 1595v218q0 37 27 64t64 27t64 -27t27 -64v-218q0 -37 -26.5 -61.5t-64.5 -24.5t-64.5 24.5t-26.5 61.5zM1631 189q0 37 24 60q24 25 60 25q39 0 64 -25l156 -152q26 -28 26 -65t-26 -63q-64 -50 -128 0l-152 152q-24 27 -24 68zM1631 1354q0 40 24 63l152 157 q28 26 63 26q38 0 64.5 -27t26.5 -64q0 -40 -26 -66l-156 -152q-29 -26 -64 -26q-36 0 -60 25.5t-24 63.5zM1872 771q0 38 26 66q26 26 61 26h216q37 0 64.5 -27.5t27.5 -64.5t-27.5 -64t-64.5 -27h-216q-37 0 -62 26.5t-25 64.5z",
    "clear-night":"M0 786q0 153 60 293t161.5 241.5t242 162t293.5 60.5h122q25 -7 25 -30l5 -94q6 -203 146 -346t340 -151l88 -7q26 0 26 -25v-104q1 -205 -99.5 -379.5t-274 -276t-378.5 -101.5q-156 0 -296.5 60t-241 161.5t-160 241.5t-59.5 294zM195 786q0 -122 48.5 -230t127 -181 t180 -115.5t206.5 -42.5q93 0 187.5 36.5t175.5 102t139.5 167.5t75.5 223q-261 54 -418.5 223.5t-181.5 398.5q-151 -8 -276.5 -93t-194.5 -215.5t-69 -273.5z",
    "rain":"M0 527q0 184 115 327.5t291 184.5q50 218 225 358t400 140q220 0 392.5 -136.5t224.5 -350.5h34q143 0 265 -69.5t193 -190t71 -263.5q0 -140 -67.5 -260.5t-184.5 -192.5t-256 -76q-21 0 -21 18v142q0 19 21 19q136 7 232.5 109t96.5 241t-104 241.5t-246 102.5h-172 q-19 0 -19 18l-8 62q-18 173 -148.5 289.5t-303.5 116.5q-175 0 -304.5 -116.5t-145.5 -289.5l-8 -57q0 -20 -21 -20l-56 -3q-133 -16 -223.5 -114t-90.5 -230q0 -139 96 -241t233 -109q18 0 18 -19v-142q0 -18 -18 -18q-214 10 -362.5 163t-148.5 366zM571 -186q0 7 4 21 l174 615q10 31 34.5 47t49.5 16q11 0 26 -3q38 -7 57.5 -39t8.5 -71l-174 -611q-20 -68 -88 -68q-6 0 -12 2q-9 3 -11 3q-35 10 -52 35.5t-17 52.5zM851 -486l260 936q7 31 32 47t52 16q14 0 29 -3q35 -10 52 -41.5t7 -68.5l-259 -937q-6 -27 -31 -46t-54 -19q-15 0 -27 5 q-32 8 -55 42q-18 28 -6 69zM1291 -189q0 6 4 24l174 615q9 31 32.5 47t49.5 16q13 0 28 -3q33 -9 49.5 -33t16.5 -50q0 -5 -2 -14.5t-2 -12.5l-174 -611q-6 -31 -30 -49.5t-54 -18.5l-26 5q-32 9 -49 34.5t-17 50.5z",
    "snow":"M0 523q0 185 113.5 328.5t292.5 187.5q50 218 224.5 358t400.5 140q220 0 392.5 -136.5t224.5 -350.5h34q143 0 265 -70.5t193 -192t71 -264.5q0 -212 -148 -365t-360 -160q-21 0 -21 18v142q0 19 21 19q136 7 232.5 108.5t96.5 237.5q0 142 -103 245t-247 103h-172 q-19 0 -19 18l-8 62q-18 173 -148.5 290t-303.5 117q-176 0 -305.5 -118t-146.5 -293l-6 -53q0 -20 -21 -20l-56 -7q-133 -11 -223.5 -110.5t-90.5 -233.5q0 -136 96.5 -237.5t232.5 -108.5q18 0 18 -19v-142q0 -18 -18 -18q-214 7 -362.5 160t-148.5 365zM679 89 q0 36 25.5 62t62.5 26t62.5 -26t25.5 -62q0 -38 -25.5 -64.5t-62.5 -26.5t-62.5 26.5t-25.5 64.5zM679 -298q0 38 26 64q25 24 62 24t62.5 -25t25.5 -63t-25.5 -63t-62.5 -25t-62.5 25t-25.5 63zM1019 -117q0 37 27 66q26 26 61 26q37 0 64.5 -27.5t27.5 -64.5t-27 -63.5 t-65 -26.5q-36 0 -62 26.5t-26 63.5zM1019 269q0 37 27 64q28 26 61 26q38 0 65 -26.5t27 -63.5t-27 -62.5t-65 -25.5q-36 0 -62 25.5t-26 62.5zM1019 -507q0 36 27 65q26 26 61 26q38 0 65 -27t27 -64t-27 -62.5t-65 -25.5q-36 0 -62 25.5t-26 62.5zM1363 89q0 35 27 61.5 t64 26.5t62.5 -26t25.5 -62q0 -38 -25.5 -64.5t-62.5 -26.5q-38 0 -64.5 27t-26.5 64zM1363 -298q0 35 27 64q26 24 64 24t63 -25t25 -63t-25 -63t-63 -25t-64.5 25.5t-26.5 62.5z",
    "sleet":"M0 523q0 185 115.5 330t292.5 186q49 219 224.5 359.5t402.5 140.5q130 0 235 -43q0 -1 1 -2q134 -52 236 -165h3q108 -117 146 -279h33q173 0 302 -92v1q85 -57 142.5 -142t77.5 -186q6 -34 8 -55v-1v-5q0 -5 1 -14t1.5 -16t0.5 -14v-1v-2q0 -141 -68 -261.5 t-185.5 -193t-258.5 -76.5q-21 0 -21 18v143q0 20 21 20q137 7 232.5 109t95.5 241q0 142 -103 244.5t-246 102.5h-172q-19 0 -19 18l-8 63q-16 160 -135 276q-1 1 -2.5 3t-2.5 3q-2 2 -4 2q0 3 -2 3q-116 106 -273 120q-11 1 -36 1q-176 0 -305.5 -117.5t-146.5 -290.5 l-8 -63q-5 -15 -24 -15l-54 -3q-135 -16 -225 -114t-90 -233v-4h3q1 -76 32.5 -144t85.5 -116q33 -29 79 -51v-1q64 -31 129 -34q18 0 18 -19v-143q0 -18 -18 -18q-83 5 -158 32v-1q-133 46 -225.5 153t-118.5 246v3q-1 1 -1 4q-8 41 -8 93zM587 -242q0 5 2 13.5t2 12.5 l10 63q11 38 43.5 56.5t72.5 8.5q36 -11 54 -44t7 -67l-15 -64q-16 -70 -81 -70q-5 0 -14.5 2t-14.5 2q-33 10 -49.5 35t-16.5 52zM666 72q0 38 25 63t63 25t63 -25t25 -63q0 -37 -25 -62t-63 -25q-37 0 -61 26q-27 25 -27 61zM841 -567q0 6 4 24l14 63q11 36 44 54.5 t67 7.5q37 -7 56 -39t9 -73l-14 -63q-16 -65 -85 -65q-12 0 -26 3q-35 10 -52 35.5t-17 52.5zM925 -257q0 37 25 62t63 25t63 -25t25 -62q0 -38 -25 -63t-63 -25q-36 0 -62 26t-26 62zM991 -15q0 15 3 29l24 96q11 37 44 56.5t68 8.5q38 -11 56.5 -43t7.5 -67l-28 -96 q-13 -44 -44 -60t-68 -6q-32 6 -48.5 32t-14.5 50zM1286 -243q0 5 1.5 14t1.5 12l10 63q11 38 43.5 56.5t72.5 8.5q36 -11 54.5 -44t7.5 -67l-15 -64q-16 -70 -81 -70q-5 0 -15 2t-15 2q-32 10 -48.5 35t-16.5 52zM1365 71q0 38 25 63t63 25t63 -25t25 -63q0 -37 -25 -62 t-63 -25t-62 26q-26 24 -26 61z",
    "wind":"M0 521q0 -39 30 -66q26 -30 67 -30h1567q46 0 78 -32t32 -79q0 -46 -31.5 -76.5t-78.5 -30.5t-78 31q-26 28 -64 28q-40 0 -68.5 -27.5t-28.5 -65.5q0 -40 30 -67q90 -88 209 -88q125 0 214 86t89 210t-89.5 213.5t-213.5 89.5h-1567q-40 0 -68.5 -28t-28.5 -68zM0 871 q0 -37 30 -65q28 -28 67 -28h2138q125 0 214.5 87t89.5 210q0 124 -89.5 212t-214.5 88q-123 0 -208 -85q-29 -26 -29 -71q0 -41 27.5 -67t67.5 -26q39 0 67 26q30 33 75 33q46 0 77.5 -32t31.5 -78t-31.5 -77t-77.5 -31h-2138q-40 0 -68.5 -28t-28.5 -68z",
    "fog":"M0 86q0 39 27 65t67 26h1991q40 0 65.5 -25.5t25.5 -65.5q0 -37 -26.5 -62t-64.5 -25h-1991q-40 0 -67 25t-27 62zM279 421q0 39 28 64q24 24 63 24h1992q37 0 62 -25.5t25 -62.5q0 -38 -25 -64.5t-62 -26.5h-1992q-38 0 -64.5 27t-26.5 64zM293 675q0 -14 16 -14h153 q10 0 21 17q38 83 113.5 136t165.5 60l59 8q18 0 18 19l7 53q17 173 146.5 288.5t303.5 115.5q173 0 301.5 -114t146.5 -286l8 -61q0 -18 21 -18h170q103 0 187.5 -55t125.5 -146q11 -17 22 -17h153q19 0 15 24q-47 164 -186 268t-317 104h-34q-53 213 -223.5 348.5 t-389.5 135.5q-224 0 -398 -140.5t-223 -358.5q-136 -32 -238.5 -129t-142.5 -232v4q-1 -3 -1 -10zM465 -241q0 38 28 63q24 24 64 24h1993q38 0 64.5 -25t26.5 -62q0 -38 -27 -65t-64 -27h-1993q-37 0 -64.5 27.5t-27.5 64.5z",
    "cloudy":"M0 454q0 159 99 282.5t254 158.5q41 188 190 307.5t343 119.5q189 0 337.5 -116.5t192.5 -298.5h29q188 0 321 -132.5t133 -320.5t-133 -321.5t-321 -133.5h-990q-92 0 -176.5 36t-145.5 97t-97 145.5t-36 176.5zM155 454q0 -122 88 -209.5t212 -87.5h990q124 0 212 87.5 t88 209.5t-88 209t-212 87h-148q-16 0 -16 16l-7 52q-16 151 -126.5 250.5t-261.5 99.5t-262.5 -100t-125.5 -250l-7 -45q0 -16 -17 -16l-48 -7q-115 -10 -193 -95t-78 -201zM1099 1384q-16 -15 8 -22q69 -30 115 -59q18 -5 24 3q97 92 226 92t223.5 -86.5t105.5 -213.5 l10 -68h151q104 0 179 -74.5t75 -177.5q0 -96 -66 -167t-163 -82q-16 0 -16 -17v-121q0 -17 16 -17q161 10 272 127t111 277q0 169 -119.5 288.5t-288.5 119.5h-16q-42 160 -175.5 263.5t-298.5 103.5q-226 0 -373 -169z",
    "partly-cloudy-day":"M0 899q0 -43 30 -71t77 -28h180q43 0 73.5 28.5t30.5 70.5q0 46 -30 76t-74 30h-180q-47 0 -77 -29.5t-30 -76.5zM189 239q0 -155 113 -268.5t268 -113.5h732q155 0 265.5 112t110.5 270q0 77 -22 131q133 85 210.5 226.5t77.5 302.5q0 130 -51 248.5t-136.5 204 t-204 136.5t-247.5 51q-175 0 -322.5 -86t-232 -233t-84.5 -321v-36q-160 -91 -211 -266q-121 -38 -193.5 -135t-72.5 -223zM355 1750q0 -45 28 -72l172 -180q75 -57 150 0q30 30 30 75q0 43 -30 75l-176 175q-34 31 -74 31q-45 0 -72.5 -30t-27.5 -74zM400 239q0 67 43 115 t109 54l66 9q21 0 21 24l10 60q11 92 78 154t158 62q93 0 161.5 -62t79.5 -154l9 -69q10 -24 26 -24h141q69 0 119.5 -50t50.5 -119q0 -72 -50.5 -123t-119.5 -51h-732q-72 0 -121 51t-49 123zM872 921q11 175 135 294t298 119q178 0 303 -127t125 -308q0 -112 -54.5 -207.5 t-147.5 -154.5q-94 78 -217 78q-47 140 -164 223t-265 83h-13zM1201 1854q0 -44 30.5 -74.5t73.5 -30.5q44 0 74.5 30.5t30.5 74.5v250q0 42 -30.5 70.5t-74.5 28.5q-43 0 -73.5 -28.5t-30.5 -70.5v-250zM1875 230q0 -43 29 -75l175 -173q67 -68 150 0q28 27 28 72 q0 43 -28 71l-180 179q-29 27 -73 27t-72.5 -29t-28.5 -72zM1875 1575q0 -45 29 -77q29 -29 72 -29q44 0 73 29l180 180q28 27 28 72q0 44 -30.5 74t-74.5 30q-42 0 -73 -31l-175 -175q-29 -29 -29 -73zM2151 899q0 -43 30 -71t77 -28h180q43 0 73.5 28.5t30.5 70.5 q0 46 -30 76t-74 30h-180q-47 0 -77 -29.5t-30 -76.5z",
    "partly-cloudy-night":"M0 239q0 -155 113.5 -268.5t268.5 -113.5h731q155 0 265.5 112t110.5 270q0 77 -22 131q133 85 210.5 226.5t77.5 302.5q0 130 -50.5 248.5t-136.5 204t-204 136.5t-247 51q-175 0 -322.5 -86t-232 -233t-84.5 -321v-36q-161 -92 -212 -266q-121 -38 -193.5 -135 t-72.5 -223zM211 239q0 67 43 115t109 54l67 9q20 0 20 24l11 60q11 92 77.5 154t157.5 62q93 0 161.5 -62t79.5 -154l9 -69q10 -24 27 -24h140q69 0 119.5 -50t50.5 -119q0 -72 -50.5 -123t-119.5 -51h-731q-72 0 -121.5 51t-49.5 123zM683 921q11 175 135.5 294t298.5 119 q178 0 302.5 -127t124.5 -308q0 -112 -54 -207.5t-147 -154.5q-94 78 -217 78q-47 140 -164.5 223t-265.5 83h-13z"
  };

//-------------------------------------------------------------------------------------

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
        
        // open and close info window on mouse over and mouse out events
        google.maps.event.addListener(marker, 'mouseover', function() {
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
    for (i=interval; i < routeLength; i+=interval) {
      readCoords.push(
        {
          "lat": routeArray[i].A,
          "lng": routeArray[i].F,
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
  $("#commute-day option:nth-child("+ (i+1) +")").html((d.getMonth() + 1) + "/" + (d.getDate()));
}

$("#new-route").on('click', function(){
  readCoords = [];
  $("#start, #end, #commute-day, #get-route").attr("disabled", false);
  $("#start, #end, #commute-day, #get-route").css("opacity", 1);
  $("#start, #end").val("");
  $(this).hide();
  initialize();
});


// add a bootstrap tooltip pointing to search bar on first search


// on mobile view logo will be a thin band at the top, put seach fields on map,
// hide them when route is drawn, and small circular 'new route' button pops up


// add day of the week name next to each date in dropdown, ex: 6/2-Tuesday


// in the dropdown have "today" be the heading for the first set of options, which
// will be times for the current day (morning, afternoon, evening). Place a divider
// under these options


// program flow:
  // read in start, end, and date from user input
  // calculate the route (polyline)
  // calculate distance (miles)
  // get weather read intervals
    // start and end reads
    // middle interval reads
  // pull weather info from API
  // print weather info
