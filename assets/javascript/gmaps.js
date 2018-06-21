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

var map;

function displayMap(coord1,coord2) {
  map = new google.maps.Map(document.getElementById("googleMapsBox"), {
    center: {lat: coord1, lng: coord2},
    zoom: 15
  });

  var marker = new google.maps.Marker({
    position: {lat: coord1, lng: coord2},
    map: map,
    title: "Your Event"
  });
}

//$("#searchRequest").modal();

$(document).ready(function()
{
    //create reference to firebase database
    var database = firebase.database();

    //create variables to store the event details to display in the cards
    var actName = "";
    var eventDate = "";

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

    function waitingGame()
    {

    }

    //this function will display the event cards to the screen
    function displayCards()
    {
        //loop through event event (regardless of however many events we are capturing) and incriment by 2
        for (var s=0; s<cardElements.length; s+=2)
        {
            //first variable (s) will be used to grab the first event
            //second variable (t) will be used to grab the second event
            var t = s+1;

            //a string variable to hold the html content that is the cards
            //cardRow = "<div class='row justify-content-md-center'><div class='col-xs-6'><div class='card' value='"+eventID+"' style='width: 18rem;'><div class='card-body'><h5 class='card-title1'>"+cardElements[s].act+"</h5><h6 class='card-subtitle1 mb-2 text-muted'>Date: "+cardElements[s].date+"</h6><p class='card-text1'>Time: "+cardElements[s].time+"</p><p class='card-text1'>Venue: "+cardElements[s].venue+"</p></div></div></div><div class='col-xs-6'><div class='card' style='width: 18rem;'><div class='card-body'><h5 class='card-title2'>"+cardElements[t].act+"</h5><h6 class='card-subtitle2 mb-2 text-muted'>Date: "+cardElements[t].date+"</h6><p class='card-text2'>Time: "+cardElements[t].time+"</p><p class='card-text2'>Venue: "+cardElements[t].venue+"</p></div></div></div></div>";

            cardRow = "<div class='row justify-content-md-center'><div class='col-xs-6 margin'><div class='card' value='"+cardElements[s].ID+"' style='width: 18rem; margin: 20px; background: rgba(76, 72, 88, .5); color: white; font-family: "+"'"+"Merriweather"+"'"+", serif;'><div class='card-body'><h5 class='card-title1'>"+cardElements[s].act+"</h5><h6 class='card-subtitle1 mb-2'>"+cardElements[s].venue+"</h6><p class='card-text1'>"+cardElements[s].date+"</p><p class='card-text1'>"+cardElements[s].time+"</p></div></div></div><div class='col-xs-6 margin'><div class='card' value='"+cardElements[t].ID+"' style='width: 18rem; margin: 20px; background: rgba(76, 72, 88, .5); color: white; font-family: "+"'"+"Merriweather"+"'"+", serif;'><div class='card-body'><h5 class='card-title2'>"+cardElements[t].act+"</h5><h6 class='card-subtitle2 mb-2'>"+cardElements[t].venue+"</h6><p class='card-text2'>"+cardElements[t].date+"</p><p class='card-text2'>"+cardElements[t].time+"</div></div></div>";

            //jquery to append the cars to the screen
            $("#variableContent").append(cardRow);
        }
    }

    function getCardData()
    {
        //creates a 5 second delay to permit the data push to firebase to populate completelye
        setTimeout(waitingGame, 1000*5);

        //clear out any content in the variableContent div
        $("#variableContent").html("");

        //empty array before storing information
        cardElements.splice(0);

        //call to firebase, loops through database and gets all necessary event details, one event at a time, to display on the cards
        database.ref().on("child_added", function(snapshot) 
        {
            actName = snapshot.val().Artist;
            eventDate = snapshot.val().Date;
            eventTime = snapshot.val().Time;
            venueName = snapshot.val().venueName
            eventID = snapshot.val().eventkey;

            //format date and time using moment
            eventDate = moment(eventDate).format("MM/DD/YY");
            eventTime = moment(eventTime, "HH:mm:ss").format("hh:mm a");

            //store each events details in a single object
            var cardObject = 
            {
                act: actName,
                date: eventDate,
                time: eventTime,
                venue: venueName,
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
    
        //call the function to display the event cards
        displayCards();
    }

    //triggers the json request and results population
    //function eventSearch()
    //{
        //*Replace with proper button*
    $("#searchRequest").on("click", function(event)
    {
        event.preventDefault();
        
        //This resets our metroID variable
        metroID.length = 0
        fbPushed = false;
        
        //*Replace with value of search bar*
        var locationSearch = $("#search").val();
        var metroURL = "https://api.songkick.com/api/3.0/search/locations.json?query=" + locationSearch + "&apikey=io09K9l3ebJxmxe2"
        $.ajax(
        {
            url: metroURL,
            method: "GET"
        }
        )
        .then(function(locationResponse)
        {
            //Retrieves the metroArea ID
            var response = locationResponse.resultsPage.results.location[0].metroArea.id

            //push the ID into an array for later use
            metroID.push(response)

            var idLogged = true;
            
            //If our metroArea ID is logged, we will then search that metroArea for events.
            if(idLogged == true)
            {
                //*Still need to figure out how to apply parameters*
                var eventURL = "https://api.songkick.com/api/3.0/metro_areas/" + metroID + "/calendar.json?apikey=io09K9l3ebJxmxe2&page=1&per_page=10"
                $.ajax(
                {
                    url: eventURL,
                    method: "GET"
                }
                )
                .then(function(eventResponse)
                {
                    //declare a variable to be the json object returned by the Songkick API
                    var response = eventResponse.resultsPage.results.event

                    //loop through the elements iun the json object
                    for(e = 0; e < response.length; e++)
                    {
                        function remove()
                        {
                            database.ref("/event"+e).remove();
                        };
                
                        //remove the previously stored elements from the database
                        remove();
                        
                        //collect all of the Songkick API response information that we want
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
            
                        //bundle the data, by event, into an object
                        var eventInfo = 
                        {
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

                        //push the object into firebase
                        database.ref("/event"+e).set(eventInfo);
                    };

                    fbPushed = true;
                });
            };
        }
        );

        getCardData();

    }
    );
        //};

        //call the eventSearch function (defined directly above)
        //eventSearch();

    //$("#searchRequest").click(function()
    //{

        //if (fbPushed == true)
        //{
            //event.preventDefault();
            //create a delay before attempting to retrieve the firebase data created by Eric's code
        
        //need a function name to create a delay
        
    //});

    //triggers display of event details
    $("body").on("click",".card", function()
        {
            //grab the id of the event selected based on the users click
            selectedEvent = $(this).attr("value");

            //clear the space where the cards were being displayed
            $("#variableContent").html("");

            //using the value of the card, pull all of the event details for the event chosen to display on the event details section
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
            }, 
            // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
            function(errorObject) 
            {
                // In case of error this will print the error
                console.log("The read failed: " + errorObject.code);
            });

            //display the event details on the page
            var eventDetailsDisplay = "<div class='row'><div class='col-sm-6 bandInfo'><h2>Songkick Event Information</h2><ul style='list-style-type:none'><li><h3>Event Title: </h3>"+showBannerName+"</li><li></li><li><h3>Event Link: </h3><a href='"+showEventLink+"'>Event Link by Songkick</a></li><li><li></li><h3>Headliner: </h3>"+showActName+"</li><li><h3>Artist Link: </h3><a href='"+showArtistLink+"'>Artist Link by Songkick</a></li><li><li></li><h3>Venue: </h3>"+showVenueName+"</li><li><h3>Venue Link: </h3><a href='"+showVenueLink+"'>Venue Link by Songkick</a></li><li></li><li><h3>City: </h3>"+showCity+"</li><li></li><li><h3>Date: </h3>"+showDate+"</li><li></li><li><h3>Time: </h3>"+showTime+"</li></ul></div><div class='col-sm-6' style='background-color:white;'><div id='googleMapsBox' style='width:100%;height:400px;'></div></div></div></div>";
            
            $("#variableContent").html(eventDetailsDisplay);
            
            //display the google map view of the venue
            displayMap(eventLat,eventLng);

        }
    );

});