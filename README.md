# PicoPlanet
![Product Image](https://github.com/bleeptrack/picoplanet/blob/master/imgs/product-img.jpg)
PicoPlanet is a series of procedurally designed PCBs.  
Available here: [Tindie](https://www.tindie.com/products/bleeptrack/picoplanet/)  
More information about the design process: link coming soon    

### Features:

- Dimensions: 27.0 x 89.2 mm

- SAMD21
- USB-C
- 3 capacitive touch buttons (planets)
- 1 RGB LED
- 4 additional pins on the backside with 3.3V and 5V

### Pinout
#### Front
![Pinout Front](https://github.com/bleeptrack/picoplanet/blob/master/imgs/pinout_front.png)
#### Back
![Pinout Back](https://github.com/bleeptrack/picoplanet/blob/master/imgs/pinout_back.png)

### Usage

Important: because the PCBs are procedurally generated, the threshold values for the capacitive touch buttons might need to be adjusted by you.

#### Circuit Python (recommended)

- Download Circuit Python from [circuitpython.org](https://circuitpython.org/board/picoplanet/)
- Connect your PicoPlanet to your PC. A drive called PLANETBOOT should appear.
- Place the firmware on the PLANETBOOT drive and wait for a moment. PLANETBOOT will dismount and a new drive called CIRCUITPY will appear. 
- More information on Circuit Python can be found here: [CPY getting started](https://learn.adafruit.com/welcome-to-circuitpython)

#### Arduino
- In your Arduino IDE, unter File > Preferences add `https://boards.bleeptrack.de/package_bleeptrack_index.json` to "Additional Boards Manager URLs"
- Open your Board Manager. Search for "bleeptrack boards" and install them.
- Choose bleeptrack boards > PicoPlanet in your Board selection
- Compile and upload :)
- If Arduino does not detect your PicoPlanet board, bring your board into bootloader mode by connecting a wire to the GND pin on the backside and double tap the RESET pad with the other end of the wire. The PLANETBOOT drive should appear now and the Arduino IDE will recognize the board again. See [example video](https://youtu.be/1Hi12uxtpS8). 
- The LED RGB Pins can directly be accessed by `LED_R`, `LED_G`, `LED_B`

#### Troubleshooting
- `bossac` not found when compiling Arduino Sketch: reinstall `bleeptrack-boards` package or install another package that contains bossac like `Arduino SAMD Boards (32-bits ARM Cortex-M0+)`

## Generator

You can play with the generator yourself. Run `npm install` in the `generator` folder to download the dependencies. Open `index.html` and reload the page to generate a new image. You have two options to save: `Perfect Purple` gives a SVG that is compatible with svg2shenzen and is made for typical PCBs (like the Oshpark's Perfect Purple). You can also choose `After Dark` which is specifically made for Oshpark's After Dark with a black base plate and a clear solder mask.

The generated images are currently not suitable to use them directly for pen plotters (and in the vector format also not for laser cutters). You might need to adjust them to your needs.

You are free to use the code and the generated images in any non-commercial way. 

## Accessories
- A case by [tinyledmatrix](https://twitter.com/tinyledmatrix) can be found in this repo in the ``frameCase`` folder
- Another case by [pantoffel](https://twitter.com/Akkefrietje) is on Thingiverse: [Bumpercase](https://www.thingiverse.com/thing:4583005)

