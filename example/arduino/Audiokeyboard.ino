//Important! Adafruit Freetouch Library is needed for the capacitive
//touch buttons to work. Install via Library Manager!
//https://www.arduino.cc/reference/en/libraries/adafruit-freetouch-library/

// This Example uses the HID-Project Library for
// Media control. Uncomment marked lines if you have
// https://github.com/NicoHood/HID installed

#include "Adafruit_FreeTouch.h"
//#include "HID-Project.h" //uncomment if HID library installed. See top comment

//capacitive button init
Adafruit_FreeTouch qt_1 = Adafruit_FreeTouch(A0, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);
Adafruit_FreeTouch qt_2 = Adafruit_FreeTouch(A1, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);
Adafruit_FreeTouch qt_3 = Adafruit_FreeTouch(A2, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);


void setup() {

  Serial.begin(9600);

  //Set LED lines as output so we can use them
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);

  //check if capacitive buttons are working
  if (! qt_1.begin())
    Serial.println("Failed to begin qt on pin A0");
  if (! qt_2.begin())
    Serial.println("Failed to begin qt on pin A0");
  if (! qt_3.begin())
    Serial.println("Failed to begin qt on pin A0");

  //Keyboard.begin(); //uncomment if HID library installed. See top comment
}

void loop() {

  //meassure values at capacitive touch buttons
  int result1 = qt_1.measure();
  int result2 = qt_2.measure();
  int result3 = qt_3.measure();


  //check if button is pressed aka value is high enough
  //important: LEDs are active when LOW!
  if(result1 > 500){
    digitalWrite(LED_R, LOW);
    //Keyboard.write(KEY_VOLUME_MUTE); //uncomment if HID library installed. See top comment
    delay(200);
  }else{
    digitalWrite(LED_R, HIGH);
  }

  if(result2 > 500){
    digitalWrite(LED_G, LOW);
    //Keyboard.write(KEY_VOLUME_UP);   //uncomment if HID library installed. See top comment
    delay(200);
  }else{
    digitalWrite(LED_G, HIGH);
  }

  if(result3 > 500){
    digitalWrite(LED_B, LOW);
    //Keyboard.write(KEY_VOLUME_DOWN);   //uncomment if HID library installed. See top comment
    delay(200);
  }else{
    digitalWrite(LED_B, HIGH);
  }

}
