#include <Keypad.h>

#define ROW_NUM     4
#define COLUMN_NUM  4 

char keys[ROW_NUM][COLUMN_NUM] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte pin_rows[ROW_NUM]      = {19, 18, 5, 17}; 
byte pin_column[COLUMN_NUM] = {16, 4, 0, 2};   

Keypad keypad = Keypad( makeKeymap(keys), pin_rows, pin_column, ROW_NUM, COLUMN_NUM );

string value="";

void setup() {
  Serial.begin(9600);
}

void loop() {
  char key = keypad.getKey();
  while(key){
    value+=key;
    key = keypad.getkey();
  }

  if (value) {
    Serial.println(value);
  }
}