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

//create variable to reference our firebase database
var database = firebase.database();

//create variables to store the event details to display in the cards
var actName = "";
var supportingAct = "";
var venueName = "";
var eventDate = "";

for (q=0; q<10; q++)
{
    //this will set the variable values for an event
    database.ref().on("value", function(snapshot) 
    {
        actName = snapshot.val().results[q].act;
        supportingAct = snapshot.val().results[q].support;
        venueName = snapshot.val().results[q].venue;
        eventDate = snapshot.val().results[q].date;

        // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
    }, 

    function(errorObject) 
    {
        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
    });

    //this will push the values for an event to the cards on the page
    
}