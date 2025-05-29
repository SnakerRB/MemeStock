import os
import time
import random
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
INTERVALO_MINUTOS = int(os.getenv("INTERVALO_MINUTOS", 15))
MAX_REINTENTOS = 10
TIEMPO_ESPERA = 5  # segundos

def log(msg):
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{now}] {msg}", flush=True)

def esperar_conexion_db():
    log("🔌 Verificando conexión a la base de datos...")
    for intento in range(1, MAX_REINTENTOS + 1):
        try:
            conn = mysql.connector.connect(
                host=DB_HOST,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
            )
            conn.close()
            log("✅ Conexión a la base de datos exitosa.")
            return
        except mysql.connector.Error:
            log(f"⏳ Intento {intento}/{MAX_REINTENTOS}: esperando base de datos...")
            time.sleep(TIEMPO_ESPERA)
    raise Exception("❌ No se pudo conectar a la base de datos tras múltiples intentos.")

def obtener_memes(cursor):
    log("📄 Obteniendo lista de memes...")
    cursor.execute("SELECT id FROM Memes")
    memes = [row[0] for row in cursor.fetchall()]
    log(f"📦 {len(memes)} memes encontrados.")
    return memes

def obtener_ultimo_precio(cursor, meme_id):
    cursor.execute(
        "SELECT precio FROM PrecioMemes WHERE memeId = %s ORDER BY timestamp DESC LIMIT 1",
        (meme_id,),
    )
    row = cursor.fetchone()
    precio = row[0] if row else round(random.uniform(1.0, 5.0), 2)
    return precio

def generar_nuevo_precio(precio_anterior):
    cambio = random.uniform(-0.05, 0.05)  # +/- 5%
    nuevo_precio = round(precio_anterior * (1 + cambio), 2)
    return max(nuevo_precio, 0.01)

def insertar_precio(cursor, meme_id, precio):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute(
        "INSERT INTO PrecioMemes (memeId, precio, timestamp, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s)",
        (meme_id, precio, timestamp, timestamp, timestamp),
    )

def ejecutar_bot():
    log("🚀 Iniciando bot simulador de precios de memes...")
    esperar_conexion_db()

    while True:
        log("🌀 Comenzando nuevo ciclo de actualización...")

        try:
            log("🔐 Conectando a la base de datos...")
            conn = mysql.connector.connect(
                host=DB_HOST,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
            )
            cursor = conn.cursor()

            memes = obtener_memes(cursor)

            for meme_id in memes:
                precio_anterior = obtener_ultimo_precio(cursor, meme_id)
                nuevo_precio = generar_nuevo_precio(precio_anterior)
                insertar_precio(cursor, meme_id, nuevo_precio)
                log(f"💸 Meme {meme_id}: {precio_anterior} → {nuevo_precio}")

            conn.commit()
            cursor.close()
            conn.close()
            log(f"✅ Todos los precios actualizados correctamente.")

        except Exception as e:
            log(f"🔥 Error en el ciclo: {e}")

        log(f"😴 Durmiendo durante {INTERVALO_MINUTOS} minutos...\n")
        time.sleep(INTERVALO_MINUTOS * 60)

if __name__ == "__main__":
    ejecutar_bot()
