# install adafruit HID library to use keyboard functionality
# see https://github.com/adafruit/Adafruit_CircuitPython_Bundle/releases

import time
import board
import touchio
from digitalio import DigitalInOut, Direction, Pull
#import usb_hid
#from adafruit_hid.consumer_control import ConsumerControl
#from adafruit_hid.consumer_control_code import ConsumerControlCode

#init touch buttons
touch1 = touchio.TouchIn(board.A0)
touch2 = touchio.TouchIn(board.A1)
touch3 = touchio.TouchIn(board.A2)

#init led lines
ledG = DigitalInOut(board.D5)
ledG.direction = Direction.OUTPUT
ledR = DigitalInOut(board.D6)
ledR.direction = Direction.OUTPUT
ledB = DigitalInOut(board.D7)
ledB.direction = Direction.OUTPUT

#uncomment these if keyboard library is installed. See top comment
#time.sleep(1)  # Sleep for a bit to avoid a race condition on some systems
#cc = ConsumerControl(usb_hid.devices)

print("starting...")
#important: LED is active when False!
#important: capacitive values might need adjustment depending on your procedural design


while True:
    if touch1.raw_value > 2500:
        print(touch1.raw_value)
        #cc.send(ConsumerControlCode.VOLUME_INCREMENT) #uncomment if keyboard library is installed
        ledR.value = False
        time.sleep(0.2)
    else:
        ledR.value = True



    if touch2.raw_value > 2500:
        print(touch2.raw_value)
        #cc.send(ConsumerControlCode.VOLUME_DECREMENT)  #uncomment if keyboard library is installed
        ledG.value = False
        time.sleep(0.2)
    else:
        ledG.value = True


    if touch3.raw_value > 2500:
        print(touch3.raw_value)
        #cc.send(ConsumerControlCode.MUTE)  #uncomment if keyboard library is installed
        ledB.value = False
        time.sleep(0.2)
    else:
        ledB.value = True

