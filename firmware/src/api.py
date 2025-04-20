import urequests
import json


_EP_DEVICE = "/device"
_EP_DEVICE_PROFILE = "/deviceProfile"


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

    def _default_headers(self, is_json_content):
        headers = {
            "Authorization": f"ApiKey-v1 {self._api_key}",
        }

        if is_json_content:
            headers["content-type"] = "application/json"

        return headers
    
    def _request(self, method, endpoint, data_dict = None, params = None, headers_override = None):
        url = self._base_url + endpoint 
        url = url + "?" + "&".join(params) if params else url

        return Response(urequests.request(
            method,
            url,
            data = json.dumps(data_dict),
            headers = self._default_headers(data_dict is not None) if headers_override is None else headers_override
        ))
    
    def _post(self, endpoint, data_dict = None, params = None, headers_override = None):
        return self._request("POST", endpoint, data_dict, params, headers_override)
    
    def _get(self, endpoint, data_dict = None, params = None, headers_override = None):
        return self._request("GET", endpoint, data_dict, params, headers_override)

    def register_device(self):
        return self._post(
            _EP_DEVICE,
            data_dict = {
                "id": self._device_id,
                "name": self._name,
                "description": self._description
            }
        )
    
    def get_device_profile(self):
        return self._get(_EP_DEVICE_PROFILE, params = [f"deviceId={self._device_id}"])
    
    def log_to_api(self, msg):
        raise NotImplementedError("Api.log_to_api(msg) is not yet implemented.")


def init(device_id, api_config, device_config = {}):
    global _instance
    _instance = _Api(device_id, api_config, device_config)


def api():
    if _instance is None:
        raise Exception("Trying to get API instance before initialization.")
    return _instance