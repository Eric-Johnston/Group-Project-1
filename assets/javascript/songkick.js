$(document).ready(function(){
    //Initialize Firebase
    var config = {
        apiKey: "AIzaSyByKZKEuCfRM-tdsjJiC_XIsiGdxOgGsgk",
        authDomain: "concerts-events.firebaseapp.com",
        databaseURL: "https://concerts-events.firebaseio.com",
        projectId: "concerts-events",
        storageBucket: "concerts-events.appspot.com",
        messagingSenderId: "160710496348"
    };
    firebase.initializeApp(config);
    
    var database = firebase.database();
    
    //This variable holds the metroArea ID for our event search
    var metroID = [];
    var idLogged = false;
    var events = []

    function eventSearch(){
        //*Replace with proper button*
        $("#submit").on("click", function(){
            event.preventDefault();
            //This resets our metroID variable
            metroID.length = 0
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
                    });
                };
            });
        });
    };
eventSearch();
});