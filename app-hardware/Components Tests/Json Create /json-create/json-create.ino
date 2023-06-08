#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>


void setup() {
  delay(2000);


  DynamicJsonDocument doc(2048);
  doc["hello"] = "world";
  JsonArray array = doc.createNestedArray("myArray");
  array.add(10);
  array.add(20);
  array.add(30);

  String json;
  serializeJson(doc, json);
  WiFiClient client;
  HTTPClient http;
  http.begin(client, "http://httpbin.org/post");
  http.POST(json);
  Serial.print(http.getString());
  http.end();
} 

void loop() {
  // not used in this example
}