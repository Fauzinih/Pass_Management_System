# 🔐 Password Management System

Aplikasi **Password Management berbasis web** yang dibangun menggunakan **Next.js** dan **Supabase**.  
Aplikasi ini memungkinkan pengguna untuk **registrasi, login, dan menyimpan kunci enkripsi lokal (Master Password)** dengan aman menggunakan mekanisme **PBKDF2 (Password-Based Key Derivation Function 2)**.

---

## 🚀 Fitur Utama

- ✅ Registrasi dan Login dengan **Supabase Authentication**
- 🔑 Penyimpanan **salt terenkripsi** di tabel `profiles`
- 🧠 Derivasi kunci enkripsi dari Master Password menggunakan **PBKDF2**
- 🔒 Penyimpanan kunci hasil derivasi di **sessionStorage**
- ⚙️ Validasi input & penanganan error Supabase
- 🧭 Struktur proyek modern menggunakan **Next.js App Router**

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Deskripsi |
|-----------|------------|
| **Next.js 13+** | Framework React modern |
| **Supabase** | Backend untuk autentikasi dan database |
| **Web Crypto API (PBKDF2)** | Derivasi kunci enkripsi dari master password |
| **React Hooks (useState)** | Manajemen state dan event handler |
| **JavaScript (ES Modules)** | Bahasa utama aplikasi |

---

## 📂 Struktur Folder
Berikut struktur folder utama dari proyek **Password Management System**:
```
password_management_system/
├─ app/
│ ├─ add/
│ │ └─ page.jsx # Menambahkan password akun baru yang disimpan pengguna.
│ ├─ auth/
│ │ ├─ login/page.jsx # Halaman login
│ │ └─ register/page.jsx # Halaman registrasi
│ ├─ users/
│ │ └─ page.tsx # Halaman data users
│ ├─ globals.css
│ ├─ layout.jsx # Layout utama
│ ├─ Navbar.jsx
│ └─ page.jsx # Halaman utama
│
├─ lib/
│ ├─ supabaseClient.js # Inisialisasi Supabase client
│ └─ crypto.js # Fungsi derivasi dan ekspor kunci
│
├─ node_modules/ # Dependensi proyek
├─ public/ # Aset publik
├─ sql/
│ └─ setup.sql # Skrip SQL
│
├─ .env.local # Template environment variable
├─ .gitignore
├─ next.config.js
├─ package-lock.json
├─ package.json
└─ README.md
```

## ⚙️ Cara Menjalankan Proyek

#### 1. Clone Repository
```bash
git clone https://github.com/Fauzinih/Pass_Management_System.git
cd password_management_system
```
#### 2. Install Dependency
```bash
npm install
```
#### 3. Konfigurasi Environment
Buat file .env.local di root proyek, lalu isi dengan kredensial dari Supabase:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
#### 4. Jalankan Server Lokal
```bash
npm run dev
```
- Akses aplikasi di browser:
```bash
http://localhost:3000
```


## ☁️ Konfigurasi Supabase
#### 1. Masuk ke https://supabase.com → buat proyek baru.
#### 2. Aktifkan Email Signup di `Authentication → Settings`.
#### 3. Buat tabel `profiles` di Table Editor dengan struktur berikut:

| Kolom        | Tipe   | Default       | Keterangan                      |
|---------------|--------|---------------|----------------------------------|
| `id`          | UUID   | `auth.uid()`  | Primary key, ID pengguna Supabase |
| `pbkdf2_salt` | text   | –             | Salt untuk enkripsi lokal        |

#### 4. Ambil Project URL dan anon public key dari Supabase, lalu masukkan ke `.env.local`.

## 🔄 Alur Aplikasi
**1. Registrasi**
- Pengguna mengisi email, password, dan master password.
- Sistem membuat akun di Supabase (`auth.signUp`).
- Salt dihasilkan dan disimpan di tabel `profiles`. 

**2. Login**
- Pengguna login menggunakan email dan password.
- Aplikasi mengambil `pbkdf2_salt` dari tabel `profiles`.
- Menggunakan master password + salt untuk menghasilkan kunci enkripsi lokal (PBKDF2).
- Kunci disimpan sementara di `sessionStorage` untuk dekripsi lokal.
