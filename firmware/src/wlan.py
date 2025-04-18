import network
import time


def _setup():
    wlan = network.WLAN()
    wlan.active(True)
    return wlan


def _try_connect(wlan, config):
    wlan.connect(config["ssid"], config["password"])
    return wlan.isconnected()


def connect(wlan_config, max_retries = 3, retry_delay = 1):
    wlan = _setup()
    
    for i in range(max_retries):
        connected = _try_connect(wlan, wlan_config)
        if connected:
            print("WLAN connected.")
            return True
        
        print(f"Connection failed. Retry: {i+1}/{max_retries}.")
        time.sleep(retry_delay)


    print("WLAN connection failed, check configuration.")
    return False
