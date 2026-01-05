# Hirup - PM2.5 Air Quality Forecasting

**Hirup** adalah aplikasi web end-to-end untuk memprediksi kualitas udara (PM2.5) berbasis Machine Learning. Proyek ini dikembangkan sebagai First Project dalam magang di Stasiun Klimatologi Yogyakarta.

**Live Demo:** [hirup.pradanayahya.me](https://bmkg-hirup.pradanayahya.me)

---

## Apa itu PM2.5?
PM2.5 (*Particulate Matter 2.5*) adalah partikel polusi udara yang berukuran lebih kecil dari 2.5 mikrometer (sekitar 3% dari diameter rambut manusia). Karena ukurannya yang sangat kecil, partikel ini dapat menembus jauh ke dalam paru-paru hingga aliran darah, sehingga berbahaya bagi kesehatan manusia.

Aplikasi ini bertujuan memberikan estimasi dan prediksi nilai PM2.5 berdasarkan parameter cuaca & previous data untuk mempermudah kalkulasi dan prediksi

## Tech Stack

* **Frontend:** React + Vite (Runtime: Bun)
* **Backend:** Python (FastAPI)
* **Machine Learning:** Random Forest Regressor
* **Deployment:** Docker & VPS

## Struktur Folder

* `/frontend`: Source code frontend (React/Vite).
* `/backend`: API server untuk melayani prediksi model (FastAPI).
* `/training`: Script Python untuk pelatihan model (Random Forest) dan pre-processing.

## Catatan Privasi Data

Dataset asli (Raw Data) dari alat AWS dan dokumen *Exploratory Data Analysis* (EDA) **tidak dipublikasikan** di dalam repositori ini karena bersifat rahasia (Confidential) dan milik internal BMKG.

Repositori ini hanya berisi kode implementasi sistem end-to-end dan arsitektur model.

---
