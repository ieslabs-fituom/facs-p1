

// Faculty of Information Technology - Batch 21

//To anyone reading this code. Please read these instructions carefully.
//If you are to change the codes please make sure to put all technical comments in UPPRCASE.





//LIBRARY ADDITION HERE
#include <SPI.h>
#include <rdm6300.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <RTClib.h>
#include <LiquidCrystal_I2C.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>
#include <Keypad.h>





//PIN DEFINITIONS HERE
#define RC522_RST_PIN 15
#define RC522_SS_PIN 5
#define RDM6300_RX_PIN 4
#define ROW_NUM 4     // four rows
#define COLUMN_NUM 4  // four columns

//VARIABLES AND CONSTANTS DEFINITION HERE
unsigned long uid = 0;
const char* ssid = "Iman_WIFI";
const char* password = "12345678";
const char* serverName = "http://192.168.8.142:80/api.php";
String apiKeyValue = "tPmAT5Ab3j7F9";
String time_string;


//PIN DEFINITIONS
MFRC522 mfrc522(RC522_SS_PIN, RC522_RST_PIN);
Rdm6300 rdm6300;
RTC_DS3231 rtc;
LiquidCrystal_I2C lcd(0x27, 16, 2);

// KEYPAD DEFINITION
char keys[4][4] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', ' ' }
};

byte pin_rows[4] = { 13, 12, 14, 27 };
byte pin_column[4] = { 26, 25, 33, 32 };
Keypad keypad = Keypad(makeKeymap(keys), pin_rows, pin_column, ROW_NUM, COLUMN_NUM);
String keypadInputString = "";
long keyPadInputInt;
int uidInputEnabled = false;
String currentSessionID = "";

void setup() {


  delay(5000);
  //LIBRARY INITIALTIONS
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();
  delay(4);  // Optional delay. Some board do need more time after init to be ready
  rdm6300.begin(RDM6300_RX_PIN);


  // DS3231 RTC setup
  Wire.begin();
  rtc.begin();
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
  }
  if (rtc.lostPower()) {
    Serial.println("RTC lost power. Please Set Time!");
    rtc.adjust(DateTime(2023, 4, 11, 12, 25, 0));
  }


  //LCD DISPLAY
  lcd.init();
  lcd.clear();
  lcd.backlight();
  lcd.setCursor(2, 0);

  //WIFI
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected. IP Address: ");
  Serial.println(WiFi.localIP());


  boolean multipleRead = false;

  uidInputEnabled = false;
}

unsigned long readCard() {
  unsigned long hex_num;

  if (rdm6300.get_new_tag_id()) {
    delay(100);
    hex_num = rdm6300.get_tag_id();
    delay(100);
  } else {
    delay(30);
    if (mfrc522.PICC_IsNewCardPresent()) {
      if (!mfrc522.PICC_ReadCardSerial()) {
        return 0;
      } else {
        hex_num = mfrc522.uid.uidByte[0] << 24;
        hex_num += mfrc522.uid.uidByte[1] << 16;
        hex_num += mfrc522.uid.uidByte[2] << 8;
        hex_num += mfrc522.uid.uidByte[3];
        mfrc522.PICC_HaltA();
      }
    } else {
      return 0;
    }
  }

  return hex_num;
}

void printLCD(int cursorX, int cursorY, unsigned long uid, String data) {
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(cursorX, cursorY);
  if (uid == NULL) {
    lcd.print(data);
  } else {
    lcd.print(uid);
  }

  delay(5000);
  lcd.noBacklight();
}

int sendToServer() {  // return -> >0 - success, <0 - failure, 0 - wifi disconnected
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String json = createJSON();
    Serial.print(json);
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

String createJSON() {
  DynamicJsonDocument doc(2048);
  doc["api_key"] = "tPmAT5Ab3j7F9";
  doc["session_id"] = 34;
  JsonArray array = doc.createNestedArray("attendance");
  array.add(1);
  array.add(3);
  String json;
  serializeJson(doc, json);
  return json;
}

void loop() {

  if (uidInputEnabled == true) {
    uid = readCard();
    delay(30);

    if (uid != 0) {
      lcd.clear();
      //CREATING A DATETIME OBJECT TO RTC
      DateTime time = rtc.now();
      time_string = time.timestamp(DateTime::TIMESTAMP_FULL);
      Serial.print(time_string);
      Serial.println(uid);
      printLCD(0, 0, uid, "");
      sendToServer();
      uid = 0;
      delay(1000);
      lcd.clear();
    }
  } else {
    char key = keypad.getKey();
    while (key) {
      if (key) {
        Serial.print(key);
        if (key != ' ') {
          keypadInputString += key;
          key = keypad.getKey();
        } else {
          Serial.print(keypadInputString);
          printLCD(0, 0, NULL, "Session Assigned");
          uidInputEnabled = true;
          currentSessionID = keypadInputString;
          keypadInputString = "";
          break;
        }
      }
    }
  }
}
