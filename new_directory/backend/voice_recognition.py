```python
import os
from google.cloud import speech_v1p1beta1 as speech

class VoiceRecognition:
    def __init__(self):
        self.client = speech.SpeechClient()

    def transcribe_audio(self, audio_file_path):
        with open(audio_file_path, "rb") as audio_file:
            audio = speech.RecognitionAudio(content=audio_file.read())

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
        )

        response = self.client.recognize(config=config, audio=audio)

        for result in response.results:
            print("Transcript: {}".format(result.alternatives[0].transcript))

    def process_voice_command(self, command):
        # This function will be implemented in the nlp.py file
        pass

if __name__ == "__main__":
    vr = VoiceRecognition()
    vr.transcribe_audio("path_to_audio_file")
```