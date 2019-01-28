 
//  Set the configuration for your app
 var config = {
    apiKey: "AIzaSyDX_7uBsVeCgsNt8ni7XX_spPUc5pH0afo",
    authDomain: "train-scheduler-100d8.firebaseapp.com",
    databaseURL: "https://train-scheduler-100d8.firebaseio.com",
    projectId: "train-scheduler-100d8",
    storageBucket: "train-scheduler-100d8.appspot.com"
  };
  firebase.initializeApp(config);
 
  var database = firebase.database();
  $("#train-form").on("submit", function(event){
    event.preventDefault();
//prevent form submit before form is finished
    if($("#train-name").val() === "" || $("#destination").val() === "" ||$("#departure-time").val() === "" ||$("#departure-frequency").val() === ""){
      return false;
    }
//grab form values and add them to firebase database
    else {
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var trainTime = $("#departure-time").val().trim();
    var trainFrequency = $("#departure-frequency").val().trim();
    console.log("I've been clicked");
    var trainData = {
      name: trainName,
      destination: trainDestination,
      time: trainTime,
      frequency : trainFrequency,
    }
    database.ref().push(trainData)
    $("#train-name").val("");
    $("#destination").val("");
    $("#departure-time").val("");
    $("#departure-frequency").val("");
  }
  });
  var ref = database.ref();

  ref.on("child_added",function(snapshot){
    var newObj = snapshot.val();
    console.log(newObj);
    var name = newObj.name;
    var destination = newObj.destination;
    var departureTime = newObj.time 
    var timeUntilDeparture;
    var departureFrequency = parseInt(newObj.frequency);

    //to check the departure time
    var rightNow = moment().format('HH:mm')
    var now = moment(rightNow, "HH:mm");
    var leaving = moment(departureTime,"HH:mm");
    
    if(rightNow < departureTime) {
      console.log("in here");
      timeUntilDeparture = leaving.diff(now, 'minutes');
      console.log("time until" + timeUntilDeparture)
      addInfo(name, destination, departureFrequency, departureTime, timeUntilDeparture )

    }
    else {
      console.log("in the second"); 
       var numberDepartures = (parseInt(((now.diff(leaving, 'minutes'))/departureFrequency),10))+1;
       var intervalFirstDepature = numberDepartures * departureFrequency
      console.log(intervalFirstDepature)
      // var formattedDeparture = moment(leaving).format('X');
      var newDepartureTime = moment(leaving).add(intervalFirstDepature, 'minutes');
      
      timeUntilDeparture = newDepartureTime.diff(now, 'minutes');
      console.log(timeUntilDeparture);
      newDepartureTime = newDepartureTime.format("HH:mm");
      addInfo(name, destination, departureFrequency, newDepartureTime , timeUntilDeparture);
      // console.log(formattedDeparture);
    }
    console.log(newObj.name);
   
  });

  function addInfo (name, destination, departureFrequency , departureTime ,  timeUntilDeparture) {
    var infoString = '<tr><td>' +name +'</td><td>' + destination +'</td><td>'+ departureFrequency + '</td><td>' + departureTime + '</td><td>'+ timeUntilDeparture  +'</td></td></tr>';
    $(".train-times").append(infoString);
  }