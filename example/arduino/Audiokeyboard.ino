#include "Adafruit_FreeTouch.h"
#include "HID-Project.h"
#include <Wire.h> //I2C-Bibliothek

//blaue led 4
// rote led 3

Adafruit_FreeTouch qt_1 = Adafruit_FreeTouch(A0, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);
Adafruit_FreeTouch qt_2 = Adafruit_FreeTouch(A1, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);
Adafruit_FreeTouch qt_3 = Adafruit_FreeTouch(A2, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  Serial.begin(9600);
  Wire.begin();
  
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);

  if (! qt_1.begin())  
    Serial.println("Failed to begin qt on pin A0");
  if (! qt_2.begin())  
    Serial.println("Failed to begin qt on pin A0");
  if (! qt_3.begin())  
    Serial.println("Failed to begin qt on pin A0");

  Keyboard.begin();
}

// the loop function runs over and over again forever
void loop() {
  /*digitalWrite(3, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(3, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                     // wait for a second
  */


  int result1 = qt_1.measure(); 
  int result2 = qt_2.measure(); 
  int result3 = qt_3.measure(); 

 
  if(result1 > 500){
    digitalWrite(LED_R, LOW);
    Keyboard.write(KEY_VOLUME_MUTE);
    delay(200);
  }else{
    digitalWrite(LED_R, HIGH);
  }

  if(result2 > 500){
    digitalWrite(LED_G, LOW);
    Keyboard.write(KEY_VOLUME_UP);
    delay(200);
  }else{
    digitalWrite(LED_G, HIGH);
  }

  if(result3 > 500){
    digitalWrite(LED_B, LOW);
    Keyboard.write(KEY_VOLUME_DOWN);
    delay(200);
  }else{
    digitalWrite(LED_B, HIGH);
  }


  

  //delay(200);
}
