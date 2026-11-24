# NIVFES BIO

Platform praktikum virtual Bioteknologi Modern — simulasi laboratorium interaktif berbasis web.

## Fitur
- 🔬 5 modul bioteknologi (Kultur Jaringan, Bayi Tabung, Kloning, Hibridoma, DNA Rekombinan)
- 🧪 Simulator lab virtual interaktif (drag & drop SVG)
- 📝 Evaluasi/kuis dengan papan peringkat
- 🎨 Katalog objek SVG laboratorium
- 📱 Responsive (mobile & desktop)

## Cara Menjalankan Lokal

```bash
cd docs
python -m http.server 8080
```

Buka browser → `http://localhost:8080`

## Deploy

Site statis di folder `docs/`. Deploy ke GitHub Pages:
1. Push ke GitHub
2. Settings → Pages → Source: `main` branch, folder `/docs`
