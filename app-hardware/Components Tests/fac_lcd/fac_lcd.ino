//LIBRARIES FOR LCD

#include <LiquidCrystal_I2C.h>
#include<Wire.h>

//SAMPLE UID FOR PRINT FUNCTION
unsigned long uid = 527535724114;

//LIBRARY OBJECT CREATION
LiquidCrystal_I2C lcd(0x27, 16, 2);

void printLCD(int cursorX, int cursorY, unsigned long uid, String data) {
      // THIS FUNCTION USED TO PRINT TO LCD DISPLAY
      lcd.backlight();
      lcd.clear();
      lcd.setCursor(cursorX, cursorY);
      if (uid == NULL) {
        lcd.print(data);
      } else {
        lcd.print(uid);
  }

}

void setup() {

  //LCD DISPLAY LIBRARY INITIALTION
  
  lcd.init();
  lcd.backlight();
  lcd.clear();
  
}

void loop() {
    // TEXT STRING SAMPLE LCD PRINT
     printLCD(0, 0, NULL, "WELCOME");
     delay(200);
     lcd.clear();
     printLCD(0, 0, NULL, "Enter Uid :");
     lcd.setCursor(0, 1);
     delay(200);

     // UID SAMPLE LCD PRINT
     printLCD(1, 0, uid, " ");
     delay(200);
        
     
}