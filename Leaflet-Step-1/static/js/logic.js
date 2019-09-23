// Store our API endpoint as queryUrl

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    console.log(data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    let processFeature = (feature, layer) => {
        layer.bindPopup(`<h3>${feature.properties.place}</h3>
      <hr><p>Magnitude:${(feature.properties.mag)}</p>`);
    };

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: processFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, { radius: feature.properties.mag * 5, fillOpacity: 0.5, color: getColor(feature.properties.mag) });
        }
    });

    createMap(earthquakes);
}

function getColor(d) {
    return d > 5 ? '#800026' :
        d > 4 ? '#BD0026' :
            d > 3 ? '#E31A1C' :
                d > 2 ? '#FC4E2A' :
                    d > 1 ? '#FD8D3C':
                    '#FFEDA0';
       
}



function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create a new map
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control containing our baseMaps
    // Be sure to add an overlay Layer containing the earthquake GeoJSON
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}


// // Loop through the earthquakes array
// earthquakes.forEach((earthquake) => {
// //     // Add circles to map
//     L.circle(earthquake.geometry.coordinates, {
//       fillOpacity: 0.75,
//       color: 'white',
//       // Conditionals for quakes
//       fillColor: quakeColor(earthquake.properties.mag),
//       // Adjust radius
//       radius: quakeRadius(earthquake.properties.mag)
//     })
//       .addTo(myMap);
//   });

//   function quakeColor(magn) {
//     let color = 'red';

//     if (magn > 5) {
//       color = 'red';
//     } else if (magn > 4) {
//       color = 'blue';
//     } else if (magn > 3) {
//       color = 'green';
//     }

//     return color;
//   }

//   function quakeRadius(magn) {
//     return magn * 1500;
//   }






