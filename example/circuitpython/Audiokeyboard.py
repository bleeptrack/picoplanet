#Blinks LED on pin 13 - Adafruit Edge Badge
#No other files required

import time
import board
import touchio
import pulseio
from digitalio import DigitalInOut, Direction, Pull
import usb_hid
from adafruit_hid.consumer_control import ConsumerControl
from adafruit_hid.consumer_control_code import ConsumerControlCode

touch1 = touchio.TouchIn(board.A0)
touch2 = touchio.TouchIn(board.A1)
touch3 = touchio.TouchIn(board.A2)

ledG = DigitalInOut(board.D5)
ledG.direction = Direction.OUTPUT
ledR = DigitalInOut(board.D6)
ledR.direction = Direction.OUTPUT
ledB = DigitalInOut(board.D7)
ledB.direction = Direction.OUTPUT

time.sleep(1)  # Sleep for a bit to avoid a race condition on some systems
cc = ConsumerControl(usb_hid.devices)

print("starting...")

while True:
    if touch1.raw_value > 2500:
        print(touch1.raw_value)
        cc.send(ConsumerControlCode.VOLUME_INCREMENT)
        ledR.value = False
        time.sleep(0.2)
    else:
        ledR.value = True
        

        
    if touch2.raw_value > 2500:
        print(touch2.raw_value)
        cc.send(ConsumerControlCode.VOLUME_DECREMENT)
        ledG.value = False
        time.sleep(0.2)
    else:
        ledG.value = True

        
    if touch3.raw_value > 2500:
        print(touch3.raw_value)
        cc.send(ConsumerControlCode.MUTE)
        ledB.value = False
        time.sleep(0.2)
    else:
        ledB.value = True

