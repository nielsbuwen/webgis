"use strict";

const HD_LAT = 49.41510547562049;
const HD_LON = 8.682589530944826;
const HD_ZOOM = 14;

function setup(layer_name) {
    const map = L.map('map').setView([HD_LAT, HD_LON], HD_ZOOM);

    map.addLayer(select_background_layer(layer_name));

    register_lat_lon_popup(map);

    return map
}


function register_lat_lon_popup(map) {
    const popup = L.popup();
    map.on('click', function(e) {
        const message = e.latlng.lat + ", " + e.latlng.lng;

        popup
            .setLatLng(e.latlng)
            .setContent(message.toString())
            .openOn(map);
    });
}


function select_background_layer(name) {
    const watercolor = new L.StamenTileLayer('watercolor');

    const mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoid29tYmF0eiIsImEiOiJjamlvbTZnbDEwcmF6M3BwOG9jOGc5dmt2In0.olrSHaLjfE-k186GG-V1rA'
    });

    if (name === 'mapbox') {
        return mapbox
    }
    return watercolor
}

const Map = setup();

const Places = [];
function add_polygon(message, color, points) {
    const polygon = L.polygon(points, {
        color: color
    }).addTo(Map);
    polygon.bindPopup(message);
    Places.push(polygon)
}


function back() {
    Map.setView([HD_LAT, HD_LON], HD_ZOOM);
}

let LastIndex = 0;
function poi() {
    const polygon = Places[LastIndex];
    Map.fitBounds(polygon.getBounds());

    LastIndex = (LastIndex + 1) % Places.length;
}
