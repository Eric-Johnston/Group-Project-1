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

/*function myMap(cord1, cord2) 
{
    var mapProp= 
    {
        center:new google.maps.LatLng(cord1,cord2),
        zoom:8,
    };

    //not sure if this works the same as the code provided by w3schools
    //var map = new google.maps.Map($("#eventMap"),mapProp);

    //from w3schools
    var map = new google.maps.Map(document.getElementById("#googleMapsBox"),mapProp);
}*/

var map;

function displayMap(coord1,coord2) {
  map = new google.maps.Map(document.getElementById('googleMapsBox'), {
    center: {lat: coord1, lng: coord2},
    zoom: 8
  });
}


$(document).ready(function(){
    //create reference to firebase database
    var database = firebase.database();

    //google maps api sourcing
    //<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB2tZwi5fvoq_7bXtgMMYoE1kyBd_t6P_A&callback=myMap"></script>

    //create variables to store the event details to display in the cards
    var actName = "";
    //var venueName = "";
    var eventDate = "";
    //var eventLink = "";

    var cardElements = [];

    //these are just arbitrary values that will get replaced by the event details
    var eventLat = 1.123;
    var eventLng = 1.123;

    //this variable will store the value assigned to the card during dynamic creation
    //the cards are created in numeric order based on the json data received
    var selectedEvent = "";

    //these variables will be used to hold the card content
    var cardRow = "";

    //This variable holds the metroArea ID for our event search
    var metroID = [];
    var idLogged = false;
    var events = []
    var fbPushed = false;

    //triggers the json request and results population
    function eventSearch()
    {
        //*Replace with proper button*
        $("#searchRequest").on("click", function(){
            event.preventDefault();
            //This resets our metroID variable
            metroID.length = 0
            fbPushed = false;
            console.log("before push"+fbPushed)
            //*Replace with value of search bar*
            var locationSearch = $("#search").val();
            var metroURL = "https://api.songkick.com/api/3.0/search/locations.json?query=" + locationSearch + "&apikey=io09K9l3ebJxmxe2"
            $.ajax({
                url: metroURL,
                method: "GET"
            })
            .then(function(locationResponse){
                //Retrieves the metroArea ID
                var response = locationResponse.resultsPage.results.location[0].metroArea.id
                metroID.push(response)
                var idLogged = true;
                
                //If our metroArea ID is logged, we will then search that metroArea for events.
                if(idLogged == true){
                    //*Still need to figure out how to apply parameters*
                    var eventURL = "https://api.songkick.com/api/3.0/metro_areas/" + metroID + "/calendar.json?apikey=io09K9l3ebJxmxe2&page=1&per_page=10"
                    $.ajax({
                        url: eventURL,
                        method: "GET"
                    })
                    .then(function(eventResponse){
                        var response = eventResponse.resultsPage.results.event
                        for(e = 0; e < response.length; e++){
                            function remove(){
                                
                                database.ref("/event"+e).remove();
                            };
                            
                            remove();
                    
                        events.push(response[e]);
                        var actInfo = response[e].performance[0].artist.displayName
                        var banner = response[e].displayName
                        var eventUri = response[e].uri
                        var artistURI = response[e].performance[0].artist.uri
                        var city = response[e].location.city
                        var venueName = response[e].venue.displayName
                        var venueURI = response[e].venue.uri
                        var eventDate = response[e].start.date
                        var eventTime = response[e].start.time
                        var latitude = response[e].venue.lat
                        var longitude = response[e].venue.lng
                        var eventKey = "event"+e;
                        
                        var eventInfo = {
                            Artist: actInfo,
                            Banner: banner,
                            artistURI: artistURI,
                            venueName: venueName,
                            venueURI: venueURI,
                            City: city,
                            eventURI: eventUri,
                            Date: eventDate,
                            Time: eventTime,
                            Latitude: latitude,
                            Longitude: longitude,
                            eventkey: eventKey
                        };
                        database.ref("/event"+e).set(
                            eventInfo
                            
                        );
                        };
                        fbPushed = true;
                        console.log("after push"+fbPushed)
                    });
                };
            });
        });
    };

    eventSearch();

$("#searchRequest").click(function(){
   // if (fbPushed == true)
    //{
            //jason's code for retrieving the json data and populating the cards will go here

            //create a 2 second delay before attempting to retrieve the firebase data created by Eric's code
            setTimeout(waitingGame, 1000*2);

            //clear out any content in the variableContent div
            $("#variableContent").html("");

            //empty array before storing information
            cardElements.splice(0);

            //call to firebase, loops through database and gets all event details, one event at a time
            database.ref().on("child_added", function(snapshot) 
                {
                    actName = snapshot.val().Artist;
                    //bannerName = snapshot.val().Banner;
                    //cityName = snapshot.val().City;
                    eventDate = snapshot.val().Date;
                    //eventLat = snapshot.val().Latitude;
                    //eventLng = snapshot.val().Longitude;
                    eventTime = snapshot.val().Time;
                    //artistLink = snapshot.val().artistURI;
                    //eventLink = snapshot.val().eventURI;
                    //venueName = snapshot.val().venueName
                    //venueLink = snapshot.val().venueURI;
                    eventID = snapshot.val().eventkey;
                    
                    //store each events details in a single object
                    var cardObject = 
                    {
                        act: actName,
                        date: eventDate,
                        time: eventTime,
                        //lat: eventLat,
                        //lng: eventLng,
                        //link: eventLink,
                        ID: eventID
                    };

                    //put the event object into an array for display purposes
                    cardElements.push(cardObject);
                },
            function(errorObject) 
                {
                // In case of error this will print the error
                console.log("The read failed: " + errorObject.code);
                }
            );
    
            //this pauses the process so that there is information to display
            //timing issue between firebase and array population
            setTimeout(displayCards, 1000*2);
        //}
    //);
   // }
    //else
    //{

    //}
});

    //need a function name to create a 2 second delay
    function waitingGame()
    {

    }

    //this function will display the event cards to the screen
    function displayCards()
    {
        for (var s=0; s<cardElements.length; s+=2)
        {
            var t = s+1;

            cardRow = "<div class='row justify-content-md-center'><div class='col-xs-6'><div class='card' value='"+eventID+"' style='width: 18rem;'><div class='card-body'><h5 class='card-title1'>"+cardElements[s].act+"</h5><h6 class='card-subtitle1 mb-2 text-muted'>"+cardElements[s].date+"</h6><p class='card-text1'>"+cardElements[s].time+"</p></div></div></div><div class='col-xs-6'><div class='card' style='width: 18rem;'><div class='card-body'><h5 class='card-title2'>"+cardElements[t].act+"</h5><h6 class='card-subtitle2 mb-2 text-muted'>"+cardElements[t].date+"</h6><p class='card-text2'>"+cardElements[t].time+"</p></div></div></div></div>";

            $("#variableContent").append(cardRow);
        }
    }

    //triggers display of event details
    $("body").on("click",".card", function()
        {
            //clear the content from the div (where the cards were previously displayed)
            console.log($(this).attr("value"));
            //grab the value assigned to the card
            selectedEvent = $(this).attr("value");
            console.log(selectedEvent);

            $("#variableContent").html("");

            //using the value of the card, pull all of the event details for the event chosen
            database.ref().on("value", function(snapshot) 
            {
                showActName = snapshot.val()[selectedEvent].Artist;
                showBannerName = snapshot.val()[selectedEvent].Banner;
                showCity = snapshot.val()[selectedEvent].City;
                showDate = snapshot.val()[selectedEvent].Date;
                eventLat = snapshot.val()[selectedEvent].Latitude;
                eventLng = snapshot.val()[selectedEvent].Longitude;
                showTime = snapshot.val()[selectedEvent].Time;
                showArtistLink = snapshot.val()[selectedEvent].artistURI;
                showEventLink = snapshot.val()[selectedEvent].eventURI;
                showVenueName = snapshot.val()[selectedEvent].venueName;
                showVenueLink = snapshot.val()[selectedEvent].venueURI;

                // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
            }, 

            function(errorObject) 
            {
                // In case of error this will print the error
                console.log("The read failed: " + errorObject.code);
            });

            //display the event details on the page
            var eventDetailsDisplay = "<div class='row'><div class='col-sm-8' style='background-color:lavender;'><div class='embed-responsive embed-responsive-16by9'><div class='band info'><h2>Event Information</h2><ul style='list-style-type:none'><li>Event Name: "+showBannerName+"</li><li>Headliner: "+showActName+"</li><li>Event Date: "+showDate+"</li><li>Event Time: "+showTime+"</li><li>Venue: "+showVenueName+"</li><li>City: "+showCity+"</li><li>Artist Link: <a href='"+showArtistLink+"'></li><li>Event Link: <a href='"+showEventLink+"'></li><li>Venue Link: <a href='"+showVenueLink+"'></li></ul></div></div></div><div class='col-sm-4' style='background-color:lavenderblush;'><h1>Place for Google Map</h1><div id='googleMapsBox' style='width:100%;height:400px;'></div></div></div></div>";

            $("#variableContent").html(eventDetailsDisplay);
            
            //display the google map view of the venue
            displayMap(eventLat,eventLng);

            //var googleMapsBox = "<div class='col-sm-4' style='background-color:lavenderblush;'><h1>Place for Google Map</h1><div id='googleMapsBox' style='width:100%;height:400px;'></div>";

            //myMap(eventLat, eventLng);

            //$("#googleMapsBox").append(googleMapsBox);

        }
    );

});