let myForm = document.querySelector(".ipAddressForm");
let submit = document.querySelector('.submitButton');

let ip = document.getElementById("ipAddress");
let location = document.getElementById("location");
let timezone = document.getElementById("timezone");
let isp = document.getElementById("isp");

let map = L.map('mapid');
let marker;

console.log("Starting");

document.addEventListener('DOMContentLoaded', ()=>{
    submit.addEventListener('click', getIpOrDomain, false);
}, false);

function getIpOrDomain(e){
    e.preventDefault();
    let formData = new FormData(myForm);
    let ipInfo = getIPInfo(formData);
    updateElements(ipInfo);
    updateMap(ipInfo);
}

function isIPAddress(ipAddress) {
    console.log("checking ip");
    let regEx = new RegExp('^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$');
    return regEx.test(ipAddress);
}

function isDomainName(domainName) {
    console.log("checking domain");
    let regEx = new RegExp('/^(?!:\\/\\/)([a-zA-Z0-9]+\\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\\.[a-zA-Z]{2,6}?$/i');
    return regEx.test(domainName);
}

async function getIPInfo(formData = null){
    console.log("getting ip");
    let url = "/locate";

    if(formData != null){

        if(isIPAddress(formData)){
                url += "/ipAddress/" + formData;
        }
        else if(isDomainName(formData))
            url += "/domain/" + formData;
        else
            alert("Please enter a valid IP address or domain name");
    }
    else{
        url += "/defaultIP";
    }
    let response = await fetch(url);
    return response.json();
}

function updateMap(data){
    //TODO update map with location information
}

function updateElements(ipInfo) {
    console.log("updating elements");
    ip.innerText = ipInfo.ip;
    location.innerText = ipInfo.location.city + " " + ipInfo.location.region;
    timezone.innerText = "UTC " + ipInfo.location.timezone;
    isp.innerText = ipInfo.isp;
}

function initPage() {
    console.log("initializing page");
    updateElements(getIPInfo());
}

function setMap(lat, long, zoomLevel){
    return map.setView([lat, long], zoomLevel);
}

function getMarker(lat, long, myMap){
    return L.marker([lat, long]).addTo(myMap);
}

initPage();

// map layer
L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    tileHeight: 520,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo( map );

// popups for objects
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

/* popup as layer
let popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

 */