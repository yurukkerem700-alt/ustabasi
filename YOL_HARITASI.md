# USTABAŞI — Tespit Raporu ve Yol Haritası

> Kapsam: `ustabasii.com.tr` kaynak kodu (bu repo). Canlı siteye bu ortamdan erişilemedi (ağ politikası 403), bu yüzden bulgular **kod, build ve lint çıktısına** dayanır. Canlı site doğrulaması Faz 0'da yapılacak.

## 1. Özet

Repoda iki ayrı site var: gerçek bir React + Supabase uygulaması (`src/`, `api/`) ve kökteki statik bir `index.html` taslağı. **Build'e giren taslak olduğu için React uygulaması hiç yayına çıkmıyor.** Bunun altında ciddi güvenlik açıkları, sahte (hardcoded) kullanıcı kimliği ve kalite borcu var.

## 2. Bulgular

### 🔴 Kritik

| # | Sorun | Kanıt | Etki |
|---|-------|-------|------|
| K1 | **React uygulaması yayına girmiyor.** Kök `index.html` (commit `3527b9b`) statik bir Tailwind-CDN taslağı; `<div id="root">` ve `/src/main.tsx` script'i yok. | `vite build` → "2 modules transformed", `dist/index.html` 14 kB, JS paketi yok. Önceki sürümde (`3527b9b^`) bu satırlar vardı. | 23 route, auth, API'ler: hiçbiri çalışmıyor. Linkler `href="#"`, butonlar işlevsiz, istatistikler (12.500+ usta, 85.000+ iş) uydurma sabit metin. |
| K2 | **API'de kimlik doğrulama/yetkilendirme yok + service-role anahtarı.** `api/[...path].js` her isteği `SUPABASE_SERVICE_ROLE_KEY` ile yapıyor (RLS'i tamamen atlar), JWT doğrulaması yok, `Access-Control-Allow-Origin: *`. | `api/[...path].js` satır 21-27, 36-40 | Herkes herhangi bir kullanıcı adına yorum/beğeni/mesaj yazabilir, tüm bildirimleri/mesajları/acil durum kayıtlarını (telefon, konum) okuyabilir, `reports`'u PUT ile değiştirebilir (moderasyon "admin" paneli herkese açık), kayıt silebilir. |
| K3 | **Mass assignment:** `POST` uçları `req.body`'yi doğrudan `insert` ediyor (`ustas`, `companies`, `usta_posts`, `emergency_requests`, `tracking`, `notifications`, `company_*`, `featured_posts`). | `api/[...path].js` | Kullanıcı `premium`, `identity_verified`, `rating`, `user_id` gibi alanları kendisi belirleyebilir; rozet/doğrulama sistemi anlamsız. |
| K4 | **Sahte kimlik:** `demo-user` 12 yerde sabit (takip, bildirim, beğeni, kaydetme…). Gerçek `user.id` kullanılmıyor. | `grep demo-user src` | Tüm kullanıcılar aynı hesabı paylaşıyor; veri karışır. |

### 🟠 Yüksek

| # | Sorun | Detay |
|---|-------|-------|
| Y1 | **Rol/profil yok.** `Auth.tsx` kayıtta `role` (müşteri/usta/firma) seçtiriyor ama sadece `signUp({email,password})` çağırıyor; rol kaydedilmiyor, `ustas` kaydı oluşmuyor. Firma kaydı kimliksiz `/api/companies` POST'u ile yapılıyor. |
| Y2 | **Sayaç yarış koşulu.** Beğeni/yorum sayıları oku→+1→yaz ile güncelleniyor (atomik değil). Aynı kullanıcı çift beğeni için unique constraint yok (şema repoda yok, doğrulanamadı). |
| Y3 | **Şema/migration repoda yok.** `DEPLOYMENT.md`: "tablolar uygulama ilk çalışınca otomatik oluşur" — oluşturan kod yok. RLS politikaları, indeksler, FK'ler belgelenmemiş/versiyonlanmamış. |
| Y4 | **Arama güvenliği/performansı.** `ilike '%…%'` kullanıcı girdisi kaçışsız (`%`/`_` joker), indeks yok; `ustas` ve `jobs` uçlarında sayfalama yok (tüm tablo çekiliyor); mesafe hesabı düz Öklid + sunucuda JS ile (enlem/boylam hataları, ölçeklenmez). |
| Y5 | **Hata yönetimi:** `catch (e) → 500 + e.message` ham Supabase hata mesajını istemciye sızdırıyor; istemcide `catch {}` ile hatalar yutuluyor, kullanıcıya geri bildirim yok. |
| Y6 | **Yasal/KVKK:** Konum, telefon, kimlik doğrulama rozeti toplanıyor; aydınlatma metni sadece `/kvkk` sayfası. Çerez/açık rıza, gizlilik politikası, kullanım koşulları sayfaları yok (footer linkleri `#`). Taslak footer'da sahte telefon (`0850 123 45 67`). |
| Y7 | **Abonelik sayfası** var ama ödeme altyapısı yok (iyzico/PayTR/Stripe). |

### 🟡 Orta

| # | Sorun | Detay |
|---|-------|-------|
| O1 | **Kod kalitesi:** `npm run lint` → **133 sorun (124 hata)**: 50× `no-explicit-any`, 44× kullanılmayan değişken, 16× `fetchData` tanımdan önce kullanılıyor (WorldMap vb.), 9× `exhaustive-deps`, 8× boş `catch`. `tsc -b` temiz. |
| O2 | **Test yok**, CI yok (`.github/` sadece görsel). `package.json` adı `placeholder-model-1`. |
| O3 | **Ölü/çift kod:** `api-old/` (27 dosya), `lib/` (api içinde tekrar), `.vercelignore` var olmayan `api/*.js` dosyalarını listeliyor, `.vite-source-tags.js` üretim dışı araç. `package-lock.json` .gitignore'da → tekrarlanabilir build yok. |
| O4 | **Ortam değişkeni karmaşası:** `NEXT_PUBLIC_*` ve `VITE_*` birlikte, `process.env.*` define ediliyor; `FULLSTACK_*` değişkenleri `.env.example`'da yok. Yanlış anahtarla bundle'a sızma riski. |
| O5 | **Performans:** tek paket (route bazlı code-splitting yok), Leaflet/Framer Motion ana pakette; taslakta Tailwind CDN (üretimde önerilmez, ~300 kB JS), Font Awesome tüm font; `hero.jpg` optimize/`webp` değil. |
| O6 | **SEO:** SPA + sadece client render; `robots.txt`, `sitemap.xml`, `canonical`, `og:image`, JSON-LD (LocalBusiness/Service) yok; taslakta meta description/OG tamamen silinmiş. Blog `slug` sayfaları sunucu render edilmediğinden indekslenmesi zayıf. |
| O7 | **Erişilebilirlik:** form alanlarında `label`–`input` bağı yok, ikon-buton `aria-label` eksik, taslakta tüm linkler `href="#"`. |
| O8 | **Önbellek:** `vercel.json` tüm istekleri `max-age=0, must-revalidate` yapıyor; `public/` statik dosyaları (logo, görseller) önbelleklenmiyor. `/api/(.*)` rewrite'ı gereksiz (kendine yönlendirme). |

### 🟢 Düşük

- Gerçek zamanlı sohbet polling ile; Supabase Realtime kullanılabilir.
- `README` "PWA'ya hazır" diyor, manifest/service worker yok.
- `public/vite.svg`, `src/assets/react.svg`, `App.css` şablondan kalma.
- README'de iletişim bilgileri ile taslaktaki bilgiler tutarsız (e-posta, telefon).

## 3. Yol Haritası

### Faz 0 — Acil kurtarma (1 gün)
1. `index.html`'i geri yükle: `<div id="root">` + `<script type="module" src="/src/main.tsx">`; taslaktaki iyi tasarım/metinleri `Home.tsx`'e taşı. *(K1)*
2. Vercel'de son deploy'u ve ortam değişkenlerini doğrula; canlı siteyi tara (Lighthouse, kırık linkler, konsol hataları).
3. Service-role anahtarı daha önce sızdıysa **rotate et**; Supabase tablolarında RLS durumunu kontrol et.
4. `package-lock.json`'ı commit et, `.gitignore`'dan çıkar.

### Faz 1 — Güvenlik ve veri bütünlüğü (1–2 hafta)
1. Şemayı `supabase/migrations/` altında versiyonla (tablolar, FK, unique, indeks).
2. **RLS'yi aç**; okuma/yazma politikalarını `auth.uid()` ile yaz. Çoğu CRUD'u doğrudan `supabase-js` (anon key + kullanıcı JWT) ile yap; service-role sadece gerçekten gereken uçlarda. *(K2)*
3. API'de JWT doğrulama (`Authorization: Bearer`), `user_id`'yi gövdeden değil token'dan al; CORS'u kendi alan adına kısıtla. *(K2, K4)*
4. Girdi doğrulama (zod) + alan beyaz listesi; `req.body` doğrudan insert yasak. *(K3)*
5. Beğeni/yorum sayaçlarını DB trigger/RPC ile atomik yap; `unique(post_id,user_id)`. *(Y2)*
6. `demo-user` kullanımlarını `useAuth().user.id` ile değiştir; giriş yoksa yönlendir. *(K4)*
7. Moderasyon/admin için rol (`profiles.role`) ve sunucu tarafı kontrol. *(K2)*
8. Hata mesajlarını genelleştir, sunucuda logla; istemcide toast ile göster. *(Y5)*

### Faz 2 — Çekirdek ürün akışı (2–3 hafta)
1. `profiles` tablosu + kayıtta rol kaydı; usta kaydında `ustas` satırı, firma kaydında yetkili bağlama. *(Y1)*
2. Uçtan uca akış: iş talebi → teklifler → usta seçimi → mesajlaşma → tamamlama → yorum. Bildirimleri bu olaylara bağla.
3. Doğrulama rozetleri için gerçek akış (telefon OTP, kimlik/belge yükleme + admin onayı, Supabase Storage).
4. Sayfalama + PostGIS (`earth_distance`/`ST_DWithin`) ile "yakınımdaki usta"; arama için `pg_trgm`. *(Y4)*
5. Supabase Realtime ile sohbet ve canlı takip; polling'i kaldır.
6. Ödeme: abonelikler için iyzico/PayTR entegrasyonu + webhook. *(Y7)*

### Faz 3 — Kalite, performans, SEO (1–2 hafta)
1. Lint'i sıfırla (`any` → gerçek tipler, `fetchData` hook düzeni, boş `catch`); CI'da `lint + tsc + build` zorunlu. *(O1, O2)*
2. Vitest + Testing Library (auth, formlar), Playwright ile ana akışlar için e2e; GitHub Actions.
3. `React.lazy` ile route bazlı bölme; görselleri WebP/AVIF; Tailwind CDN ve tam Font Awesome'ı kaldır. *(O5)*
4. SEO: `robots.txt`, `sitemap.xml` (blog/usta dinamik), canonical, OG görseli, JSON-LD, sayfa başına `<title>`/meta (react-helmet-async veya prerender/Next.js geçişi değerlendir). *(O6)*
5. Erişilebilirlik denetimi (axe), klavye gezinmesi, kontrast. *(O7)*
6. `vercel.json` önbellek kurallarını düzelt; `api-old/`, `lib/`, `.vite-source-tags.js`, tekrarlı `.vercelignore` girdilerini temizle; `package.json` adını `ustabasi` yap. *(O3, O8)*
7. Ortam değişkenlerini tekilleştir (`VITE_*` istemci, diğerleri sunucu), `.env.example` ve DEPLOYMENT.md'yi güncelle. *(O4)*

### Faz 4 — Büyüme ve yasal uyum (sürekli)
1. Gizlilik politikası, kullanım koşulları, çerez izni, KVKK başvuru formu; konum ve telefon verisi için saklama süreleri. *(Y6)*
2. Gerçek istatistikleri DB'den çek (uydurma sayılar yayından kalksın).
3. PWA (manifest, offline, push bildirim), mobil uygulama değerlendirmesi.
4. Analitik (Vercel Analytics/Plausible), hata izleme (Sentry), uptime izleme.
5. Gözlemlenebilirlik: Supabase log/advisor taramaları, haftalık yedek testi, rate limiting (Vercel Firewall / Upstash).

## 4. Önceliklendirme (etki / efor)

| Sıra | İş | Etki | Efor |
|------|----|------|------|
| 1 | K1 index.html'i düzelt | Site çalışır hale gelir | Çok düşük |
| 2 | K2/K3/K4 yetkilendirme + RLS + gerçek user id | Veri sızıntısı ve kötüye kullanım kapanır | Orta |
| 3 | Y1/Y3 profil + migration | Ürün akışı ve tekrarlanabilir kurulum | Orta |
| 4 | O1/O2 lint + CI | Regresyon önleme | Düşük |
| 5 | SEO + performans | Organik trafik, hız | Orta |
| 6 | Ödeme, PWA, analitik | Gelir ve büyüme | Yüksek |

## 5. Doğrulanamayanlar (canlı site / Supabase erişimi gerekir)

- Canlı sitenin şu an hangi sürümü servis ettiği, Lighthouse/Core Web Vitals sonuçları.
- Supabase'de RLS gerçekten açık mı, tablo şeması ve indeksler.
- Service-role anahtarının geçmişte sızıp sızmadığı (git geçmişi taraması önerilir: `run_secret_scanning`).
