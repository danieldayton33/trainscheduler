 
//  Set the configuration for your app
 var config = {
          apiKey: "AIzaSyDX_7uBsVeCgsNt8ni7XX_spPUc5pH0afo",
          authDomain: "train-scheduler-100d8.firebaseapp.com",
          databaseURL: "https://train-scheduler-100d8.firebaseio.com",
          projectId: "train-scheduler-100d8",
          storageBucket: "train-scheduler-100d8.appspot.com"
  };
  firebase.initializeApp(config);
 
  //declare database
  var database = firebase.database();

  //event for adding a new train
  $("#train-form").on("submit", function(event){
      //keep form from reloading page
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
          
         //add values to database 
          database.ref().push(trainData);
          //clear form
          $("#train-name").val("");
          $("#destination").val("");
          $("#departure-time").val("");
          $("#departure-frequency").val("");
        }
  });
//declare database reference for listener function
  var ref = database.ref();
  
  //lisenter for child addded
  ref.on("child_added",function(snapshot){
    addTrains(snapshot);
  });

  //function to add trains to DOM on child added and reload
  function addTrains (snapshot){
      //defining variables from snapshot
          var newObj = snapshot.val();
          var id = snapshot.key;
          var name = newObj.name;
          var destination = newObj.destination;
          var departureTime = newObj.time 
          var timeUntilDeparture;
          var departureFrequency = parseInt(newObj.frequency);

      //to check the departure time
          var rightNow = moment().format('HH:mm')
          var now = moment(rightNow, "HH:mm");
          var leaving = moment(departureTime,"HH:mm");
      //check to see if first train left
        if(rightNow < departureTime) {
            console.log("in here");
            timeUntilDeparture = leaving.diff(now, 'minutes');
            console.log("time until" + timeUntilDeparture)
            addInfo(name, destination, departureFrequency, departureTime, timeUntilDeparture, id )
          }
       //calculate the new departure time if the frist train left already   
        else {
            //caluculates the number of departures and adds 1 
              var numberDepartures = (parseInt(((now.diff(leaving, 'minutes'))/departureFrequency),10))+1;
              var intervalFirstDepature = numberDepartures * departureFrequency
              var newDepartureTime = moment(leaving).add(intervalFirstDepature, 'minutes');
            
              timeUntilDeparture = newDepartureTime.diff(now, 'minutes');
            
              newDepartureTime = newDepartureTime.format("HH:mm");
            //sends info from snapshot to addInfo to update the DOM
              addInfo(name, destination, departureFrequency, newDepartureTime , timeUntilDeparture, id);
       
        }  
    }

  function addInfo (name, destination, departureFrequency , departureTime ,  timeUntilDeparture, id) {
        //dyanimcally create table
          var newRow = $("<tr>");
          newRow.addClass("train-row");
          //add snapshot key to row to remove on clear button click
          newRow.attr("data-id", id);
          var clearTd = $("<td>")
          //create span to display font awesome image
          var clearSpan = $("<span>").html("<i class='far fa-times-circle'></i>");
          clearTd.append(clearSpan);
          clearTd.addClass("clear-row");
          clearTd.attr("data-id", id);
          var nameTd = $("<td>").text(name);
          var destinationTd = $("<td>").text(destination);
          var frequencyTd = $("<td>").text(departureFrequency);
          var departureTd = $("<td>").text(departureTime);
          var timeUntilTd = $("<td>").text(timeUntilDeparture);
          
        
          newRow.append(nameTd);
          newRow.append(destinationTd);
          newRow.append(frequencyTd);
          newRow.append(departureTd);
          newRow.append(timeUntilTd);
          newRow.append(clearTd);
          $(".train-times").append(newRow);
  }
//onclick event to remove train from DOM and database
  $(document).on("click", ".clear-row", function(){
          var clearId = $(this).attr("data-id");
          console.log(clearId);
          removeTrain(clearId);
          $(this).parent(".train-row").remove();
    });
//function to removeTrain from database
  function removeTrain(key){
        database.ref().child(key).remove();
  }