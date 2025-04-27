def complex(led_engine):
    scene = {
        "loop": True,  # Loop the scene.
        "crossfade_duration": 200,  # Shorthand. Acts the same as putting crossfade_duration on every interval.
        "durations": {
            "on": 1000,
            "off": 500,
        },
        "colors": {
            "red": [255, 0, 0],
            "green": [0, 255, 0],
            "off": [0, 0, 0],
        },
        "patterns": {
            "a": ["red", "green"],
            "b": ["green", "red"],
            "c": ["red", "green", [120, 20, 205]],
        },
        "intervals": [
            {
                "colors": "a",
                "duration": 'on',
            },
            {
                "colors": ["off"],
                "duration": 'off',
            },
            {
                "colors": "b",
                "duration": 'on',
            },
            {
                "colors": ["off"],
                "duration": 'off',
            },
            {
                "colors": "c",
                "duration": 'on',
            },
            {
                "colors": ["off"],
                "duration": 'off',
            },
            {
                "colors": ["red", "green", [0, 0, 255]],
                "duration": 2000
            },
                            {
                "colors": ["off"],
                "duration": 1000,
            },
        ],
    }
    led_engine.display(scene)

def static(led_engine):
    scene = {
        "intervals": [
            {
                "colors": [[255, 255, 0]],
            }
        ]
    }
    led_engine.display(scene)

def randomized(self):
    pass
    # TODO: Here, the intervals field needs to have a random generator.

def fading_bonanza(led_engine):
    scene = {
        "loop": False,
        "colors": {
            "red": [255, 0, 0],
            "green": [0, 255, 0],
            "blue": [0, 0, 255],
            "off": [0, 0, 0],
        },
        "durations": {
            "static": 1000,
            "whenCrossfading": 500,
            "crossfadeDuration": 200,
        },
        "intervals": [
            {
                "crossfade_duration": 'default_fade_duration',  # Duration of the crossfade from this to the next interval (if available).
                "fade_in_duration": 1000,  
                "fade_out_duration": 1000,  # Duration of the fade out. Has no effect if crossfade_duration is set on the next interval.
            },
            {
                "colors": ["red"],
                "duration": "static",
            },
            {
                "colors": ["green"],
                "duration": "static",
            },
            {
                "colors": ["blue"],
                "duration": "static",
            },
            {
                "colors": ["off"],
                "duration": "static",
            },
            {
                "fade_in_duration": 200, # Duration of the fade in. Has no effect if crossfade_duration is set on the previous interval.
                "colors": ["red"],
                "duration": "whenCrossfading",
                "crossfade_duration": 'crossfadeDuration',
            },
            {
                "fade_in_duration": 5000,  # Should be ignored here, since we have a crossfade_duration set on the previous interval.
                "colors": ["green"],
                "duration": "whenCrossfading",
                "crossfade_duration": 'crossfadeDuration',

            },
            {
                "colors": ["blue"],
                "duration": "whenCrossfading",
                "fade_out_duration": 1000,  # Duration of the fade out. Has no effect if crossfade_duration is set on the next interval.
            },
            {
                "colors": ["off"],
                "duration": "static",
            },
            {
                "colors": ["red", "green", "blue"],
                "duration": "whenCrossfading",
                "crossfade_duration": 'crossfadeDuration',
            },
            {
                "colors": ["green", "blue", "red"],
                "duration": "whenCrossfading",
                "crossfade_duration": 'crossfadeDuration',
            },
            {
                "colors": ["blue", "red", "green"],
                "duration": "whenCrossfading",
                "crossfade_duration": 'crossfadeDuration',
                "fade_out_duration": 1000,
            },
        ]
    }
    led_engine.display(scene)
