#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>


void setup() {
  delay(2000);
  Serial.begin(115200);
  Serial.print("test");


  DynamicJsonDocument doc(2048);
  doc["api_key"] = "tPmAT5Ab3j7F9";
  doc["session_id"] = 34;
  JsonArray array = doc.createNestedArray("attendance");
  array.add(1);
  array.add(3);
  String json;
  serializeJson(doc, json);
  
  WiFiClient client;
  HTTPClient http;
  http.begin(client, "http://192.168.8.142:80/api.php");
  http.POST(json);
  Serial.print(json);
  http.end();
} 

void loop() {
  // not used in this example
}