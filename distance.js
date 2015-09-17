
(function(distanceapp){

  var latlong;
  var apiKey = "AIzaSyAd9NQNHCBLHehNLvpdvvHMYB1rvgK0v_4";
  var startLatLong = {lat: 33.988233, lng: -118.459086};

  function Distance(){}

  // format data from JSON, get distance and round to nearest integer
  Distance.prototype.calcLocationCoords = function(value, callback){
      endLatLong = value.results[0].geometry.location;
      distRaw = Distance.prototype.formulateDistance(startLatLong.lat, startLatLong.lng, endLatLong.lat, endLatLong.lng);
      distInt = Math.round(distRaw);
      callback(distInt);
  }

  //shamelessly stolen from http://stackoverflow.com/questions/27928/
  Distance.prototype.formulateDistance = function(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = Distance.prototype.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = Distance.prototype.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(Distance.prototype.deg2rad(lat1)) * Math.cos(Distance.prototype.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  Distance.prototype.deg2rad = function(deg) {
    return deg * (Math.PI/180)
  }

  // main API call and handling of array sorting
  Distance.prototype.measureIt = function(locations){

    MainArray = [];
    var stop = locations.length;

    $.each(locations, function( index, value ){

      encodedLoc = encodeURIComponent(value);

      var distanceAPI = "https://maps.googleapis.com/maps/api/geocode/json?address="+encodedLoc+"&key="+apiKey;

      $.when(
       $.getJSON(distanceAPI)
      ).then(function(a, b) {  
        if(b == 'success'){
          Distance.prototype.calcLocationCoords(a, function(data){
            locObj = {};
            locObj['dist'] = data;
            locObj['place'] = value;
            MainArray.push(locObj);
          });
          if(index == (stop - 1)){
            SortedMainArray = MainArray.sort(function(a, b) {
              return a.dist - b.dist;
            })
            Distance.prototype.printSorted(SortedMainArray);
          }
        }
      });

    });
  }

// iterate through the sorted array and append to table
Distance.prototype.printSorted = function(values){
 $.each(values, function(index, value){
    var html;
     html += '<tr>';
     html += '<td>'+value['dist']+'</td>';
     html += '<td>'+value['place']+'</td>';
     html += '</tr>';
    $('#content').append(html);
 });
}

window.Distance = Distance;

})(this);


$(document).ready(function(){

   function init() {

    // array of text location points to be processed by Google Maps API for latitude and longitude
    var locations = new Array(
      "Times Square, Manhattan, NY 10036",
      "13000 S Dakota 244, Keystone, SD 57751",
      "1600 Pennsylvania Ave NW, Washington, DC 20500",
      "Golden Gate Bridge, San Francisco, CA 94129",
      "Stonehenge, A344, Amesbury, Wiltshire SP4 7DE, United Kingdom",
      "Great Wall of China",
      "Hollywood Sign, Los Angeles, CA"
    );

    var dist = new Distance();
    dist.measureIt(locations);
  }

  init(); 

});