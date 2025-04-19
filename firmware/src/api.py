import urequests
import json


_EP_DEVICE = "/device"


_instance = None


class Response():

    def __init__(self, raw_response):
        self._status_code = raw_response.status_code
        self._text = raw_response.text
        try:
            self._json = raw_response.json()
        except Exception:
            self._json = {}

    def get_status_code(self):
        return self._status_code
    
    def get_text(self):
        return self._text
    
    def get_json(self):
        return self._json
    
    def get_body(self):
        return self._text if not self._json else self._json
    
    def __str__(self):
        return json.dumps({
            "status_code": self.get_status_code(),
            "body": self.get_body()
        })


class _Api():

    def __init__(self, device_id, api_config, device_config = {}):
        self._device_id = device_id
        self._base_url = api_config["base_url"]
        self._api_key = api_config["key"]
        self._name = device_config["name"] if "name" in device_config else self._device_id
        self._description = device_config["description"] if "description" in device_config else None

    def _default_headers(self):
        return {
            "Authorization": f"ApiKey-v1 {self._api_key}",
            "content-type": "application/json"
        }
    
    def _request(self, method, endpoint, data_dict = None, headers_override = None):
        return Response(urequests.request(
            method,
            self._base_url + endpoint,
            data = json.dumps(data_dict),
            headers = self._default_headers() if headers_override is None else headers_override
        ))
    
    def _post(self, endpoint, data_dict = None, headers_override = None):
        return self._request("POST", endpoint, data_dict, headers_override)

    def register_device(self):
        return self._post(
            _EP_DEVICE,
            data_dict = {
                "id": self._device_id,
                "name": self._name,
                "description": self._description
            }
        )
    
    def log_to_api(self, msg):
        raise NotImplementedError("Api.log_to_api(msg) is not yet implemented.")


def init(device_id, api_config, device_config = {}):
    global _instance
    _instance = _Api(device_id, api_config, device_config)


def api():
    if _instance is None:
        raise Exception("Trying to get API instance before initialization.")
    return _instance