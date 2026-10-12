// Örnek (demo) veri. Gerçek veritabanı olmadan uygulamanın tüm sekmeleri bu verilerle çalışır.
// Tarihler, verinin ilk oluşturulduğu ana göre hesaplanır; böylece her zaman "taze" görünür.

export type Row = Record<string, any>;

export interface DB {
  categories: Row[];
  ustas: Row[];
  reviews: Row[];
  jobs: Row[];
  offers: Row[];
  messages: Row[];
  companies: Row[];
  company_employees: Row[];
  company_jobs: Row[];
  chat_rooms: Row[];
  chat_messages: Row[];
  emergency: Row[];
  tracking: Row[];
  notifications: Row[];
  blog: Row[];
  contact: Row[];
}

export const CITY_CENTER: [number, number] = [41.0082, 28.9784]; // İstanbul

const CATEGORY_NAMES = [
  'Elektrik', 'Su Tesisatı', 'Boya', 'Temizlik', 'Nakliyat', 'Klima', 'Mobilya', 'Çatı',
  'İnşaat', 'Bahçe', 'Cam Balkon', 'Fayans', 'Parke', 'Alçıpan', 'Kombi',
];

type UstaSeed = [string, string[], string, number, number, string, number, number, number, string];
// ad, uzmanlıklar, konum, enlem, boylam, durum, puan, tamamlanan iş, deneyim(yıl), rozetler (i=kimlik p=telefon a=adres s=sertifika r=premium)
const USTAS: UstaSeed[] = [
  ['Mehmet Yıldız', ['Elektrik', 'Alçıpan'], 'İstanbul, Kadıköy', 40.9923, 29.0275, 'active', 4.9, 412, 15, 'ipasr'],
  ['Ayşe Demir', ['Boya', 'Alçıpan'], 'Ankara, Çankaya', 39.9179, 32.8627, 'active', 4.8, 268, 9, 'ipa'],
  ['Hasan Kaya', ['Su Tesisatı', 'Kombi'], 'İzmir, Karşıyaka', 38.4592, 27.1153, 'active', 4.7, 305, 12, 'ips'],
  ['Burak Şahin', ['Klima', 'Kombi'], 'Bursa, Nilüfer', 40.2132, 28.9344, 'available', 4.8, 198, 8, 'ipsr'],
  ['Kemal Arslan', ['Mobilya', 'Parke'], 'Tokat, Merkez', 40.3167, 36.5544, 'active', 4.6, 143, 20, 'ip'],
  ['Selim Çelik', ['Cam Balkon', 'Çatı'], 'İstanbul, Üsküdar', 41.0257, 29.0153, 'active', 4.7, 334, 11, 'ipas'],
  ['Zeynep Öztürk', ['Temizlik'], 'Antalya, Muratpaşa', 36.8841, 30.7056, 'active', 4.9, 221, 6, 'ipa'],
  ['Oğuz Tekin', ['Nakliyat'], 'Kocaeli, İzmit', 40.7654, 29.9408, 'busy', 4.5, 187, 14, 'ip'],
  ['Fatma Güneş', ['İnşaat', 'Fayans'], 'Konya, Selçuklu', 37.9, 32.4864, 'available', 4.4, 96, 10, 'ip'],
  ['Murat Aydın', ['Elektrik', 'Klima'], 'İstanbul, Beşiktaş', 41.0422, 29.0067, 'active', 4.8, 276, 13, 'ipsr'],
  ['Elif Korkmaz', ['Fayans', 'Parke'], 'İstanbul, Şişli', 41.0602, 28.9877, 'active', 4.7, 164, 7, 'ipa'],
  ['Can Yılmaz', ['Su Tesisatı'], 'İstanbul, Bakırköy', 40.9819, 28.8772, 'active', 4.6, 211, 9, 'ip'],
  ['Hüseyin Polat', ['Çatı', 'İnşaat'], 'Adana, Seyhan', 37.0, 35.3213, 'available', 4.5, 129, 18, 'ips'],
  ['Merve Acar', ['Bahçe', 'Temizlik'], 'İzmir, Bornova', 38.4622, 27.2204, 'active', 4.8, 112, 5, 'ipa'],
  ['Emre Doğan', ['Boya', 'Fayans'], 'İstanbul, Ataşehir', 40.9923, 29.1244, 'active', 4.6, 189, 8, 'ip'],
  ['Gülsüm Erdem', ['Temizlik', 'Bahçe'], 'Ankara, Yenimahalle', 39.9667, 32.8106, 'offline', 4.7, 84, 4, 'ip'],
  ['Ramazan Koç', ['Nakliyat'], 'İstanbul, Esenyurt', 41.0343, 28.6801, 'active', 4.4, 256, 16, 'ip'],
  ['Tuğba Kaplan', ['Klima', 'Elektrik'], 'Eskişehir, Odunpazarı', 39.7667, 30.5256, 'available', 4.9, 97, 6, 'ipas'],
  ['Serkan Özdemir', ['Alçıpan', 'Boya'], 'İstanbul, Maltepe', 40.9358, 29.1553, 'active', 4.5, 173, 10, 'ipa'],
  ['Nurcan Aksoy', ['Mobilya'], 'Gaziantep, Şahinbey', 37.0594, 37.3825, 'active', 4.6, 138, 12, 'ip'],
  ['Barış Çetin', ['Kombi', 'Su Tesisatı'], 'Samsun, Atakum', 41.3297, 36.2744, 'busy', 4.7, 242, 11, 'ips'],
  ['İbrahim Kurt', ['Cam Balkon'], 'Trabzon, Ortahisar', 41.0027, 39.7168, 'available', 4.3, 74, 9, 'ip'],
  ['Derya Yavuz', ['Parke', 'Fayans'], 'Kayseri, Melikgazi', 38.7225, 35.4875, 'active', 4.6, 106, 8, 'ipa'],
  ['Volkan Türk', ['Elektrik', 'İnşaat'], 'İstanbul, Pendik', 40.8786, 29.2333, 'active', 4.7, 231, 14, 'ipsr'],
];

const ABOUTS: Record<string, string> = {
  Elektrik: 'Konut ve iş yeri elektrik tesisatı, pano yenileme, kaçak akım ve aydınlatma projeleri. Tüm işlerde garanti verilir.',
  'Su Tesisatı': 'Cihazlı kaçak tespiti, kırmadan müdahale, tıkanıklık açma ve batarya değişimi. Aynı gün servis.',
  Boya: 'Temiz işçilik, zamanında teslim. İç/dış cephe boya, saten uygulamalar ve dekoratif duvar kaplamaları.',
  Temizlik: 'Ev, ofis ve inşaat sonrası detaylı temizlik. Buharlı koltuk ve halı yıkama hizmeti.',
  Nakliyat: 'Sigortalı evden eve nakliyat, paketleme ve asansörlü taşıma. Eşyalarınız bizimle güvende.',
  Klima: 'Tüm marka klima bakımı, gaz dolumu, montaj ve arıza giderme. Yetkili servis tecrübesi.',
  Mobilya: 'Ölçüye özel mutfak, gardırop ve masif ahşap imalatı. Mobilya montajı ve onarımı.',
  Çatı: 'Çatı onarımı, yalıtım, oluk ve kiremit değişimi. Sızıntı tespiti ve kalıcı çözüm.',
  İnşaat: 'Komple daire tadilatı, kaba ve ince işler. Banyo ve mutfak yenileme, ücretsiz keşif.',
  Bahçe: 'Peyzaj düzenleme, çim serme, sulama sistemi kurulumu ve mevsimlik bakım.',
  'Cam Balkon': 'Katlanır cam balkon, PVC ve alüminyum doğrama imalatı ve montajı.',
  Fayans: 'Fayans, seramik ve mermer döşeme. Banyo ve mutfak yenilemede kusursuz derz işçiliği.',
  Parke: 'Laminat ve masif parke döşeme, parke cilası ve süpürgelik montajı.',
  Alçıpan: 'Alçıpan asma tavan, bölme duvar, kartonpiyer ve dekoratif tavan uygulamaları.',
  Kombi: 'Kombi bakımı, petek temizliği, doğalgaz tesisatı ve kalorifer işleri. Yetkili servis deneyimi.',
};

const REVIEW_TEXTS: [number, string][] = [
  [5, 'İşini çok temiz yaptı, söz verdiği saatte geldi. Kesinlikle tavsiye ederim.'],
  [5, 'Aynı gün geldi, sorunu kısa sürede çözdü. Fiyat da gayet makuldü.'],
  [5, 'Çok ilgili ve bilgili bir usta. Her adımı açıkladı, sonuçtan çok memnunuz.'],
  [4, 'İşçilik güzel, sadece biraz geç geldi. Sonuç beklentimin üzerinde.'],
  [5, 'Ekibiyle birlikte düzenli çalıştı, çalıştıkları alanı tertemiz bıraktılar.'],
  [4, 'Teklif ettiği fiyattan sapmadı. Memnun kaldık, tekrar çalışırız.'],
  [5, 'Garantisini verdi, ufak bir sorunda tekrar gelip ücretsiz düzeltti.'],
  [3, 'İş güzeldi ama iletişimde biraz yavaştı. Yine de sonuç iyi.'],
];
const REVIEWERS = ['Murat K.', 'Elif S.', 'Can T.', 'Ayşe Y.', 'Burak D.', 'Selin A.', 'Hakan Ö.', 'Deniz B.', 'Gizem M.', 'Okan E.'];

const AVATAR_COLORS: [string, string][] = [['#2f6bff', '#8b5cf6'], ['#0ea5e9', '#2f6bff'], ['#8b5cf6', '#ec4899'], ['#10b981', '#0ea5e9'], ['#f59e0b', '#ef4444'], ['#6366f1', '#14b8a6']];

// Harici servise bağımlı olmayan, baş harfli SVG avatar (data URI)
function avatarFor(name: string, i: number): string {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toLocaleUpperCase('tr');
  const [c1, c2] = AVATAR_COLORS[i % AVATAR_COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="128" height="128" rx="24" fill="url(#g)"/><text x="64" y="64" dy=".35em" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="52" font-weight="700" fill="#fff">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function buildSeed(now: number): DB {
  const ago = (min: number) => new Date(now - min * 60_000).toISOString();

  const categories = CATEGORY_NAMES.map((name, i) => ({ id: i + 1, name }));

  const ustas = USTAS.map(([name, specialties, location, lat, lng, status, rating, jobs, exp, badges], i) => ({
    id: i + 1,
    name,
    avatar: avatarFor(name, i),
    specialties,
    location,
    lat,
    lng,
    status,
    rating,
    rating_count: Math.max(8, Math.round(jobs / 3)),
    completed_jobs: jobs,
    experience: exp,
    about: ABOUTS[specialties[0]],
    phone: `05${30 + (i % 20)} ${100 + i * 7} ${10 + i} ${20 + i}`,
    identity_verified: badges.includes('i'),
    phone_verified: badges.includes('p'),
    address_verified: badges.includes('a'),
    certified: badges.includes('s'),
    premium: badges.includes('r'),
    created_at: ago(60 * 24 * (200 + i * 9)),
  }));

  const reviews: Row[] = [];
  let rid = 1;
  ustas.forEach((u, i) => {
    const n = 2 + (i % 3);
    for (let k = 0; k < n; k++) {
      const [rating, comment] = REVIEW_TEXTS[(i * 3 + k) % REVIEW_TEXTS.length];
      reviews.push({
        id: rid++, usta_id: u.id, rating, comment,
        author_name: REVIEWERS[(i + k * 4) % REVIEWERS.length],
        created_at: ago(60 * 24 * (6 + k * 17 + i)),
      });
    }
  });

  const jobs: Row[] = [
    { id: 'job_seed1', category_id: 4, title: 'Salon ve koridor boyası', description: '3+1 dairenin salon ve koridoru saten boya ile yenilenecek. Eşyalar kısmen boşaltılacak, alçı rötuşu gerekebilir.', location: 'İstanbul, Kadıköy', budget: 18000, user_id: 'demo-user', images: [], status: 'open', created_at: ago(60 * 5) },
    { id: 'job_seed2', category_id: 1, title: 'Elektrik panosu yenileme', description: 'Eski sigorta panosu değiştirilecek, kaçak akım rölesi eklenecek. Daire 90 m².', location: 'İstanbul, Beşiktaş', budget: 9500, user_id: 'demo-user', images: [], status: 'open', created_at: ago(60 * 26) },
    { id: 'job_seed3', category_id: 12, title: 'Banyo fayans ve seramik yenileme', description: 'Banyo duvar ve zemin fayansları sökülüp yenisi döşenecek. Yaklaşık 14 m² alan.', location: 'İstanbul, Şişli', budget: 32000, user_id: 'demo-user', images: [], status: 'assigned', created_at: ago(60 * 24 * 4) },
    { id: 'job_seed4', category_id: 5, title: 'Evden eve nakliyat (2+1)', description: 'Bakırköy’den Pendik’e 2+1 daire taşınacak. Asansörlü, paketleme dahil.', location: 'İstanbul, Bakırköy', budget: 14000, user_id: 'demo-user', images: [], status: 'open', created_at: ago(60 * 24 * 2) },
  ];

  const mkOffers = (jobId: string, ustaIds: number[], base: number, accepted?: number): Row[] =>
    ustaIds.map((uid, i) => ({
      id: `offer_${jobId}_${uid}`, job_id: jobId, usta_id: uid,
      price: Math.round((base * (0.88 + i * 0.1)) / 50) * 50,
      estimated_days: 2 + i * 2,
      message: ['Merhaba, işi detaylı inceledim. Malzeme dahil net fiyat veriyorum, garanti sunuyorum.', 'Uygun olduğunuz gün keşfe gelebilirim. Fiyat malzeme hariçtir, işçilik garantilidir.', 'Benzer işleri sık yapıyorum. Hızlı ve temiz çalışırım, hafta içi başlayabilirim.'][i % 3],
      status: accepted === uid ? 'accepted' : 'pending',
      created_at: ago(60 * 3 - i * 20),
    }));
  const offers: Row[] = [
    ...mkOffers('job_seed1', [2, 15, 19], 18000),
    ...mkOffers('job_seed2', [1, 10, 24], 9500),
    ...mkOffers('job_seed3', [11, 9, 15], 32000, 11),
    ...mkOffers('job_seed4', [17, 8], 14000),
  ];

  const messages: Row[] = [
    { id: 'msg_s1', sender_id: 'usta-2', receiver_id: 'demo-user', job_id: 'job_seed1', content: 'Merhaba, salon boyası için teklifimi gönderdim. İsterseniz yarın keşfe gelebilirim.', created_at: ago(60 * 4) },
    { id: 'msg_s2', sender_id: 'demo-user', receiver_id: 'usta-2', job_id: 'job_seed1', content: 'Merhaba, teşekkürler. Yarın akşam 18:00 uygun mu?', created_at: ago(60 * 3.5) },
    { id: 'msg_s3', sender_id: 'usta-2', receiver_id: 'demo-user', job_id: 'job_seed1', content: 'Uygun, 18:00’de adreste olurum. Renk kartelasını da getiririm.', created_at: ago(60 * 3.4) },
  ];

  const companies: Row[] = [
    { id: 1, name: 'Yıldız Yapı & Tadilat', description: 'Anahtar teslim tadilat ve renovasyon. 15 yıllık tecrübe, 40+ kişilik ekip.', industry: 'İnşaat', location: 'İstanbul, Kadıköy', employee_count: 42, email: 'info@yildizyapi.example', phone: '0216 555 01 01', website: 'yildizyapi.example', verified: true, lat: 40.9903, lng: 29.0292 },
    { id: 2, name: 'Anadolu Elektrik', description: 'Endüstriyel ve konut elektrik tesisatı, pano imalatı, bakım sözleşmeleri.', industry: 'Elektrik', location: 'Ankara, Çankaya', employee_count: 28, email: 'iletisim@anadoluelektrik.example', phone: '0312 555 02 02', website: 'anadoluelektrik.example', verified: true, lat: 39.9208, lng: 32.8541 },
    { id: 3, name: 'Ege Tesisat Servisi', description: '7/24 su tesisatı, kombi ve doğalgaz servisi. Cihazlı kaçak tespiti.', industry: 'Tesisat', location: 'İzmir, Karşıyaka', employee_count: 19, email: 'servis@egetesisat.example', phone: '0232 555 03 03', website: 'egetesisat.example', verified: true, lat: 38.4561, lng: 27.1112 },
    { id: 4, name: 'Marmara Nakliyat', description: 'Sigortalı evden eve ve ofis taşımacılığı, asansörlü nakliyat ve depolama.', industry: 'Nakliyat', location: 'Kocaeli, İzmit', employee_count: 35, email: 'bilgi@marmaranakliyat.example', phone: '0262 555 04 04', website: 'marmaranakliyat.example', verified: false, lat: 40.7667, lng: 29.9167 },
    { id: 5, name: 'Akdeniz Klima Sistemleri', description: 'Klima ve havalandırma montajı, periyodik bakım ve yetkili servis.', industry: 'Klima', location: 'Antalya, Muratpaşa', employee_count: 22, email: 'destek@akdenizklima.example', phone: '0242 555 05 05', website: 'akdenizklima.example', verified: true, lat: 36.8969, lng: 30.7133 },
    { id: 6, name: 'Karadeniz Çatı & Yalıtım', description: 'Çatı onarımı, su yalıtımı ve mantolama. Garantili işçilik.', industry: 'Çatı', location: 'Trabzon, Ortahisar', employee_count: 15, email: 'info@karadenizcati.example', phone: '0462 555 06 06', website: 'karadenizcati.example', verified: false, lat: 41.0015, lng: 39.7178 },
  ];

  const company_employees: Row[] = [
    [1, 1, 'Proje Müdürü'], [1, 6, 'Kıdemli Usta'], [1, 19, 'Alçı & Boya Ustası'], [1, 15, 'Boya Ustası'],
    [2, 2, 'Saha Sorumlusu'], [2, 18, 'Elektrik Teknisyeni'], [3, 3, 'Servis Şefi'], [3, 21, 'Tesisat Ustası'],
    [4, 8, 'Nakliyat Ustabaşı'], [4, 17, 'Taşıma Ekip Lideri'], [5, 4, 'Teknik Sorumlu'], [5, 10, 'Klima Teknisyeni'],
    [6, 13, 'Çatı Ustası'], [6, 22, 'Montaj Ustası'],
  ].map(([company_id, usta_id, role], i) => ({ id: i + 1, company_id, usta_id, role, status: 'active', created_at: ago(60 * 24 * (30 + i)) }));

  const company_jobs: Row[] = [
    { company_id: 1, usta_id: 1, title: 'Villa komple tadilat', description: '3 katlı villada elektrik, boya ve alçı işleri.', location: 'İstanbul, Kadıköy', budget: 480000, status: 'in_progress', lat: 40.9951, lng: 29.0401 },
    { company_id: 1, usta_id: 19, title: 'Ofis katı boya ve alçıpan', description: '600 m² ofis katı alçıpan bölme ve boya.', location: 'İstanbul, Maltepe', budget: 210000, status: 'assigned', lat: 40.9358, lng: 29.1553 },
    { company_id: 1, usta_id: 15, title: 'Apartman dış cephe boyası', description: '8 katlı apartman dış cephe boya ve iskele.', location: 'İstanbul, Ataşehir', budget: 320000, status: 'completed', lat: 40.9923, lng: 29.1244 },
    { company_id: 2, usta_id: 2, title: 'Fabrika pano yenileme', description: 'Üretim hattı için ana dağıtım panosu yenileme.', location: 'Ankara, Sincan', budget: 150000, status: 'in_progress', lat: 39.9667, lng: 32.5833 },
    { company_id: 2, usta_id: 18, title: 'AVM aydınlatma modernizasyonu', description: 'LED dönüşümü ve otomasyon.', location: 'Ankara, Çankaya', budget: 275000, status: 'assigned', lat: 39.9179, lng: 32.8627 },
    { company_id: 3, usta_id: 3, title: 'Site kalorifer tesisatı', description: '120 daireli sitede kalorifer ve kombi bakımı.', location: 'İzmir, Karşıyaka', budget: 95000, status: 'completed', lat: 38.4592, lng: 27.1153 },
    { company_id: 3, usta_id: 21, title: 'Su kaçağı tespiti ve onarımı', description: 'Zemin altı kaçak tespiti.', location: 'İzmir, Bornova', budget: 38000, status: 'in_progress', lat: 38.4622, lng: 27.2204 },
    { company_id: 4, usta_id: 8, title: 'Ofis taşıma (3 kat)', description: 'Sigortalı ofis taşıma, IT ekipman koruması.', location: 'Kocaeli, İzmit', budget: 62000, status: 'completed', lat: 40.7654, lng: 29.9408 },
    { company_id: 5, usta_id: 4, title: 'Otel klima montajı', description: '60 odalı otelde klima değişimi.', location: 'Antalya, Muratpaşa', budget: 410000, status: 'in_progress', lat: 36.8841, lng: 30.7056 },
    { company_id: 6, usta_id: 13, title: 'Fabrika çatı yalıtımı', description: '2.000 m² çatı su yalıtımı.', location: 'Trabzon, Ortahisar', budget: 185000, status: 'assigned', lat: 41.0027, lng: 39.7168 },
  ].map((j, i) => ({ id: i + 1, created_at: ago(60 * 24 * (3 + i * 4)), ...j }));

  const chat_rooms: Row[] = [
    { id: 1, name: 'Elektrikçiler', category: 'Elektrik', icon: 'Zap', description: 'Pano, tesisat ve aydınlatma üzerine bilgi paylaşımı.', member_count: 1284 },
    { id: 2, name: 'Tesisatçılar', category: 'Su Tesisatı', icon: 'Droplets', description: 'Kaçak tespiti, boru ve kombi tecrübeleri.', member_count: 962 },
    { id: 3, name: 'Boya & Badana', category: 'Boya', icon: 'Paintbrush', description: 'Malzeme, teknik ve fiyatlandırma sohbeti.', member_count: 745 },
    { id: 4, name: 'İnşaat & Tadilat', category: 'İnşaat', icon: 'HardHat', description: 'Tadilat projeleri ve ekip yönetimi.', member_count: 1103 },
    { id: 5, name: 'Nakliyatçılar', category: 'Nakliyat', icon: 'Truck', description: 'Taşıma ekipmanları, sigorta ve rota önerileri.', member_count: 538 },
    { id: 6, name: 'Genel Usta Sohbeti', category: 'Genel', icon: 'MessageCircle', description: 'Tüm meslekler için açık sohbet kanalı.', member_count: 2310 },
  ];

  const chat_messages: Row[] = [
    [1, 'Mehmet Y.', 'Panoda kaçak akım rölesi seçerken 30 mA mı 100 mA mı kullanıyorsunuz?', 95],
    [1, 'Murat A.', 'Konutta mutlaka 30 mA. 100 mA genelde ana besleme için.', 90],
    [1, 'Volkan T.', 'Etiketleme de çok önemli, sonradan gelen usta çok rahat ediyor.', 82],
    [2, 'Hasan K.', 'Zemin altı kaçakta termal kamera mı akustik cihaz mı daha iyi sonuç veriyor?', 160],
    [2, 'Can Y.', 'Önce akustik ile bölgeyi daraltıp sonra termal ile doğruluyorum.', 150],
    [3, 'Ayşe D.', 'Yeni alçıda astar bekleme süresi sizce kaç gün olmalı?', 300],
    [3, 'Emre D.', 'Mevsime göre değişiyor ama en az 3 gün bekliyorum.', 280],
    [4, 'Fatma G.', 'Banyo tadilatında su yalıtımı için hangi membranı öneriyorsunuz?', 400],
    [5, 'Oğuz T.', 'Asansörlü nakliyatta kiralama ücretleri bu sene arttı mı?', 520],
    [6, 'Zeynep Ö.', 'Herkese merhaba! Müşteri yorumlarını nasıl artırıyorsunuz?', 700],
    [6, 'Burak Ş.', 'İş bitince samimi bir teşekkür mesajı ve yorum linki işe yarıyor.', 680],
  ].map(([room_id, user_name, content, min], i) => ({ id: i + 1, room_id, user_id: `seed-${i}`, user_name, content, created_at: ago(min as number) }));

  const emergency: Row[] = [
    { id: 1, category: 'Su Tesisatı', title: 'Mutfakta boru patladı', description: 'Evin mutfağında lavabo altındaki boru patladı, su akıyor. Ana vana kapatıldı.', location: 'İstanbul, Bakırköy', urgency: 'critical', user_id: 'demo-user', status: 'assigned', assigned_usta_id: 12, created_at: ago(18) },
    { id: 2, category: 'Elektrik', title: 'Daire elektriği kesildi', description: 'Sigorta atıyor, tekrar kaldırınca hemen düşüyor. Yanık kokusu var.', location: 'İstanbul, Beşiktaş', urgency: 'high', user_id: 'other-user', status: 'assigned', assigned_usta_id: 10, created_at: ago(55) },
    { id: 3, category: 'Doğalgaz', title: 'Kombi gaz kokusu', description: 'Kombinin yanından hafif gaz kokusu geliyor.', location: 'İzmir, Karşıyaka', urgency: 'critical', user_id: 'other-user', status: 'pending', assigned_usta_id: null, created_at: ago(4) },
  ];

  const tracking: Row[] = [
    { id: 1, usta_id: 12, job_id: null, lat: 40.9819, lng: 28.8772, target_lat: CITY_CENTER[0], target_lng: CITY_CENTER[1], eta_minutes: 14, distance_km: 8.2, status: 'on_the_way', updated_at: new Date(now).toISOString() },
    { id: 2, usta_id: 10, job_id: null, lat: 41.0422, lng: 29.0067, target_lat: CITY_CENTER[0], target_lng: CITY_CENTER[1], eta_minutes: 6, distance_km: 3.9, status: 'on_the_way', updated_at: new Date(now - 60_000).toISOString() },
  ];

  const notifications: Row[] = [
    { id: 1, user_id: 'demo-user', type: 'offer', title: 'Yeni teklif aldınız', message: 'Ayşe Demir “Salon ve koridor boyası” işiniz için 15.850 TL teklif verdi.', read: false, created_at: ago(22) },
    { id: 2, user_id: 'demo-user', type: 'emergency', title: 'Acil talebiniz atandı', message: 'Can Yılmaz acil su tesisatı talebinize yönlendirildi, yaklaşık 14 dk içinde yanınızda.', read: false, created_at: ago(15) },
    { id: 3, user_id: 'demo-user', type: 'message', title: 'Yeni mesaj', message: 'Ayşe Demir size bir mesaj gönderdi.', read: false, created_at: ago(60 * 3) },
    { id: 4, user_id: 'demo-user', type: 'job', title: 'İşiniz atandı', message: 'Banyo yenileme işiniz için Elif Korkmaz’ın teklifini kabul ettiniz.', read: true, created_at: ago(60 * 24 * 3) },
    { id: 5, user_id: 'demo-user', type: 'review', title: 'Değerlendirme zamanı', message: 'Tamamlanan işiniz için ustayı değerlendirmeyi unutmayın.', read: true, created_at: ago(60 * 24 * 5) },
    { id: 6, user_id: 'demo-user', type: 'offer', title: 'Yeni teklif aldınız', message: 'Mehmet Yıldız elektrik panosu işiniz için teklif verdi.', read: true, created_at: ago(60 * 24 * 1) },
  ];

  const blog: Row[] = [
    {
      id: 1, slug: 'evde-su-kacagi-nasil-anlasilir', category: 'Tesisat', author: 'Ustabaşı Editör',
      title: 'Evde Su Kaçağı Nasıl Anlaşılır? 7 Erken Uyarı İşareti',
      excerpt: 'Faturanız artmadan, duvarınız küflenmeden önce su kaçağını fark etmenin pratik yolları.',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800', created_at: ago(60 * 24 * 3),
      content: 'Su kaçağı, evlerde en sık karşılaşılan ve en pahalıya mal olan sorunlardan biridir. Erken fark edildiğinde küçük bir onarımla çözülürken, geciktiğinde duvar, zemin ve mobilya hasarına yol açar.\nİlk işaret su faturasındaki ani artıştır. Kullanım alışkanlığınız değişmediği halde fatura yükseldiyse tüm muslukları kapatıp sayacı kontrol edin; sayaç dönmeye devam ediyorsa bir yerde kaçak vardır.\nİkinci işaret duvarlarda ve tavanda beliren lekeler, kabaran boya ve küf kokusudur. Özellikle banyo ve mutfağa komşu duvarları düzenli kontrol edin.\nÜçüncü işaret düşük su basıncıdır. Boru hattında kaçak varsa basınç düşer. Dördüncü işaret ise sessiz bir evde duyulan hafif su akma sesidir.\nŞüphelendiğinizde kırıp dökmeden önce cihazlı kaçak tespiti yaptıran bir usta çağırın. Doğru tespit, hem maliyeti hem de tadilat süresini ciddi biçimde azaltır.',
    },
    {
      id: 2, slug: 'tadilatta-dogru-usta-secimi', category: 'Tadilat', author: 'Ustabaşı Editör',
      title: 'Tadilatta Doğru Usta Nasıl Seçilir?',
      excerpt: 'Referans, puan, teklif karşılaştırma ve sözleşme: ustayla çalışmadan önce bilmeniz gerekenler.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800', created_at: ago(60 * 24 * 8),
      content: 'Tadilat, doğru ustayla çalışıldığında keyifli; yanlış seçimle çalışıldığında stresli bir süreçtir. İşe başlamadan önce birkaç temel kriteri gözden geçirin.\nÖnce puan ve yorumlara bakın. Gerçek müşterilerin yazdığı yorumlar, ustanın işçiliği ve zamanlaması hakkında en güvenilir bilgiyi verir.\nEn az üç teklif alın ve sadece fiyata değil, kapsama bakın: malzeme dahil mi, süre ne kadar, garanti var mı?\nYazılı bir iş tanımı ve ödeme planı hazırlayın. Peşinatı makul tutun, kalan ödemeyi iş aşamalarına bağlayın.\nİş bitince birlikte kontrol listesi yapın ve eksikleri teslimden önce tamamlatın.',
    },
    {
      id: 3, slug: 'kombi-bakimi-ne-zaman-yapilmali', category: 'Kombi', author: 'Ustabaşı Editör',
      title: 'Kombi Bakımı Ne Zaman ve Neden Yapılmalı?',
      excerpt: 'Kış gelmeden yapılan bakım hem faturanızı düşürür hem de arızaları önler.',
      image: 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800', created_at: ago(60 * 24 * 14),
      content: 'Kombiler yılda bir kez bakım gerektirir. En doğru zaman, ısıtma sezonu başlamadan önceki sonbahar aylarıdır.\nBakımda yanma odası, eşanjör ve filtreler temizlenir; gaz ayarı ve emniyet sistemleri kontrol edilir. Bu işlemler verimi artırır ve doğalgaz tüketimini düşürür.\nBakım yaptırmayan kombilerde karbonmonoksit riski artar. Güvenliğiniz için düzenli bakımı ihmal etmeyin.\nPetek temizliği ve sistem suyu kontrolü de aynı ziyarette yapılırsa evinizin her odası eşit ısınır.',
    },
    {
      id: 4, slug: 'banyo-yenilemede-dikkat-edilecekler', category: 'Fayans', author: 'Ustabaşı Editör',
      title: 'Banyo Yenilemede Dikkat Edilecek 6 Nokta',
      excerpt: 'Su yalıtımından derz rengine kadar banyo tadilatında en sık yapılan hatalar.',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', created_at: ago(60 * 24 * 20),
      content: 'Banyo yenileme, evdeki en teknik tadilat işlerinden biridir. Yapılan küçük hatalar yıllar sonra büyük masraflara dönüşebilir.\nEn önemli adım su yalıtımıdır. Fayans öncesi zemin ve duvar alt kısımlarında membran uygulaması mutlaka yapılmalıdır.\nEğim de kritiktir: zemin, giderlere doğru yeterli eğimle hazırlanmazsa su birikir.\nFayans ebatını banyo ölçüsüne göre seçin; büyük ebatlar derz sayısını azaltır ve temizliği kolaylaştırır.\nSon olarak havalandırmayı ihmal etmeyin; nem, en iyi yalıtımı bile zamanla bozar.',
    },
    {
      id: 5, slug: 'elektrik-panosu-guvenligi', category: 'Elektrik', author: 'Ustabaşı Editör',
      title: 'Elektrik Panosu Güvenliği: Her Evde Olması Gerekenler',
      excerpt: 'Kaçak akım rölesi, topraklama ve etiketleme: evinizin elektrik güvenliği için kontrol listesi.',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800', created_at: ago(60 * 24 * 27),
      content: 'Elektrik kaynaklı yangın ve kazaların büyük bölümü önlenebilir. Evinizdeki panoyu bu açıdan gözden geçirin.\nKaçak akım rölesi (30 mA) her konutta bulunmalıdır; ıslak hacimlerin hatları mutlaka röle üzerinden beslenmelidir.\nTopraklama hattı, cihazları ve sizi korur. Priz ve cihazların topraklı olduğundan emin olun.\nPanodaki her sigortanın hangi hattı beslediğini etiketleyin; arıza anında zaman kazandırır.\nEski ve sık atan sigortaları kendiniz değiştirmeyin; yetkili bir elektrik ustasına yaptırın.',
    },
    {
      id: 6, slug: 'yazlik-icin-klima-secimi', category: 'Klima', author: 'Ustabaşı Editör',
      title: 'Doğru Klima Nasıl Seçilir? BTU, Enerji Sınıfı ve Montaj',
      excerpt: 'Oda büyüklüğüne uygun klima seçimi ve montajda dikkat edilecek ayrıntılar.',
      image: 'https://images.unsplash.com/photo-1631545806609-1d3f0b1c5b05?w=800', created_at: ago(60 * 24 * 35),
      content: 'Klima seçerken ilk kriter oda büyüklüğüdür. 20 m² bir oda için yaklaşık 9.000 BTU, 30 m² için 12.000 BTU genellikle yeterlidir.\nEnerji sınıfı yüksek (A++ ve üzeri) inverter modeller ilk alımda biraz pahalı olsa da elektrik faturasında kendini kısa sürede amorti eder.\nMontaj, performansın yarısıdır. İç ve dış ünite arasındaki boru mesafesi, tahliye eğimi ve elektrik hattı kurallara uygun yapılmalıdır.\nYılda bir kez filtre temizliği ve gaz kontrolü yaptırmak ömrünü uzatır.',
    },
  ];

  return { categories, ustas, reviews, jobs, offers, messages, companies, company_employees, company_jobs, chat_rooms, chat_messages, emergency, tracking, notifications, blog, contact: [] };
}
