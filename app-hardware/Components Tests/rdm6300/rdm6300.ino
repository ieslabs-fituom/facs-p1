#include <rdm6300.h>

#define RDM6300_RX_PIN 2

Rdm6300 rdm6300;
int uidInput = false;
void readcard();


void setup() {
  
  Serial.begin(115200);
  rdm6300.begin(RDM6300_RX_PIN);}
   unsigned long uid = 0;

  unsigned long readCard() {  
    
    unsigned long hex_number;
 

  if (rdm6300.get_tag_id()) {   
    delay(100);
    hex_number = rdm6300.get_tag_id();
    delay(100);
    
  }
   return hex_number;
}


void loop(){
  if (uidInput == true) {
    uid = readCard();
    delay(30);
  }

}