import network
import json
import sys
import os


LED_COUNT = 30
DATA_PIN = 4


def read_config():
    try:
        with open("./config.json") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading config: {e}")
        sys.exit(1)


def read_device_id():
    try:
        with open("./device_id") as f:
            return f.read().strip()
    except Exception as e:
        print(f"Error reading device ID: {e}")
        sys.exit(1)


def wlan_connect(wlan_config):
    wlan = network.WLAN()
    wlan.active(True)
    wlan.connect(wlan_config["ssid"], wlan_config["password"])
    if wlan.isconnected():
        print("WLAN connected.")
    else:
        print("WLAN connection failed, check configuration.")


def main():
    config = read_config()
    device_id = read_device_id()
    print(f"Device ID: {device_id}")
    wlan_connect(config['wlan'])


main()
