#include <RTClib.h>
#include <Wire.h>
#include "time.h"

RTC_DS3231 rtc;
String time_string;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  rtc.begin(); 

  while (!rtc.begin()) { //if rtc not connected
    Serial.println("Couldn't find RTC");
    delay(300); //
  }

  boolean rtcLostPower = false;//check whether battery is disconnected
  if (rtc.lostPower()) {
    Serial.println("RTC lost po wer. Please connect to a WIFI to Set Time!");//
  
    rtcLostPower = true;
    rtc.adjust(DateTime(2023, 4, 11, 12, 25, 0));
  }
  
}

void loop() {
   DateTime time = rtc.now(); //date time 
      time_string = time.timestamp(DateTime::TIMESTAMP_FULL);//time stamp function  yy,mm,dd,time
      Serial.print(time_string);//serial print

}
