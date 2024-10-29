from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import os
import platform

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definimos un esquema de datos para recibir el JSON correctamente
class ConvertirRequest(BaseModel):
    url: str

@app.get('/')
def index():
    return "Convertir Youtube a Mp3"

@app.post('/convertir')
def convertir_a_mp3(request: ConvertirRequest):
    url = request.url
    path: str = None
    
    if path is None:
        if platform.system() == "Windows":
            path = os.path.join(os.path.expanduser("~"), "Downloads", "Descargas_MP3")
        else:
            path = "/storage/emulated/0/Download/Descargas_MP3"

    os.makedirs(path, exist_ok=True)
    path = os.path.abspath(path)
    print(f"Usando la ruta: {path}")

    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail="Ha ocurrido un error, Por Favor Intentelo De Nuevo.")

    try:
        ydl_opts = {
            'format': 'bestaudio/best', 
            'outtmpl': f'{path}/%(title)s.%(ext)s',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'ffmpeg_location': 'ffmpeg/bin/ffmpeg.exe',
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        return {"message": "Video descargado correctamente."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Ha ocurrido un error, Por Favor Intentelo De Nuevo.")
