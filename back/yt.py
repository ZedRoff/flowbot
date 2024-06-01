import yt_dlp
import pygame
import time
from moviepy.editor import AudioFileClip
from youtubesearchpython import VideosSearch

def download_audio(link):
    with yt_dlp.YoutubeDL({'extract_audio': True, 'format': 'bestaudio', 'outtmpl': 'file.webm'}) as video:
        info_dict = video.extract_info(link, download=True)
        return 'file.webm'

def play_music(file_path):
    pygame.mixer.init()
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        time.sleep(1)
    pygame.quit()

def convert_webm_to_wav(input_file, output_file):
    clip = AudioFileClip(input_file)
    clip.write_audiofile(output_file)
    print("Conversion terminée ! Le fichier WAV est disponible dans :", output_file)

videosSearch = VideosSearch('crab rave', limit=2)
audio_file = download_audio(videosSearch.result()['result'][0]["link"])

convert_webm_to_wav("file.webm", "file.wav")
play_music("file.wav")
