import os
import random
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# ---------- KONFİG ----------
TMDB_API_KEY = "0b7f712ac44c8fc46b0b4a421108e7b3"  # kendi anahtarınız
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"             # https://aistudio.google.com/ alın
genai.configure(api_key=GEMINI_API_KEY)

# ---------- GENRE MAPPING (TMDB ID'leri) ----------
GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western"
}

def get_genre_ids_from_mood(mood_text):
    """
    Gemini'ye sor: "Şu ruh haline uygun 3 film türü seç: {mood_text}"
    Dönen İngilizce türleri TMDB ID'lerine çevir.
    """
    prompt = f"""
    You are a movie recommendation expert. Given a user's mood: "{mood_text}"
    Choose exactly 3 movie genres from this list that best match the mood:
    {list(GENRE_MAP.values())}
    Return only the genre names separated by commas, nothing else.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        genre_names = [g.strip() for g in response.text.split(',')]
        # İsimleri ID'ye çevir
        genre_ids = []
        for name in genre_names:
            for gid, gname in GENRE_MAP.items():
                if gname.lower() == name.lower():
                    genre_ids.append(gid)
                    break
        return genre_ids[:3]  # en fazla 3 tür
    except Exception as e:
        print("Gemini hatası:", e)
        # Fallback: rastgele 3 tür döndür
        return random.sample(list(GENRE_MAP.keys()), 3)

def fetch_movies_by_genres(genre_ids, limit=12):
    """TMDB discover ile belirtilen türlerde filmleri getir (sayfa rastgele)"""
    # Rastgele sayfa seç (1-20 arası) – her seferinde farklı filmler gelsin
    page = random.randint(1, 20)
    # Sıralama da rastgele: popülerlik, oy, tarih karışık
    sort_by = random.choice(["popularity.desc", "vote_average.desc", "release_date.desc"])
    url = f"https://api.themoviedb.org/3/discover/movie"
    params = {
        "api_key": TMDB_API_KEY,
        "with_genres": ",".join(map(str, genre_ids)),
        "sort_by": sort_by,
        "page": page,
        "language": "en-US"
    }
    response = requests.get(url, params=params).json()
    movies = response.get("results", [])
    # Poster'i olmayanları ele (null poster_path)
    movies = [m for m in movies if m.get("poster_path")]
    # Sonuç 12'den azsa başka sayfadan tamamla
    if len(movies) < limit:
        params["page"] = random.randint(1, 20)
        more = requests.get(url, params=params).json().get("results", [])
        movies.extend([m for m in more if m.get("poster_path")])
    # Rastgele 8-12 film seç
    random.shuffle(movies)
    return movies[:limit]

@app.route('/analyze-mood', methods=['POST'])
def analyze_mood():
    data = request.json
    mood = data.get("mood", "").strip()
    if not mood:
        return jsonify([]), 400

    print(f"🧠 Analiz edilen ruh hali: {mood}")
    # 1. Gemini ile tür ID'lerini bul
    genre_ids = get_genre_ids_from_mood(mood)
    print(f"🎭 Seçilen türler: {genre_ids}")
    # 2. TMDB'den filmleri çek
    movies = fetch_movies_by_genres(genre_ids, limit=12)
    # 3. Frontend'e gönder
    return jsonify(movies)

@app.route('/daily-picks', methods=['POST'])
def daily_picks():
    # Günün rastgele önerileri (popüler + rastgele tür)
    random_genres = random.sample(list(GENRE_MAP.keys()), 3)
    movies = fetch_movies_by_genres(random_genres, limit=8)
    return jsonify(movies)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)