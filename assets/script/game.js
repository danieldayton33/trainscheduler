 
 //DOM variables
 var trainName = $("#train-name").val();
 var trainDestination = $("#destination").val();
 var trainTime = $("#departure-time").val();
 var trainFrequency = $("#departure-frequency").val();
 // Set the configuration for your app
//  var config = {
//     apiKey: "AIzaSyDX_7uBsVeCgsNt8ni7XX_spPUc5pH0afo",
//     authDomain: "train-scheduler-100d8.firebaseapp.com",
//     databaseURL: "https://train-scheduler-100d8.firebaseio.com",
//     storageBucket: "train-scheduler-100d8.appspot.com"
//   };
//   firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

  function writeUserData(trainName, trainDestination, trainTime, trainFrequency) {
    firebase.database().ref('trains/' + trainName).set({
      destination: trainDestination,
      time: trainTime,
      frequency : trainFrequency
    });
  }
  $(".submit-train").on("click", function(event){
    event.preventDefault();
    writeUserData(trainName, trainDestination, trainTime, trainFrequency);
  });