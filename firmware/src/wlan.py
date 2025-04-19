import network
import time


def _setup():
    wlan = network.WLAN()
    wlan.active(True)
    return wlan


def connect(wlan_config, max_retries = 10, retry_delay = 2):
    wlan = _setup()
    wlan.connect(wlan_config["ssid"], wlan_config["password"])
    
    for i in range(max_retries):
        if wlan.isconnected():
            print("WLAN connected.")
            return True
        
        print(f"WLAN not yet connected. Try: {i+1}/{max_retries}.")
        time.sleep(retry_delay)


    print("WLAN connection failed, check configuration.")
    return False
