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

$(document).ready(function(){
//create reference to firebase database
var database = firebase.database();

//google maps api sourcing
//<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB2tZwi5fvoq_7bXtgMMYoE1kyBd_t6P_A&callback=myMap"></script>

//create variables to store the event details to display in the cards
var actName = "";
var venueName = "";
var eventDate = "";
var eventLink = "";


//these are just arbitrary values that will get replaced by the event details
var eventLat = 1.123;
var eventLng = 1.123;

//this variable will store the value assigned to the card during dynamic creation
//the cards are created in numeric order based on the json data received
var selectedEvent = "";

//these variables will be used to hold the card content
var preCard = "";
//var preCard2 = "";
var cardContent = "";
//var cardContentQ = "";
//var fullCard = "";

//triggers the json request and results population
$("#searchRequest").click(function(event)
    {
        event.preventDefault();
        //eric's code for getting the json data and pushing it to firebase will go here
        /*







        */

        //jason's code for retrieving the json data and populating the cards will go here
        
        //clear out any content in the variableContent div
        $("#variableContent").html("");

        database.ref().on("child_added", function(snapshot) 
            {
                actName = snapshot.val().artist;
                console.log(actName);
                eventDate = snapshot.val().date;
                console.log(eventDate);
                eventLat = snapshot.val().latitude;
                console.log(eventLat);
                eventLng = snapshot.val().longitude;
                console.log(eventLng);
                eventLink = snapshot.val().URI;
                console.log(eventLink);
                eventID = snapshot.val().eventkey;
                console.log(eventID);
                

                preCard="<div class='row justify-content-md-center'><div class='col-xs-6'><div class='card' style='width: 18rem;'><div class='card-body' value='"+eventID+"'>";
                cardContent="<h5>"+actName+"</h5><h6 class='mb-2 text-muted'>"+venueName+"</h6><p>"+eventDate+"</p></div></div></div>";

                $("#variableContent").append(preCard+cardContent);
            },
        function(errorObject) 
            {
            // In case of error this will print the error
            console.log("The read failed: " + errorObject.code);
            }
        );

       // }
    }
);

//triggers display of event details
$("body").on("click",".card", function()
    {
        //clear the content from the div (where the cards were previously displayed)
        $("#variableContent").html("");

        //grab the value assigned to the card
        selectedEvent = $(this).val();

        //using the value of the card, pull all of the event details for the event chosen
        database.ref().on("value", function(snapshot) 
        {
            eventLat = snapshot.val()[selectedEvent].latitude;
            eventLng = snapshot.val()[selectedEvent].longitude;
            //showBannerName = snapshot.val()[selectedEvent].banner;
            showActName = snapshot.val()[selectedEvent].artist;
            //showSupportingAct = snapshot.val()[selectedEvent].support;
            //showVenueName = snapshot.val()[selectedEvent].venue;
            showDate = snapshot.val()[selectedEvent].date;
            showTime = snapshot.val()[selectedEvent].time;
            showLink = snapshot.val()[selectedEvent].URI;

            // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
        }, 

        function(errorObject) 
        {
            // In case of error this will print the error
            console.log("The read failed: " + errorObject.code);
        });

        //display the event details on the page

        var eventDetailsDisplay = "<div class='container-fluid'><div class='row'><div class='col-sm-8' style='background-color:lavender;'>space for event information-smaller embed-all event info under the embed<div class='embed-responsive embed-responsive-16by9'><iframe class='embed-responsive-item' src='https://www.youtube.com/embed/zpOULjyy-n8?rel=0' style='width:400px;height:200px;'></iframe><div class='band info'><h2>"+showActName+"</h2><ul style='list-style-type:none'><li>"+showActName+"</li><li>(Location)</li><li>"+showDate+" at "+showTime+"</li></ul></div></div></div>";
        
        $("#variableContent").html(eventDetailsDisplay);
        
        //display the google map view of the venue

        var googleMapsBox = "<div class='col-sm-4' style='background-color:lavenderblush;'><h1>Place for Google Map</h1><div id='googleMap' style='width:100%;height:400px;'></div>";

        $("#variableContent").append(googleMapsBox);
        
        myMap(eventLat, eventLng);

    }
)

function myMap(cord1, cord2) 
{
    var mapProp= 
    {
        center:new google.maps.LatLng(cord1,cord2),
        zoom:8,
    };

    //not sure if this works the same as the code provided by w3schools
    //var map = new google.maps.Map($("#eventMap"),mapProp);

    //from w3schools
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

});
    