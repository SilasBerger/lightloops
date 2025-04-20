import sys
import json


class ErrorHandler:

    MAX_ERROR_LOG_ENTRIES = 10
    ERROR_LOG_PATH = "error.log.json"

    @staticmethod
    def _write_to_error_log(msg):
        log_data = []

        try:
            with open(ErrorHandler.ERROR_LOG_PATH, "r") as infile:
                log_data = json.load(infile)
        except Exception:
            pass  # File doesn't exist yet.
            
        if len(log_data) >= ErrorHandler.MAX_ERROR_LOG_ENTRIES:
            log_data = log_data[1:]
        log_data.append(msg)
        with open(ErrorHandler.ERROR_LOG_PATH, "w") as outfile:
            json.dump(log_data, outfile)

    @staticmethod
    def log_error_and_exit(error_msg):
        print(error_msg)
        ErrorHandler._write_to_error_log(error_msg)
        # TODO: Set LED strip to static red to show error state.
        sys.exit(1)
