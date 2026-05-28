# AI Learning Assistant 🤖📚

Platform belajar cerdas berbasis AI yang membantu pengguna memahami dokumen (seperti PDF) secara interaktif melalui fitur pembuatan Ringkasan (Summary), Flashcards, Quiz, Penjelasan Konsep, serta obrolan langsung (Chat) dengan konteks dokumen menggunakan pendekatan Retrieval-Augmented Generation (RAG) sederhana.

---

## 🚀 Fitur Utama

1. **Autentikasi Pengguna & Profil Keamanan**
   - Registrasi, Login, dan manajemen Profil terproteksi dengan JSON Web Token (JWT) dan enkripsi password `bcryptjs`.
2. **Pengolahan Dokumen Cerdas**
   - Unggah berkas PDF, ekstraksi teks berbasis `pdf-parse`, dan pemotongan teks dinamis (*Text Chunking*) untuk optimasi prompt AI.
3. **Fitur Pembelajaran Interaktif (AI-Powered)**
   - **Flashcards Generator**: Menghasilkan kartu belajar (pertanyaan, jawaban, tingkat kesulitan) otomatis dari materi dokumen.
   - **Quiz Generator**: Menghasilkan kuis pilihan ganda lengkap dengan kunci jawaban dan penjelasannya.
   - **Document Summary**: Menyusun ringkasan dokumen terstruktur yang menyoroti konsep-konsep kunci.
   - **Explain Concept**: Menjelaskan konsep atau istilah tertentu langsung berdasarkan konteks dokumen.
   - **Chat With Document (RAG Q&A)**: Berdiskusi dengan asisten AI mengenai isi dokumen, di mana asisten hanya menjawab berdasarkan potongan teks dokumen yang paling relevan (menggunakan pencocokan kata kunci TF-IDF).
4. **Dashboard Progress Tracking**
   - Melacak performa belajar pengguna, seperti riwayat skor kuis, set flashcard yang telah dibuat, dokumen terunggah, dan statistik belajar lainnya.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4.0
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (dengan Interceptors untuk JWT)
- **Utilities**: Lucide React (Icons), React Markdown (Rendering AI Markdown), React Hot Toast (Notifikasi).

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: OpenRouter API (`google/gemini-3-flash-preview` via client OpenAI)
- **File Upload**: Multer (untuk menangani unggahan PDF)
- **PDF Parser**: `pdf-parse`

---

## 📁 Struktur Direktori Project

```text
ai-learning-assistant/
├── backend/
│   ├── config/            # Konfigurasi Database (MongoDB)
│   ├── controllers/       # Logika bisnis API (AI, Auth, Documents, dll.)
│   ├── middleware/        # Middleware Express (ErrorHandler, AuthGuard)
│   ├── models/            # Schema database Mongoose (User, Document, Quiz, dll.)
│   ├── routes/            # Routing API Endpoint Express
│   ├── uploads/           # Penyimpanan lokal file PDF yang diunggah
│   ├── utils/             # Helper / Layanan (AI Service, Text Chunking, dll.)
│   ├── server.js          # Entrypoint server backend
│   └── .env.example       # Template konfigurasi environment variables
│
├── frontend/
│   └── ai-learning-assistant/
│       ├── public/        # Asset publik statis
│       ├── src/
│       │   ├── components/# Komponen reusable (Layout, Auth, Chat, dll.)
│       │   ├── context/   # React Context (AuthContext)
│       │   ├── pages/     # Halaman aplikasi (Dashboard, Flashcards, Quiz, dll.)
│       │   ├── services/  # API Call Services (Axios mapping)
│       │   ├── utils/     # Konfigurasi router, axios instance, dan endpoint
│       │   ├── App.jsx    # Router & Struktur navigasi utama
│       │   └── main.jsx   # Entrypoint React
│
└── .gitignore             # Gitignore di tingkat root
```

---

## ⚙️ Persyaratan Sistem & Instalasi

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi LTS direkomendasikan)
- [MongoDB](https://www.mongodb.com/) (Lokal atau MongoDB Atlas)
- API Key dari [OpenRouter](https://openrouter.ai/)

---

### 2. Setup Backend

1. Buka folder `backend`:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env.local` dengan menyalin format dari `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
4. Konfigurasikan variabel lingkungan di `.env.local` Anda:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
   PORT=8000
   JWT_SECRET=gunakan_string_acak_dan_panjang
   OPENROUTER_API_KEY=sk-or-v1-key-anda
   ```
5. Jalankan server dalam mode pengembangan:
   ```bash
   npm run dev
   ```
   *Server backend akan berjalan di `http://localhost:8000`*

---

### 3. Setup Frontend

1. Buka folder frontend:
   ```bash
   cd ../frontend/ai-learning-assistant
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di `http://localhost:5173` (atau port lain yang ditunjukkan di terminal Anda)*

---

## 🛡️ Keamanan Kredensial & Berkas `.env` / `.env.local`

> [!IMPORTANT]
> **PENTING: Apakah file `.env.local` akan terlihat di GitHub?**
>
> **TIDAK**, asalkan file tersebut telah didaftarkan di dalam berkas `.gitignore`. 
>
> Di dalam repositori ini, kami telah menambahkan berkas `.gitignore` di tingkat root yang secara otomatis mengabaikan berkas-berkas berikut agar tidak terunggah ke GitHub:
> - `.env`
> - `.env.local`
> - `*.local`
> - `node_modules/`
> - `backend/uploads/` (berisi PDF yang Anda unggah)
>
> Sebelum adanya berkas `.gitignore` di tingkat root, mengubah nama `.env` menjadi `.env.local` di folder `backend/` **tetap bisa terdeteksi dan terunggah oleh Git** karena folder `backend/` sebelumnya tidak memiliki aturan penyaringan `.gitignore` (aturan `*.local` bawaan hanya ada di dalam sub-folder `frontend`).
>
> Sekarang, dengan adanya `.gitignore` di root folder, berkas `backend/.env.local` Anda aman dan **tidak akan terunggah ke GitHub**. Jangan lupa untuk selalu membagikan `.env.example` sebagai gantinya, bukan berkas `.env.local` asli yang berisi password atau API Key rahasia Anda.

---

## 📖 Cara Penggunaan Platform

1. **Registrasi & Login**: Buat akun baru kemudian masuk untuk mengakses Dashboard.
2. **Unggah Dokumen**: Buka halaman *Documents* lalu unggah berkas PDF materi kuliah atau artikel ilmiah Anda. Sistem akan memproses dan mengekstrak teksnya.
3. **Gunakan Menu AI**:
   - Klik **Generate Summary** untuk melihat ringkasan instan.
   - Klik **Generate Flashcards** untuk membuat kartu belajar interaktif.
   - Klik **Generate Quiz** untuk menguji pemahaman Anda.
   - Gunakan fitur **Chat** untuk bertanya langsung ke dokumen mengenai topik spesifik.
4. **Pantau Kemajuan**: Buka halaman *Dashboard* atau *Profile* Anda untuk melihat perkembangan pemahaman Anda dari waktu ke waktu.
