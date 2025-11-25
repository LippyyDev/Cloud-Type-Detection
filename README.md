# ☁️ Cloud Detection - Deteksi Jenis Awan dengan AI

Aplikasi web berbasis AI untuk mendeteksi jenis awan menggunakan model TensorFlow.js yang dilatih dengan Teachable Machine. Aplikasi ini dapat mendeteksi 7 jenis awan dan memberikan prediksi cuaca berdasarkan hasil deteksi.

![Cloud Detection](https://img.shields.io/badge/Status-Active-success)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-3.x-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Fitur

- 🔍 **Deteksi 7 Jenis Awan**:
  - Cirriform Clouds (Awan Cirriform)
  - Clear Sky (Langit Cerah)
  - Cumulonimbus Clouds (Awan Cumulonimbus)
  - Cumulus Clouds (Awan Cumulus)
  - High Cumuliform Clouds (Awan Cumuliform Tinggi)
  - Stratiform Clouds (Awan Stratiform)
  - Stratocumulus Clouds (Awan Stratocumulus)

- 📸 **Input Fleksibel**:
  - Deteksi real-time menggunakan webcam
  - Upload gambar dari file

- 🌤️ **Prediksi Cuaca**:
  - Prediksi kondisi cuaca berdasarkan jenis awan
  - Informasi detail: suhu, kelembaban, angin, presipitasi, visibilitas
  - Rekomendasi aktivitas berdasarkan kondisi cuaca

- 📚 **Penjelasan Awan**:
  - Deskripsi lengkap setiap jenis awan
  - Karakteristik dan ciri-ciri awan
  - Informasi dalam bahasa Indonesia

- 🎨 **UI Modern**:
  - Desain glassmorphism dengan backdrop blur
  - Tema dark dengan gradient background
  - Animasi smooth dengan GSAP
  - Responsif untuk berbagai ukuran layar

- 🎬 **Background Video Dinamis**:
  - Video background berubah otomatis sesuai kondisi cuaca
  - Video untuk kondisi: Cerah, Cerah Berawan, Mendung, Hujan, Badai
  - Delay 5 detik untuk stabilitas (saat menggunakan webcam)

## 🚀 Cara Menggunakan

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Cloud-Detection.git
cd Cloud-Detection
```

### 2. Buka di Browser

Karena aplikasi ini adalah aplikasi web statis, Anda bisa langsung membuka file `index.html` di browser atau menggunakan local server:

**Menggunakan Python:**
```bash
python -m http.server 8000
```

**Menggunakan Node.js (http-server):**
```bash
npx http-server
```

**Menggunakan VS Code Live Server:**
- Install extension "Live Server"
- Klik kanan pada `index.html` → "Open with Live Server"

### 3. Akses Aplikasi

Buka browser dan akses:
- `http://localhost:8000` (jika menggunakan Python)
- Atau langsung buka `index.html` di browser

## 📋 Struktur Project

```
Cloud-Detection/
│
├── index.html          # File HTML utama
├── styles.css          # Styling dengan glassmorphism
├── script.js           # Logika aplikasi dan integrasi TensorFlow.js
├── README.md           # Dokumentasi project
│
└── src/
    └── video/          # Video background untuk berbagai kondisi cuaca
        ├── Cerah.mp4
        ├── CerahBerawan.mp4
        ├── Mendung.mp4
        ├── Rain.mp4
        └── Badai.mp4
```

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur halaman web
- **CSS3** - Styling dengan glassmorphism dan animasi
- **JavaScript (ES6+)** - Logika aplikasi
- **TensorFlow.js** - Machine learning di browser
- **Teachable Machine** - Model AI untuk deteksi awan
- **GSAP 3.12.2** - Animasi dan efek visual
- **Font Awesome 6.0.0** - Ikon
- **Google Fonts (Poppins)** - Tipografi

## 🎯 Cara Kerja

1. **Input Gambar**: User dapat menggunakan webcam atau upload gambar
2. **Prediksi Model**: Gambar diproses oleh model TensorFlow.js
3. **Hasil Deteksi**: Model mengembalikan probabilitas untuk setiap jenis awan
4. **Prediksi Cuaca**: Berdasarkan jenis awan dengan probabilitas tertinggi, sistem menampilkan:
   - Prediksi kondisi cuaca
   - Detail cuaca (suhu, kelembaban, angin, dll)
   - Rekomendasi aktivitas
5. **Background Video**: Video background berubah otomatis sesuai kondisi cuaca

## 📱 Fitur Khusus

### Delay System untuk Webcam
Saat menggunakan webcam, sistem menggunakan delay 5 detik sebelum mengganti background video. Ini mencegah perubahan yang terlalu cepat akibat false detection dari model.

### Video Background Dinamis
- **Cerah** → `Cerah.mp4`
- **Cerah Berawan / Cerah dengan Awan / Berawan** → `CerahBerawan.mp4`
- **Mendung** → `Mendung.mp4`
- **Hujan** → `Rain.mp4`
- **Badai Petir / Berpotensi Badai** → `Badai.mp4`

## 🎨 Customization

### Mengubah Warna Tema

Edit variabel CSS di `styles.css`:

```css
:root {
    --accent-red: #ff6b6b;
    --accent-teal: #4ecdc4;
    --accent-blue: #45b7d1;
    --accent-pink: #f093fb;
    --accent-purple: #8b5cf6;
    --bg-start: #0a0a0a;
    --bg-end: #1e3a5f;
}
```

### Mengubah Model AI

Edit URL model di `script.js`:

```javascript
const URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/";
```

## 📝 Model Information

Model AI digunakan dari [Teachable Machine](https://teachablemachine.withgoogle.com/) dengan URL:
```
https://teachablemachine.withgoogle.com/models/aZnNb8uTX/
```

Model ini dilatih untuk mendeteksi 7 jenis awan dengan akurasi yang baik.

## 🌐 Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Opera

**Note**: Webcam memerlukan HTTPS atau localhost untuk berfungsi dengan baik.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Muhammad Alif Qadri**

## 🙏 Acknowledgments

- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning library
- [Teachable Machine](https://teachablemachine.withgoogle.com/) - Model training platform
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Font Awesome](https://fontawesome.com/) - Icon library

## 📞 Support

Jika Anda memiliki pertanyaan atau menemukan bug, silakan buat [issue](https://github.com/yourusername/Cloud-Detection/issues) di repository ini.

---

⭐ Jika project ini membantu Anda, jangan lupa berikan star!

