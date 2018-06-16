$(document).ready(function(){
    
    //This variable holds the metroArea ID for our event search
    var metroID = [];
    var idLogged = false;
    var events = []
    console.log(idLogged)
    console.log(events)

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
                console.log(metroID, idLogged)
                
                //If our metroArea ID is logged, we will then search that metroArea for events.
                if(idLogged == true){
                    //*Still need to figure out how to apply parameters*
                    var eventURL = "https://api.songkick.com/api/3.0/metro_areas/" + metroID + "/calendar.json?apikey=io09K9l3ebJxmxe2&page=1&per_page=10"
                    $.ajax({
                        url: eventURL,
                        method: "GET"
                    })
                    .then(function(eventResponse){
                        var response = eventResponse.resultsPage.results.event;
                        console.log(response);
                        events.push(response);
                        var latitude = eventResponse.resultsPage.results.event[0].venue.lat
                        var longitude = eventResponse.resultsPage.results.event[0].venue.lng
                        console.log(latitude, longitude)

                        var latLng = {
                            latitude: latitude,
                            longitude: longitude
                        }
 
                        // Initialize Firebase
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

                        database.ref().set({
                            venueLocation: latLng
                        })
                    });
                }
            })
        });
    };
eventSearch();
})