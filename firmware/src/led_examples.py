from machine import Pin
import neopixel
import time


LED_COUNT = 30
DATA_PIN = 4


strip = neopixel.NeoPixel(Pin(DATA_PIN), LED_COUNT, bpp=3)  # bpp=4 for RGBW, 3 for RGB


def bounce():
    delay = 0.01
    color = (0, 255, 100)

    for round in range(5):
        for i in range(LED_COUNT):
            strip[i] = color
            strip.write()
            time.sleep(delay)
            strip[i] = (0, 0, 0)
            strip.write()
        
        for i in reversed(range(LED_COUNT)):
            strip[i] = color
            strip.write()
            time.sleep(delay)
            strip[i] = (0, 0, 0)
            strip.write()


def circle():
    delay = 0.01
    color = (0, 255, 100)

    for round in range(20):
        for i in range(LED_COUNT):
            strip[i] = color
            strip.write()
            time.sleep(delay)
            strip[i] = (0, 0, 0)
            strip.write()
