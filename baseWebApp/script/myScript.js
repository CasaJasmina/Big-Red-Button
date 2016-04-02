var mqttBrokerURI = "wss://mqtt.arduino.cc:9002/";
var userName = "";
var deviceName = "";
var deviceId = "";
var devicePsw = "";
var topic="";


$(document).ready(function() {
  console.log (localStorage.getItem("userName"));

  $("input[name=userName]").val(localStorage.getItem("userName"));
  $("input[name=deviceName]").val(localStorage.getItem("deviceName"));
  $("input[name=deviceId]").val(localStorage.getItem("deviceId"));
  $("input[name=devicePsw]").val(localStorage.getItem("devicePsw"));
  $("input[name=topic]").val(localStorage.getItem("topic"));

  $(".monitor").click(function() {
    if ($(".monitor .messages").hasClass("hidden")) {
      $(".monitor .messages").removeClass("hidden");
    } else {
      $(".monitor .messages").addClass("hidden");
    }
  });
});



function connect() {
  setProperties();
  client = new Paho.MQTT.Client(mqttBrokerURI, deviceName);

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({
    userName: deviceId,
    password: devicePsw,
    onSuccess: onConnect,
    onFailure: onConnectionFail
  });
}

function setProperties() {
  userName = $("input[name=userName]").val();
  deviceName = $("input[name=deviceName]").val();
  deviceId = $("input[name=deviceId]").val();
  devicePsw = $("input[name=devicePsw]").val();
  topic = $("input[name=topic]").val();


  localStorage.setItem("userName", userName);
  localStorage.setItem("deviceName", deviceName);
  localStorage.setItem("deviceId", deviceId);
  localStorage.setItem("devicePsw", devicePsw);
  localStorage.setItem("topic", topic);

console.log(localStorage.getItem("userName"));
console.log(localStorage.getItem("deviceName"));
console.log(localStorage.getItem("deviceId"));
console.log(localStorage.getItem("devicePsw"));

}


// Create a client instance

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("connected");
  client.subscribe("/"+userName+"/"+topic);
  console.log("subscribing to "+topic);
}

function onConnectionFail(response) {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Impossible to connect");
  console.log(response);

}
// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log(message);
  $('.messages tr:first').after("<tr><td>" + message.destinationName + "</td><td>" + message.payloadString + "</td></tr>");
  $('.megabutton').removeClass('on');
  $('.megabutton').removeClass('off');
  $('.megabutton').addClass(''+message.payloadString);
  $('.megabutton').text(''+message.payloadString);
}


function sendMessage(topic, val) {
  console.log("sending " + val + " to " + deviceName + "/" + topic);
  message = new Paho.MQTT.Message(val);
  message.destinationName = deviceName + "/" + topic;
  message.payloadString = val;
  client.send(message);
}
