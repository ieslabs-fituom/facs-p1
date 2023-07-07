#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>


const char* ssid = "Among_US";
const char* password = "lakmina2055176";
const char* serverName = "http://192.168.1.3:80/api.php";
String apiKeyValue = "tPmAT5Ab3j7F9";
String time_string;

  DynamicJsonDocument doc(2048);
  JsonArray array;


void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}


String createJSON() {

  String json;
  serializeJson(doc, json);
  return json;
}


int sendToServer() {  // return -> >0 - success, <0 - failure, 0 - wifi disconnected
  String json = createJSON();
  connectWifi();
  int connetionTry = 0;
  while(WiFi.status() != WL_CONNECTED){
    connetionTry++;
    connectWifi();
    if(connetionTry>=20){
      break;
    }
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    Serial.println(json);
    int httpResponseCode = http.POST(json);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
 
    }
    http.end();
    return httpResponseCode;
  } else {
    Serial.println("WiFi Disconnected");

    return 0;
  }
}



void setup() {
 Serial.begin(115200);
  connectWifi();

}



void loop() {
  // Create a JSON document




  //add data
  doc["api_key"] = "tPmAT5Ab3j7F9";
  doc["session_id"] = "NULL";
  array = doc.createNestedArray("attendance");
  array.add('405237');
  array.add('241057');
 
/
  // Send the JSON data to the server
  sendToServer();

  delay(5000); // Wait for 5 seconds before sending the next request
}


