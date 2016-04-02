#include <SPI.h>
#include <WiFi101.h>
#include <WiFiSSLClient.h>
#include <MQTTClient.h>

int status = WL_IDLE_STATUS;
MQTTClient client;
WiFiSSLClient net;

int buttonPin = 2;
boolean buttonState = false;
boolean oldButtonState = false;
boolean lightStatus=false;

const char* ssid  = "****";     //  your network SSID (name)
const char* password = "****";  // your network password

const char* userName = "******";
const char* deviceName = "button";
const char* deviceId = "*****";
const char* devicePsw = "******";


void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  client.begin("mqtt.arduino.cc", 8883, net);
  connect();

  pinMode(2, INPUT);
}

void connect() {
  Serial.print("checking wifi...");
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, password);

    // wait 10 seconds for connection:
    delay(4000);
  }

  Serial.println("connecting...");

  while (!client.connect(deviceName, deviceId, devicePsw)) {
    Serial.print(".");
  }

  Serial.println("connected!");
}

void loop() {
  client.loop();

  buttonState = digitalRead(buttonPin);

  if (!buttonState && oldButtonState) {
    lightStatus = !lightStatus;
  
    if (lightStatus) {
      client.publish("/****/button/status", "on");
      Serial.println("publishing on");
    } else {
      client.publish("/****/button/status", "off");
      Serial.println("publishing off");
    }
  }
  
  oldButtonState = buttonState;
  delay(50);
}


void messageReceived(String topic, String payload, char * bytes, unsigned int length) {
  Serial.print("incoming: ");
  Serial.print(topic);
  Serial.print(" - ");
  Serial.print(payload);
  Serial.println();
}
