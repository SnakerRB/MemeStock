from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pytrends.request import TrendReq
import pandas as pd
import mysql.connector
from datetime import datetime
import os
import time
from dotenv import load_dotenv
import feedparser
import praw
import asyncio
import requests
from requests.adapters import HTTPAdapter, Retry

# Cargar entorno
load_dotenv()
print("[INIT] Variables de entorno cargadas.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    print("[DB] Conectando a base de datos...")
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT")),
    )

def get_top_memes(limit=10):
    print("[MEMES] Extrayendo memes...")
    memes = []
    feed = feedparser.parse("https://knowyourmeme.com/memes/popular.rss")
    for entry in feed.entries:
        title = entry.title.strip()
        if title:
            memes.append(title)
        if len(memes) >= limit:
            break

    print(f"[MEMES] Desde KYM: {len(memes)}")

    if len(memes) < limit:
        reddit = praw.Reddit(
            client_id=os.getenv("REDDIT_CLIENT_ID"),
            client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
            user_agent=os.getenv("REDDIT_USER_AGENT")
        )
        seen = set(memes)
        for subreddit in ["memes", "dankmemes", "me_irl"]:
            for post in reddit.subreddit(subreddit).hot(limit=50):
                title = post.title.strip()
                if title not in seen:
                    memes.append(title)
                    seen.add(title)
                if len(memes) >= limit:
                    break
            if len(memes) >= limit:
                break

    print(f"[MEMES] Total combinados: {len(memes)}")
    return memes

def configure_requests_retries():
    session = requests.Session()
    retries = Retry(
        total=2,
        backoff_factor=0.1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "POST"]
    )
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    requests.sessions.Session.request = session.request

def get_interest_for_memes(memes):
    print("[TRENDS] Iniciando búsqueda en Google Trends...")
    configure_requests_retries()
    all_interest = pd.DataFrame()

    for i in range(0, len(memes), 5):
        chunk = memes[i:i+5]
        print(f"[TRENDS] Procesando grupo: {chunk}")
        try:
            pytrends = TrendReq(
                hl='en-US',
                tz=360,
                timeout=(10, 25)
            )
            pytrends.build_payload(chunk, geo="ES", timeframe='now 7-d')
            time.sleep(5)
            interest = pytrends.interest_over_time()
            if not interest.empty:
                interest = interest.drop(columns=["isPartial"], errors="ignore")
                all_interest = pd.concat([all_interest, interest], axis=1)
                print(f"[OK] Datos obtenidos para: {chunk}")
        except Exception as e:
            print(f"[ERROR] Fallo al obtener datos de Google Trends para {chunk} -> {e}")
        time.sleep(1)

    return all_interest

def scrape_and_store_trending_memes():
    print("[TASK] Scrape iniciado...")
    memes = get_top_memes()
    if not memes:
        print("[ERROR] No se pudieron obtener memes.")
        return

    interest = get_interest_for_memes(memes)
    if interest.empty:
        print("[ERROR] Sin datos desde Google Trends.")
        return

    top = interest.mean().sort_values(ascending=False).head(100)
    result = [{"name": name, "score": int(score)} for name, score in top.items()]
    timestamp = datetime.utcnow()

    print(f"[DB] Guardando {len(result)} memes en BBDD...")

    db = get_db_connection()
    cursor = db.cursor()
    for meme in result:
        cursor.execute(
            "INSERT INTO Trending_Memes (name, score, timestamp) VALUES (%s, %s, %s)",
            (meme["name"], meme["score"], timestamp)
        )
    db.commit()
    cursor.close()
    db.close()

    print(f"[DONE] Guardado completado a las {timestamp.isoformat()}")

@app.on_event("startup")
async def start_background_task():
    print("[INIT] Tarea de scraping cada hora iniciada.")
    async def hourly_scraper():
        while True:
            scrape_and_store_trending_memes()
            await asyncio.sleep(3600)
    asyncio.create_task(hourly_scraper())

@app.get("/api/trending-memes")
def manual_scrape():
    print("[API] Scraping manual ejecutado.")
    scrape_and_store_trending_memes()
    return {"status": "Scraping ejecutado manualmente"}
