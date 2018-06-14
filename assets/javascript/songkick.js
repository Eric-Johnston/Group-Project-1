$(document).ready(function(){
    
    //This variable holds the metroArea ID for our event search
    var metroID = [];
    var idLogged = false;
    console.log(idLogged)

    function eventSearch(){
        //*Replace with proper button*
        $(".btn-one").on("click", function(){
            event.preventDefault();
            //This resets our metroID variable
            metroID.length = 0
            //*Replace with value of search bar*
            var locationSearch = $(".form-control").val();
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
                    var eventURL = "https://api.songkick.com/api/3.0/metro_areas/" + metroID + "/calendar.json?apikey=io09K9l3ebJxmxe2"
                    $.ajax({
                        url: eventURL,
                        method: "GET"
                    })
                    .then(function(eventResponse){
                        var response = eventResponse.resultsPage.results.event
                        console.log(response)
                    });
            }
        })
    });
};
eventSearch();
})
                    