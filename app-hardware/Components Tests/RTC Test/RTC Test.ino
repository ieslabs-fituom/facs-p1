

#include "RTClib.h"

RTC_DS1307 rtc;

void setup () {
  Serial.begin(9600);
  rtc.begin();
}

 
void loop() {
 DateTime time = rtc.now();
 Serial.print(String("\n"+time.timestamp(DateTime::TIMESTAMP_FULL)));
 delay(2000);
}
