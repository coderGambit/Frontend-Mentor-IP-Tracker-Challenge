let myFormElement = document.getElementById("ipAddressForm");
let submitElement = document.getElementById('submitButton');

let ipElement = document.getElementById("ipAddress");
let locationElement = document.getElementById("location");
let timezoneElement = document.getElementById("timezone");
let mapElement = document.getElementById("isp");

let map;
let marker;
let isMapInitialized = false;
let isMarkerInitialized = false;

console.log("Starting");

document.addEventListener('DOMContentLoaded', ()=>{
    submitElement.addEventListener('click', getIpOrDomain, false);
}, false);

function getIpOrDomain(e){
    e.preventDefault();
    let formData = new FormData(myFormElement);
    getIPInfo(formData.get('ip'));
}

function isIPAddress(ipAddress) {
    return /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(ipAddress);
}

function isDomainName(domainName) {
    return /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i.test(domainName);
}

function sendHttpRequest(url) {
    let val;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onload = function () {

        if (xhr.readyState === XMLHttpRequest.DONE) {

            if (xhr.status === 200
                && xhr.responseText !== null
                && xhr.responseText.length > 0) {
                val = JSON.parse(xhr.responseText);
                updateElements(val);
                updateMap(val);
            }
            else {
                alert("There was an error serving your request, response was: " + xhr.responseText);
            }
        }
    }
    xhr.send();
}

function getIPInfo(formData = null){
    console.log("getting ip");
    let url = "/locate";

    if(formData != null){

        if(isIPAddress(formData)){
                url += "/ipAddress/" + formData;
        }
        else if(isDomainName(formData))
            url += "/domain/" + formData;
        else {
            alert("Please enter a valid IP address or domain name");
            return;
        }
    }
    else{
        url += "/defaultIP";
    }
    sendHttpRequest(url);
}

function updateMap(data){
    let lat = data.location.lat;
    let long = data.location.lng;
    setMap(lat, long, 13);
    updateMarker(lat, long);
}

function setMap(lat, long, zoomLevel){

    if (map)
        map.flyTo([lat, long], zoomLevel);
    else {
        initMap();
        map.setView([lat, long], zoomLevel);
        isMapInitialized = true;
    }
}

function initMap() {
    map = L.map('mapid');
    L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        tileHeight: 520,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function updateMarker(lat, long) {

    if(marker)
        marker.setLatLng([lat, long]);
    else {
        marker = getMarker(lat, long, map);
        isMarkerInitialized = true;
    }
}

function getMarker(lat, long, myMap){
    return L.marker([lat, long]).addTo(myMap);
}

function updateElements(ipInfo) {
    console.log("updating elements");
    updateEl(ipElement, ipInfo.ip)
    updateEl(locationElement, ipInfo.location.city + ", " + ipInfo.location.region);
    updateEl(timezoneElement, "UTC " + ipInfo.location.timezone);
    updateEl(mapElement, ipInfo.isp);
}

function updateEl(el, val){
    el.innerText = val;
    el.setAttribute('title', val);
}

function initPage() {
    console.log("initializing page");
    getIPInfo();
}

initPage();