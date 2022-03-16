# install adafruit HID library to use keyboard functionality
# see https://github.com/adafruit/Adafruit_CircuitPython_Bundle/releases
# modification of example to handle kbd.send and layout.write

import time
import board
import touchio
from digitalio import DigitalInOut, Direction, Pull

import usb_hid
#consumer_control
from adafruit_hid.consumer_control import ConsumerControl
from adafruit_hid.consumer_control_code import ConsumerControlCode

#keyboard
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS
from adafruit_hid.keycode import Keycode

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
time.sleep(1)  # Sleep for a bit to avoid a race condition on some systems
cc = ConsumerControl(usb_hid.devices)

 
# the keyboard object!
# sleep for a bit to avoid a race condition on some systems
time.sleep(1)
kbd = Keyboard(usb_hid.devices)
# we're americans :)
layout = KeyboardLayoutUS(kbd)

print("starting...")
#important: LED is active when False!
#important: capacitive values might need adjustment depending on your procedural design


while True:
    if touch1.raw_value > 2500:
        print(touch1.raw_value)
        #cc.send(ConsumerControlCode.VOLUME_INCREMENT) #uncomment if keyboard library is installed
        #layout.write("Hello World!\n")
        kbd.send(Keycode.LEFT_CONTROL, Keycode.S)
        ledR.value = False
        time.sleep(0.2)
    else:
        ledR.value = True



    if touch2.raw_value > 2500:
        print(touch2.raw_value)
        #cc.send(ConsumerControlCode.VOLUME_DECREMENT)  #uncomment if keyboard library is installed
        #kbd.send(Keycode.LEFT_CONTROL, Keycode.SHIFT, Keycode.ESCAPE)
        #layout.write("Hello World!\n")
        kbd.send(Keycode.LEFT_CONTROL, Keycode.V)
        ledG.value = False
        time.sleep(0.2)
    else:
        ledG.value = True


    if touch3.raw_value > 2500:
        print(touch3.raw_value)
        #cc.send(ConsumerControlCode.MUTE)  #uncomment if keyboard library is installed
        #kbd.send(Keycode.LEFT_CONTROL, Keycode.SHIFT, Keycode.ESCAPE)
        #layout.write("Hello World!\n")
        kbd.send(Keycode.LEFT_CONTROL, Keycode.C)
        ledB.value = False
        time.sleep(0.2)
    else:
        ledB.value = True
