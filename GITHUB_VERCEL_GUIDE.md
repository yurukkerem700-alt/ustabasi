# USTABAŞI - GitHub + Vercel Kurulum Rehberi

## 📁 Adım 1: Projeyi Bilgisayarına İndir

`ustabasi-production.tar.gz` dosyasını bilgisayarına indir ve aç:

```bash
# Terminal / Komut Satırı
tar -xzf ustabasi-production.tar.gz
cd ustabasi
```

## 🔐 Adım 2: Ortam Değişkenlerini Ayarla

`.env.example` dosyasını kopyala ve kendi bilgilerini gir:

```bash
cp .env.example .env
```

`.env` dosyasını düzenle:
```
VITE_SUPABASE_URL=https://senin-projen.supabase.co
VITE_SUPABASE_ANON_KEY=senin-anon-key
SUPABASE_SERVICE_ROLE_KEY=senin-service-role-key
```

## 🐛 Adım 3: GitHub'a Yükle

```bash
# Git reposu başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Ustabaşı v1.0 - Initial release"

# GitHub'da yeni repo oluştur (github.com)
# Sonra bağla:
git remote add origin https://github.com/KULLANICI_ADIN/ustabasi.git

# Yükle
git push -u origin main
```

## 🚀 Adım 4: Vercel'e Bağla

1. **vercel.com** adresine git
2. "Add New Project" tıkla
3. GitHub hesabını bağla
4. `ustabasi` reposunu seç
5. Framework: **Vite** olarak ayarla
6. Environment Variables ekle:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
7. "Deploy" tıkla

## ✅ Bitti!

Site otomatik olarak yayına alınacak. Her `git push` yaptığında Vercel otomatik yeniden deploy edecek.

## 🔧 Sorun Yaşarsan

1. `npm install` çalıştır
2. `npm run build` ile hata var mı kontrol et
3. Vercel dashboard'dan logları kontrol et
4. Supabase tablolarının oluştuğundan emin ol
