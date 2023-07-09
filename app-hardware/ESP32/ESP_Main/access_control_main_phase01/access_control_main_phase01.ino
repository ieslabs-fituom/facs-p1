

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
#include "time.h"
#include "FS.h"
#include "SD.h"



//PIN DEFINITIONS HERE
#define RC522_RST_PIN 15
#define RC522_SS_PIN 4
#define RDM6300_RX_PIN 2
#define SD_CS_PIN 5


//VARIABLES AND CONSTANTS DEFINITION HERE
unsigned long uid = 0;
const char* ssid = "Among_US";
const char* password = "lakmina2055176";
const char* serverName = "http://192.168.1.3:80/api.php";
String apiKeyValue = "tPmAT5Ab3j7F9";
String time_string;


//PIN DEFINITIONS
MFRC522 mfrc522(RC522_SS_PIN, RC522_RST_PIN);
Rdm6300 rdm6300;
RTC_DS3231 rtc;
LiquidCrystal_I2C lcd(0x27, 16, 2);

// KEYPAD DEFINITION
#define ROW_NUM 4     
#define COLUMN_NUM 4  
char keys[4][4] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', ' ' }
};

byte pin_rows[] = {32, 33, 25, 26 };
byte pin_column[] = {27, 14, 12, 13};
Keypad keypad = Keypad(makeKeymap(keys), pin_rows, pin_column, ROW_NUM, COLUMN_NUM);
String keypadInputString = "";
int uidInputEnabled = false;
String currentSessionID = "NULL";
String dataSendCode = "ABC";
String resetCode = "CBA";
String deepsleeepCode = "1234ABC";

DynamicJsonDocument doc(2048);
JsonArray array;

//IN-CODE VARIABLES DEFINITION
int deepsleeptimer = 0;
bool rtcLostPower = false;


// NTP server Setup
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 3600;
const int   daylightOffset_sec = 3600;



// USED TO GET CARD UID FROM RFID 
unsigned long readCard() {
  unsigned long hex_num;

  if (rdm6300.get_new_tag_id()) {
    delay(10);
    hex_num = rdm6300.get_tag_id();
    delay(10);
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

// USED TO PRINT TEXT TO LCD DISPLAY

void printLCD(int cursorX, int cursorY, unsigned long uid, String data) {
  uint64_t cardSize = SD.cardSize() / (1024 * 1024);
  Serial.printf("SD Card Size: %lluMB\n", cardSize);
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(cursorX, cursorY);
  if (uid == NULL) {
    lcd.print(data);
  } else {
    lcd.print(uid);

  }
}

int setTimeNTP(){
  if(connectWifi()){
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    struct tm timeinfo;
    if(!getLocalTime(&timeinfo)){
      Serial.println("Failed to obtain time");
      return -1;
    }
    Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
    rtc.adjust(DateTime(&timeinfo, "%Y, %m, %d, %H, %M, %S" ));
    //rtc.adjust(DateTime(2023, 4, 11, 12, 25, 0));
  }else
  {
    printLCD(0,0,NULL,"No Internet Connection");
    delay(2000);
  }
  

}


//USED TO CONNECT WITH WIFI AP USING GIVEN CREDENTIALS
int connectWifi() {
  int timeoutCount = 0;
  if (WiFi.status() != WL_CONNECTED) {
    printLCD(0, 0, NULL, "WIFI Connecting...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      WiFi.begin(ssid, password);
      delay(500);
      timeoutCount++;
      Serial.print(".");
      if(timeoutCount > 30){
        printLCD(0,0,NULL,"COULDN'T CONNECT");
        printLCD(0,1,NULL,"TO WIFI");
        break;
      }
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.print("Connected. IP Address: ");
      Serial.println(WiFi.localIP());
      printLCD(0, 0, NULL, "WIFI Connected");
      //printLCD(1, 0, NULL, String(WiFi.localIP()));
      delay(2000);
      lcd.clear();
      return 1;
      // if(rtcLostPower){
      //     connectWifi();
      //     rtcLostPower = false;
      // }
    }
    return 0;
  }
}

int sendToServer() {  // THIS RETURNS -> > 0 - SUCCESS, <-1 - FAILURE
  String json = createJSON();
  String attendanceRecordPath = currentSessionID + ".txt";
  writeFile(SD, attendanceRecordPath, json);
  connectWifi();

  if (WiFi.status() == WL_CONNECTED) {
    printLCD(0, 0, NULL, "Sending Data...");
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
      printLCD(0, 0, NULL, "Error");
    }
    http.end();
    return httpResponseCode;
  } 
  
  else {
    printLCD(0, 0, NULL, "Data Upload Error");
    printLCD(0, 1, NULL, "Check WIFI>Retry");
    String attendanceRecordPath = currentSessionID + ".txt";
    writeFile(SD, attendanceRecordPath, json);
    return 0;
  }
}

/*String getKeypadInput(){
  char key = keypad.getKey();
    while (key) {
      if (key) {
        if (key != ' ') {
          Serial.print(String(key));
          keypadInputString += key;
          key = keypad.getKey();
          lcd.setCursor(0, 1);
          lcd.print(keypadInputString);
        }
        else{
          return keypadInputString;

        }
      }
}*/


String createJSON() {
  /*DynamicJsonDocument doc(2048);
  doc["api_key"] = "tPmAT5Ab3j7F9";
  doc["session_id"] = 34;
  JsonArray array = doc.createNestedArray("attendance");
  int size_attendanceList = sizeof(attendanceList) / sizeof(attendanceList[0]);
  if (size_attendanceList > 0) {
    for (int arrayCount = 0; arrayCount < size_attendanceList; arrayCount++) {
      array.add(attendanceList[arrayCount]);
    }
  }*/
  String json;
  serializeJson(doc, json);
  return json;
}


/// SD MODULE FUNCTIONS


void readFile(fs::FS& fs, const char* path) {
  Serial.printf("Reading file: %s\n", path);

  File file = fs.open(path);
  if (!file) {

    return;
  }

  while (file.available()) {
    Serial.write(file.read());
  }
  file.close();
}

void writeFile(fs::FS& fs, String path, String message) {
  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    printLCD(0,0,NULL,"Error While");
    printLCD(0,0,NULL,"SD Writing! ");
    return;
  }
  if (file.print(message)) {
    printLCD(0,0,NULL,"SD Save Success");
  } else {
    printLCD(0,0,NULL,"SD Save failed");
  }
  file.close();
}

void espDeepSleep(){
    printLCD(0,0,NULL,"Device Sleep Mode");
    delay(2000);
    printLCD(0,0,NULL, "To Abort, Hold");
    delay(3000);
    printLCD(0,1,NULL," Push Button");
    delay(2000);
    if(digitalRead(16)==LOW){
      printLCD(0,0,NULL,"Device Slept!");
      delay(10);
      printLCD(0,0,NULL,"Push to Start");
      delay(10);
      esp_deep_sleep_start();
    }else{
      printLCD(0,0,NULL,"Sleep Aborted!");
      delay(2000);
    }
}


void deleteFile(fs::FS& fs, const char* path) {
  if (fs.remove(path)) {
    printLCD(0,0,NULL,"SD FILES Deleted");
  } else {
    printLCD(0,0,NULL,"SD FORMAT FAILED!");
  }
}



void setup() {
  //LIBRARY INITIALTIONS
  Serial.begin(115200);

  //LCD DISPLAY
  lcd.init();
  lcd.clear();
  lcd.backlight();


  SPI.begin();

  mfrc522.PCD_Init();
  delay(1000); 

  printLCD(0, 0, NULL, "Initializing");
  lcd.setCursor(1,0);
  printLCD(1, 0, NULL, "RDM 6300");
  rdm6300.begin(RDM6300_RX_PIN);

  pinMode(16, INPUT);

  // DS3231 RTC setup
  Wire.begin();

  printLCD(0, 0, NULL, "Initializing RTC");
  delay(1000);
  rtc.begin();
  while (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    printLCD(0, 0, NULL, "RTC Initialization");
    lcd.setCursor(0, 1);
    lcd.print("Failed");
    delay(3000);
  }

  rtcLostPower = false;
  if (rtc.lostPower()) {
    Serial.println("RTC lost power. Please connect to a WIFI to Set Time!");
    printLCD(0, 0, NULL, "RTC Lost Power");
    printLCD(0, 1, NULL, "Connect to WIFI to set Time");
    rtcLostPower = true;
    //rtc.adjust(DateTime(2023, 4, 11, 12, 25, 0));
  }

  printLCD(0, 0, NULL, "Initializing SD Card");
  delay(1000);
  while (!SD.begin(SD_CS_PIN)) {
    Serial.println("Card Mount Failed");
    printLCD(0, 0, NULL, "SD Card Mount");
    lcd.setCursor(0, 1);
    lcd.print("Failed"); 
    delay(3000); 
    }

  

  printLCD(0, 0, NULL, "Initializing");
  printLCD(0, 1, NULL, "RC 522");
  lcd.setCursor(1,0);
  delay(1000);
  while (!mfrc522.PCD_PerformSelfTest()) {
    Serial.println("RC522 Failed");
    printLCD(0, 0, NULL, "RC522 Initialization");
    lcd.setCursor(0, 1);
    printLCD(1,0, NULL, "Failed!");
    delay(3000); 
    }

  if (rtcLostPower) {
    connectWifi();
  }

  uidInputEnabled = false;

  doc["api_key"] = "tPmAT5Ab3j7F9";
  doc["session_id"] = "NULL";
  array = doc.createNestedArray("attendance");
  printLCD(0, 0, NULL, "System Starting");
  delay(1000);

  
  printLCD(0, 0, NULL, "Enter Session ID");
  lcd.setCursor(0, 1);

  // DEEPSLEEP WAKEUP PIN
  esp_sleep_enable_ext0_wakeup(GPIO_NUM_36, 0);

  

}



void loop() {
  if (uidInputEnabled == true) {
    if (digitalRead(16) == LOW) {
      uidInputEnabled = false;
      if (currentSessionID != "NULL") {
        printLCD(0, 0, NULL, "Enter Password");
        printLCD(0, 1, NULL, "or Press Enter");
        lcd.setCursor(0, 1);
      }
    }
 } 

  if (uidInputEnabled == true) {
    
    delay(30);

    if (uid != 0) {
      array.add(String(uid));
      lcd.clear();
      //CREATING A DATETIME OBJECT TO RTC
      DateTime time = rtc.now();
      time_string = time.timestamp(DateTime::TIMESTAMP_FULL);
      Serial.print(time_string);
      Serial.println(uid);
      printLCD(0, 0, uid, "");
      uid = 0;
      delay(3000);
      lcd.noBacklight();
    }
  } else {
    char key = keypad.getKey();
    while (key) {
    Serial.println("while codes");
      if (key) {
        if (key != ' ') {
          if (key == '*'){
            keypadInputString = "";
            lcd.setCursor(0, 1);
            lcd.print(keypadInputString);

          }else{
            Serial.print(String(key));
            keypadInputString += key;
            key = keypad.getKey();
            lcd.setCursor(0, 1);
            lcd.print(keypadInputString);
          }

          
        }
         else {
          if (currentSessionID == "NULL") {
            // GET SESSION ID
            if (keypadInputString != "") {
              Serial.print(keypadInputString);
              printLCD(0, 0, NULL, "Session Assigned");
              currentSessionID = keypadInputString;
              uidInputEnabled = true;
              doc["session_id"] = currentSessionID;
              keypadInputString = "";
              break;
            }
          } else {
            //GET KEYPAD INPUT FOR ACTIONS
            if (keypadInputString == dataSendCode) {
              //Serial.println("Data sending");
              int result = sendToServer();
              if (result > 0) {
                if (result == 200) {
                  printLCD(0, 0, NULL, "DB send Successful");
                } else {
                  printLCD(0, 0, NULL, "Send Unsuccessful");
                  delay(1000);
                  printLCD(0, 0, NULL, "Saving in SD");
                  // String attendanceRecordPath = currentSessionID + ".txt";
                  // writeFile(SD, attendanceRecordPath, json);
                }
              } else if (result < 0) {
                printLCD(0, 0, NULL, "Error occured");
                delay(100);
                printLCD(0, 1, NULL, "While data sending");
                delay(1000);
                printLCD(0, 0, NULL, "Saving SD");
                // String attendanceRecordPath = currentSessionID + ".txt";
                // writeFile(SD, attendanceRecordPath, json);
              }
              currentSessionID = "NULL";
              uidInputEnabled = false;
              array.clear();
              doc["session_id"] = "";
              delay(1000);
              printLCD(0, 0, NULL, "Enter Session ID");
              lcd.setCursor(0, 1);
              keypadInputString = "";
              key = true;
            } 
            else if (keypadInputString == resetCode) {
              // Reset session
              Serial.println("Resetting Session");
              keypadInputString = "";
            }
            else if(keypadInputString == deepsleeepCode) {
              espDeepSleep();
              keypadInputString="";
            }
            
            else {
              keypadInputString = "";
              uidInputEnabled = true;
              printLCD(0, 0, NULL, "Incorrect PW");
              delay(2000);
              printLCD(0, 1, NULL, "Produce ID Card");
              delay(1000);
              break;
            }
          }
        }
      }
    }
  }
}

