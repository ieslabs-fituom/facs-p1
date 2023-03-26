#include <MFRC522.h>
#include <SPI.h>

#define RST_PIN        22          // Configurable, see typical pin layout above
#define SS_PIN          21         // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
	Serial.begin(9600);
	mfrc522.PCD_Init();
  SPI.begin();
	delay(4); //added this delay cus mc is slower than we expected. It takes some time to start the initiation
}


unsigned long getID(){
  if ( ! mfrc522.PICC_ReadCardSerial()) { //Since a PICC placed get Serial and continue
    return 0;
  }
  unsigned long hex_num;
  hex_num =  mfrc522.uid.uidByte[0] << 24;
  hex_num += mfrc522.uid.uidByte[1] << 16;
  hex_num += mfrc522.uid.uidByte[2] <<  8;
  hex_num += mfrc522.uid.uidByte[3];
  mfrc522.PICC_HaltA(); // Stop reading
  return hex_num;
}

void loop() {
	

	if(mfrc522.PICC_IsNewCardPresent()) {
  unsigned long uid = getID();
  if(uid != 0){
    Serial.print("Card detected, UID: "); Serial.println(uid);
  }
}
}
