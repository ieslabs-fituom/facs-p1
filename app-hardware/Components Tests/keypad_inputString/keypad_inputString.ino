#include <Keypad.h>

#define ROW_NUM     4 // four rows
#define COLUMN_NUM  4 // four columns

char keys[4][4] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', ' '}
};

byte pin_rows[4] = {32, 13, 12, 14};
byte pin_column[4] = {27, 26, 25, 33};

Keypad keypad = Keypad( makeKeymap(keys), pin_rows, pin_column, ROW_NUM, COLUMN_NUM );

String inputString;

long inputInt;

void setup() {
  Serial.begin(9600);
  inputString.reserve(5);
}

void loop() {
  
  char key = keypad.getKey();
   if(key){
     Serial.print(key);
     if (key != ' ') {     // only act on numeric keys
      inputString += key;               // append new character to input string
    
    }else {
      inputString = "";
    
    }

  
  }
}
