// Initialize Firebase
var config = 
{
    apiKey: "AIzaSyByKZKEuCfRM-tdsjJiC_XIsiGdxOgGsgk",
    authDomain: "concerts-events.firebaseapp.com",
    databaseURL: "https://concerts-events.firebaseio.com",
    projectId: "concerts-events",
    storageBucket: "concerts-events.appspot.com",
    messagingSenderId: "160710496348"
};

firebase.initializeApp(config);

//create reference to firebase database
var database = snapshot.firebase.database();

//google maps api sourcing
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB2tZwi5fvoq_7bXtgMMYoE1kyBd_t6P_A&callback=myMap"></script>


//create variables to pull in the lat and lng of the event location
//these are just arbitrary values that will get replaced by the event details
var eventLat = 1.123;
var eventLng = 1.123;

database.ref().on("value", function(snapshot) 
{
    eventLat = snapshot.val().Lat;
    eventLng = snapshot.val().Lng;

    // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
}, 

function(errorObject) 
{
    // In case of error this will print the error
    console.log("The read failed: " + errorObject.code);
});


function myMap() 
{
    var mapProp= 
    {
        center:new google.maps.LatLng(eventLat,eventLng),
        zoom:5,
    };

    //not sure if this works the same as the code provided by w3schools
    //var map = new google.maps.Map($("#eventMap"),mapProp);

    //from w3schools
    var map = new google.maps.Map(document.getElementById("eventMap"),mapProp);
}
    
    