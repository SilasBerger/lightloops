from machine import Pin
import neopixel
import time

LED_COUNT = 30
DATA_PIN = 4

strip = neopixel.NeoPixel(Pin(DATA_PIN), LED_COUNT, bpp=3)  # bpp=4 for RGBW, 3 for RGB

DELAY = 0.01
COLOR = (0, 100, 50)

for round in range(5):
    for i in range(LED_COUNT):
        strip[i] = COLOR
        strip.write()
        time.sleep(DELAY)
        strip[i] = (0, 0, 0)
        strip.write()
    
    for i in reversed(range(LED_COUNT)):
        strip[i] = COLOR
        strip.write()
        time.sleep(DELAY)
        strip[i] = (0, 0, 0)
        strip.write()
