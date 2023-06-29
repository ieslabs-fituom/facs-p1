//LIBRARY ADDITION HERE
#include <SPI.h>
#include <MFRC522.h>

//PIN DEFINITIONS HERE
#define RC522_RST_PIN 15
#define RC522_SS_PIN 4


//library intance creation
MFRC522 mfrc522(RC522_SS_PIN, RC522_RST_PIN);

void setup() {
  //LIBRARY INITIALTIONS
  Serial.begin(115200);

  SPI.begin();

  mfrc522.PCD_Init();
  delay(1000);  // Optional delay. Some board do need more time after init to be ready

  Serial.print("Initializing RC522");
 
}

void loop() {
  readCard();
}

unsigned long readCard() {
    unsigned long hex_num;

    
    if (mfrc522.PICC_IsNewCardPresent()) {
      if (!mfrc522.PICC_ReadCardSerial()) {
        return 0;
      } 
      else {
        hex_num = mfrc522.uid.uidByte[0] << 24;
        hex_num += mfrc522.uid.uidByte[1] << 16;
        hex_num += mfrc522.uid.uidByte[2] << 8;
        hex_num += mfrc522.uid.uidByte[3];
        mfrc522.PICC_HaltA(); // stop the card reading
      }
    } else {
      return 0;
    }
  

  return hex_num;
}

