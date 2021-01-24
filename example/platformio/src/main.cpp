#include <Arduino.h>
#include "Adafruit_FreeTouch.h"
#include "HID-Project.h"
#include "Wire.h"
#include "SPI.h"

Adafruit_FreeTouch qt_1 = Adafruit_FreeTouch(A0, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);
Adafruit_FreeTouch qt_2 = Adafruit_FreeTouch(A1, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);
Adafruit_FreeTouch qt_3 = Adafruit_FreeTouch(A2, OVERSAMPLE_4, RESISTOR_20K, FREQ_MODE_NONE);

void ledsOff();
void flashLED(uint8_t led, uint16_t duration);
void pulseLED(uint8_t led);
void pulseWhite();
void testIO();
void testUart1();
void testI2C();
void testSPI();

void setup() {
  // HID
  Keyboard.begin();
  // Serial
  Serial.begin(9600);
  Serial.println("Start!");
  // Init and test LEDs
  ledsOff();
  flashLED(LED_R, 1e3);
  flashLED(LED_G, 1e3);
  flashLED(LED_B, 1e3);
  pulseLED(LED_R);
  pulseLED(LED_G);
  pulseLED(LED_B);
  pulseWhite();
  ledsOff();
  
  // Periperial Tests:
  //testUart1();
  //testI2C();
  //testIO();
  //testSPI();

  // Init Touch
  qt_1.begin();
  qt_2.begin();
  qt_3.begin();
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
    Keyboard.write(KEY_VOLUME_MUTE);
    Serial.println('R');
    delay(200);
  }else{
    digitalWrite(LED_R, HIGH);
  }

  if(result2 > 500){
    digitalWrite(LED_G, LOW);
    Keyboard.write(KEY_VOLUME_UP);
    Serial.println('G');
    delay(200);
  }else{
    digitalWrite(LED_G, HIGH);
  }

  if(result3 > 500){
    digitalWrite(LED_B, LOW);
    Keyboard.write(KEY_VOLUME_DOWN);
    Serial.println('B');
    delay(200);
  }else{
    digitalWrite(LED_B, HIGH);
  }

}

void ledsOff() {
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  digitalWrite(LED_R,HIGH);
  digitalWrite(LED_G,HIGH);
  digitalWrite(LED_B,HIGH); 
}

void flashLED(uint8_t led, uint16_t duration) {
  digitalWrite(LED_R,!(LED_R==led));
  digitalWrite(LED_G,!(LED_G==led));
  digitalWrite(LED_B,!(LED_B==led));
  delay(duration);
  ledsOff();
}

void pulseLED(uint8_t led) {
  ledsOff();
  for(uint8_t i=255; i>0; i--) {
    analogWrite(led, i);
    delay(2);
  }
  for(uint8_t i=0; i<255; i++) {
    analogWrite(led, i);
    delay(2);
  }
  ledsOff();
}

void pulseWhite() {
  ledsOff();
  for(uint8_t i=255; i>0; i--) {
    analogWrite(LED_R, i);
    analogWrite(LED_G, i);
    analogWrite(LED_B, i);
    delay(2);
  }
  for(uint8_t i=0; i<255; i++) {
    analogWrite(LED_R, i);
    analogWrite(LED_G, i);
    analogWrite(LED_B, i);
    delay(2);
  }
  ledsOff();
}

void testIO() {
  Serial.println("Probe D1-D4 and SWDIO, SWCLK with oscilloscope or piezo.");
  pinMode(D1,OUTPUT);
  pinMode(D2,OUTPUT);
  pinMode(D3,OUTPUT);
  pinMode(D4,OUTPUT);
  pinMode(SWDIO,OUTPUT);
  pinMode(SWCLK,OUTPUT);
  uint8_t i = 0;
  while(1) {
    i++;
    digitalWrite(D1,(i>>1)&1);
    digitalWrite(D2,(i>>2)&1);
    digitalWrite(D3,(i>>3)&1);
    digitalWrite(D4,(i>>4)&1);
    digitalWrite(SWDIO,(i>>5)&1);
    digitalWrite(SWCLK,(i>>6)&1);
    delay(1);
  }
}

void testUart1() {
  Serial1.begin(9600);
  while(1) {
    Serial.print("Connect D1 (TX) and D2 (RX) for loopback; Serial1 Bytes available: ");
    Serial.println(Serial1.available());
    Serial1.write("A");
    delay(1e3);
  }
}

void testI2C() {
  Wire.begin();
  Serial.println("Sending via I2C D1 (SDA) D2 (SCL)");
  while(1) {
    Serial.print(".");
    Wire.beginTransmission(4); // transmit to device #4
    Wire.write("beef");        // sends four bytes
    Wire.endTransmission();    // stop transmitting
    delay(1e2);
  }
}

void testSPI() {
  SPI.begin();
  uint8_t val1,cnt=0;
  SPISettings settings(4000000, MSBFIRST, SPI_MODE0);
  while(1) {
    SPI.beginTransaction(settings);
    val1 = SPI.transfer(0x42);
    SPI.endTransaction();
    if(cnt++ == 0) {
      Serial.print("Test SPI, connect MOSI (D3) and MISO (SWCLK) OR GND and MISO (SWCLK): ");
      Serial.print(val1, HEX);
      Serial.println(" ");
    }
    delay(2);
  }
}