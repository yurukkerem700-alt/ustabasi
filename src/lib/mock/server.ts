// Tarayıcı içi örnek API. Gerçek `/api/*` uçlarıyla aynı yanıt biçimlerini döndürür ve
// veriyi localStorage'da saklar. Gerçek backend'e dönmek için VITE_USE_REAL_API=1 yeterlidir.
import { buildSeed, CITY_CENTER, type DB, type Row } from './seed';

const STORAGE_KEY = 'ustabasi_demo_db_v1';
const SPEED_KMH = 35;

let db: DB | null = null;

function load(): DB {
  if (db) return db;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) db = JSON.parse(raw) as DB;
  } catch { /* özel mod / bozuk kayıt: yeniden tohumla */ }
  if (!db) {
    db = buildSeed(Date.now());
    save();
  }
  return db;
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch { /* depolama dolu/kapalı */ }
}

export function resetDemoData() {
  db = null;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* yoksay */ }
}

type Result = [number, unknown];
const ok = (data: unknown, status = 200): Result => [status, data];
const fail = (error: string, status = 400): Result => [status, { error }];

const same = (a: unknown, b: unknown) => String(a) === String(b);
const nowIso = () => new Date().toISOString();
const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const nextId = (rows: Row[]) => rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const byDateDesc = (a: Row, b: Row) => String(b.created_at).localeCompare(String(a.created_at));

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

const ustaOf = (d: DB, id: unknown) => d.ustas.find(u => same(u.id, id)) || null;
const pick = (u: Row | null, keys: string[]) => (u ? Object.fromEntries(keys.map(k => [k, u[k]])) : null);

function notify(d: DB, type: string, title: string, message: string) {
  d.notifications.unshift({ id: nextId(d.notifications), user_id: 'demo-user', type, title, message, read: false, created_at: nowIso() });
}

// Kullanıcı bir mesaj yazınca usta kısa süre sonra yanıt verir (canlı sohbet hissi).
const USTA_REPLIES = [
  'Merhaba, mesajınız için teşekkürler. Detayları inceliyorum, kısa sürede dönüş yapacağım.',
  'Anladım. Yarın uygun bir saatte keşfe gelebilirim, sizin için hangi saat uygun?',
  'Fiyatı keşif sonrası netleştirebiliriz. Fotoğraf paylaşabilirseniz daha net bilgi verebilirim.',
  'Tabii, bu hafta içinde başlayabilirim. Malzemeleri ben temin edebilirim.',
  'Memnuniyetle. İşi garantili yapıyorum, endişeniz olmasın.',
];
const ROOM_REPLIES = [
  'Bende de benzer bir durum olmuştu, şöyle çözmüştüm…',
  'Katılıyorum, deneyimlerime göre en sağlıklısı bu.',
  'Güzel soru! Ben genelde önce ön hazırlığa çok vakit ayırıyorum.',
  'Bu konuda bir kaynak paylaşabilirim, isterseniz yazın.',
  'Teşekkürler, bilgi için sağ olun usta.',
];
const ROOM_VOICES = ['Mehmet Y.', 'Ayşe D.', 'Hasan K.', 'Murat A.', 'Elif K.', 'Can Y.'];

function scheduleUstaReply(ustaKey: string, jobId: unknown) {
  setTimeout(() => {
    const d = load();
    d.messages.push({ id: uid('msg'), sender_id: ustaKey, receiver_id: 'demo-user', job_id: jobId ?? null, content: rand(USTA_REPLIES), created_at: nowIso() });
    save();
  }, 1800);
}

// Bekleyen acil talepleri birkaç saniye sonra en uygun ustaya atar ve takip kaydı açar.
function advanceEmergencies(d: DB) {
  const nameFor: Record<string, string> = { 'Doğalgaz': 'Kombi' };
  for (const r of d.emergency) {
    if (r.status !== 'pending' || Date.now() - new Date(r.created_at).getTime() < 6000) continue;
    const need = nameFor[r.category] || r.category;
    const pool = d.ustas.filter(u => u.status !== 'offline' && u.status !== 'busy');
    const matching = pool.filter(u => u.specialties.includes(need));
    const candidates = matching.length ? matching : pool;
    const best = [...candidates].sort((a, b) =>
      haversineKm(a.lat, a.lng, CITY_CENTER[0], CITY_CENTER[1]) - haversineKm(b.lat, b.lng, CITY_CENTER[0], CITY_CENTER[1]))[0];
    if (!best) continue;
    r.status = 'assigned';
    r.assigned_usta_id = best.id;
    const dist = haversineKm(best.lat, best.lng, CITY_CENTER[0], CITY_CENTER[1]);
    d.tracking.unshift({
      id: nextId(d.tracking), usta_id: best.id, job_id: null, lat: best.lat, lng: best.lng,
      target_lat: CITY_CENTER[0], target_lng: CITY_CENTER[1],
      distance_km: Number(Math.min(dist, 12).toFixed(1)), eta_minutes: Math.ceil((Math.min(dist, 12) / SPEED_KMH) * 60),
      status: 'on_the_way', updated_at: nowIso(),
    });
    // Çok uzaktaki ustalar için gösterimi makul tut: ilk konumu hedefe yaklaştır.
    const t = d.tracking[0];
    if (dist > 12) {
      const f = 12 / dist;
      t.lat = CITY_CENTER[0] + (best.lat - CITY_CENTER[0]) * f;
      t.lng = CITY_CENTER[1] + (best.lng - CITY_CENTER[1]) * f;
    }
    notify(d, 'emergency', 'Acil talebiniz atandı', `${best.name} acil talebinize yönlendirildi, yola çıktı.`);
  }
}

// Yoldaki ustalar zamanla hedefe yaklaşır.
function advanceTracking(d: DB) {
  const now = Date.now();
  for (const t of d.tracking) {
    if (t.status !== 'on_the_way') continue;
    const hours = (now - new Date(t.updated_at).getTime()) / 3_600_000;
    const dist = haversineKm(t.lat, t.lng, t.target_lat, t.target_lng);
    // Gösterimde dakikalar hızlı aksın: gerçek zamanın 20 katı hızla ilerler.
    const travel = SPEED_KMH * hours * 20;
    if (dist - travel <= 0.15) {
      t.lat = t.target_lat; t.lng = t.target_lng; t.distance_km = 0; t.eta_minutes = 0; t.status = 'arrived';
    } else {
      const f = travel / dist;
      t.lat += (t.target_lat - t.lat) * f;
      t.lng += (t.target_lng - t.lng) * f;
      const left = dist - travel;
      t.distance_km = Number(left.toFixed(1));
      t.eta_minutes = Math.max(1, Math.ceil((left / SPEED_KMH) * 60));
    }
    t.updated_at = nowIso();
  }
}

function createOffersFor(d: DB, job: Row) {
  const catName = d.categories.find(c => same(c.id, job.category_id))?.name;
  const ranked = [...d.ustas]
    .filter(u => u.status !== 'offline')
    .sort((a, b) => {
      const am = a.specialties.includes(catName) ? 1 : 0;
      const bm = b.specialties.includes(catName) ? 1 : 0;
      return bm - am || b.rating - a.rating;
    })
    .slice(0, 3);
  const base = Number(job.budget) > 0 ? Number(job.budget) : 4000 + Math.round(Math.random() * 6000);
  const notes = [
    'Merhaba, işi detaylı inceledim. Malzeme dahil net fiyat veriyorum, garanti sunuyorum.',
    'Uygun olduğunuz gün keşfe gelebilirim. Fiyat malzeme hariçtir, işçilik garantilidir.',
    'Benzer işleri sık yapıyorum. Hızlı ve temiz çalışırım, hafta içi başlayabilirim.',
  ];
  ranked.forEach((u, i) => {
    d.offers.push({
      id: uid('offer'), job_id: job.id, usta_id: u.id,
      price: Math.round((base * (0.85 + i * 0.11)) / 50) * 50,
      estimated_days: 1 + i * 2 + Math.floor(Math.random() * 2),
      message: notes[i % notes.length], status: 'pending', created_at: nowIso(),
    });
  });
  notify(d, 'offer', 'Yeni teklifler geldi', `“${job.title}” işiniz için ${ranked.length} usta teklif verdi.`);
}

type Handler = (method: string, q: URLSearchParams, body: any, d: DB) => Result;

const ROUTES: Record<string, Handler> = {
  categories: (_m, _q, _b, d) => ok(d.categories),

  ustas: (m, q, b, d) => {
    if (m === 'GET') {
      const id = q.get('id');
      if (id) {
        const u = ustaOf(d, id);
        return u ? ok(u) : fail('Usta bulunamadı', 404);
      }
      const category = q.get('category'), status = q.get('status'), search = q.get('search');
      const lat = parseFloat(q.get('lat') || ''), lng = parseFloat(q.get('lng') || '');
      let list = d.ustas.filter(u =>
        (!category || u.specialties.some((s: string) => s.toLocaleLowerCase('tr') === category.toLocaleLowerCase('tr'))) &&
        (!status || u.status === status) &&
        (!search || u.name.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))));
      list = list.sort((a, c) => c.rating - a.rating);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        list = list.map(u => ({ ...u, distance_km: Number(haversineKm(u.lat, u.lng, lat, lng).toFixed(1)) }))
          .sort((a, c) => a.distance_km - c.distance_km);
      }
      return ok(list);
    }
    if (m === 'POST') {
      const row = { id: nextId(d.ustas), rating: 0, rating_count: 0, completed_jobs: 0, status: 'available', specialties: [], created_at: nowIso(), ...b };
      d.ustas.push(row);
      return ok(row, 201);
    }
    return fail('Method not allowed', 405);
  },

  reviews: (m, q, b, d) => {
    if (m === 'GET') {
      const id = q.get('usta_id');
      return ok(d.reviews.filter(r => !id || same(r.usta_id, id)).sort(byDateDesc));
    }
    if (m === 'POST') {
      const rating = Math.min(5, Math.max(1, Number(b.rating) || 5));
      const row = { id: nextId(d.reviews), usta_id: Number(b.usta_id), rating, comment: String(b.comment || ''), author_name: b.author_name || 'Misafir Kullanıcı', created_at: nowIso() };
      d.reviews.push(row);
      const u = ustaOf(d, b.usta_id);
      if (u) {
        const n = u.rating_count || 0;
        u.rating = Number(((u.rating * n + rating) / (n + 1)).toFixed(1));
        u.rating_count = n + 1;
      }
      return ok(row, 201);
    }
    return fail('Method not allowed', 405);
  },

  jobs: (m, _q, b, d) => {
    if (m === 'GET') {
      return ok([...d.jobs].sort(byDateDesc).map(j => ({ ...j, categories: { name: d.categories.find(c => same(c.id, j.category_id))?.name || null } })));
    }
    if (m === 'POST') {
      const job = { id: uid('job'), category_id: Number(b.category_id) || b.category_id, title: b.title, description: b.description, location: b.location, budget: b.budget || 0, user_id: b.user_id || 'demo-user', images: b.images || [], status: 'open', created_at: nowIso() };
      d.jobs.push(job);
      createOffersFor(d, job);
      return ok(job, 201);
    }
    if (m === 'PUT') {
      const j = d.jobs.find(x => same(x.id, b.id));
      if (!j) return fail('İş bulunamadı', 404);
      j.status = b.status;
      return ok(j);
    }
    return fail('Method not allowed', 405);
  },

  offers: (m, q, b, d) => {
    if (m === 'GET') {
      const jobId = q.get('job_id');
      return ok(d.offers.filter(o => !jobId || same(o.job_id, jobId))
        .sort((a, c) => a.price - c.price)
        .map(o => ({ ...o, ustas: ustaOf(d, o.usta_id) })));
    }
    if (m === 'POST') {
      const row = { id: uid('offer'), status: 'pending', created_at: nowIso(), ...b };
      d.offers.push(row);
      return ok(row, 201);
    }
    if (m === 'PUT') {
      const o = d.offers.find(x => same(x.id, b.id));
      if (!o) return fail('Teklif bulunamadı', 404);
      o.status = b.status;
      if (b.status === 'accepted') {
        d.offers.filter(x => same(x.job_id, o.job_id) && x.id !== o.id).forEach(x => { x.status = 'rejected'; });
        const job = d.jobs.find(j => same(j.id, o.job_id));
        if (job) job.status = 'assigned';
        notify(d, 'job', 'İşiniz atandı', `${ustaOf(d, o.usta_id)?.name || 'Usta'} teklifini kabul ettiniz${job ? ` (“${job.title}”)` : ''}.`);
      }
      return ok(o);
    }
    return fail('Method not allowed', 405);
  },

  messages: (m, q, b, d) => {
    if (m === 'GET') {
      const jobId = q.get('job_id'), ustaId = q.get('usta_id');
      const key = ustaId ? `usta-${ustaId}` : null;
      return ok(d.messages
        .filter(x => (!jobId || same(x.job_id, jobId)) && (!key || x.sender_id === key || x.receiver_id === key))
        .sort((a, c) => String(a.created_at).localeCompare(String(c.created_at))));
    }
    if (m === 'POST') {
      const row = { id: uid('msg'), sender_id: b.sender_id, receiver_id: b.receiver_id, job_id: b.job_id ?? null, content: String(b.content || ''), created_at: nowIso() };
      d.messages.push(row);
      if (String(row.receiver_id).startsWith('usta-')) scheduleUstaReply(row.receiver_id, row.job_id);
      return ok(row, 201);
    }
    return fail('Method not allowed', 405);
  },

  companies: (m, q, b, d) => {
    if (m === 'GET') {
      const id = q.get('id'), search = q.get('search');
      if (id) {
        const c = d.companies.find(x => same(x.id, id));
        return c ? ok(c) : fail('Firma bulunamadı', 404);
      }
      return ok(d.companies.filter(c => !search || c.name.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))).sort((a, c) => a.name.localeCompare(c.name, 'tr')));
    }
    if (m === 'POST') {
      const row = { id: nextId(d.companies), verified: false, employee_count: 1, ...b };
      d.companies.push(row);
      return ok(row, 201);
    }
    return fail('Method not allowed', 405);
  },

  'company-employees': (m, q, b, d) => {
    if (m === 'GET') {
      const cid = q.get('company_id'), uidq = q.get('usta_id');
      return ok(d.company_employees
        .filter(e => (!cid || same(e.company_id, cid)) && (!uidq || same(e.usta_id, uidq)))
        .map(e => ({ ...e, ustas: ustaOf(d, e.usta_id), companies: d.companies.find(c => same(c.id, e.company_id)) || null })));
    }
    if (m === 'POST') {
      const row = { id: nextId(d.company_employees), status: 'active', created_at: nowIso(), ...b };
      d.company_employees.push(row);
      return ok(row, 201);
    }
    if (m === 'PUT') {
      const e = d.company_employees.find(x => same(x.id, b.id));
      if (!e) return fail('Kayıt bulunamadı', 404);
      e.status = b.status;
      return ok(e);
    }
    return fail('Method not allowed', 405);
  },

  'company-jobs': (m, q, b, d) => {
    if (m === 'GET') {
      const cid = q.get('company_id'), uidq = q.get('usta_id'), st = q.get('status');
      return ok(d.company_jobs
        .filter(j => (!cid || same(j.company_id, cid)) && (!uidq || same(j.usta_id, uidq)) && (!st || j.status === st))
        .sort(byDateDesc)
        .map(j => ({ ...j, ustas: pick(ustaOf(d, j.usta_id), ['name', 'avatar', 'rating']), companies: pick(d.companies.find(c => same(c.id, j.company_id)) || null, ['name']) })));
    }
    if (m === 'POST') {
      const row = { id: nextId(d.company_jobs), status: 'assigned', created_at: nowIso(), ...b };
      d.company_jobs.push(row);
      return ok(row, 201);
    }
    if (m === 'PUT') {
      const j = d.company_jobs.find(x => same(x.id, b.id));
      if (!j) return fail('İş bulunamadı', 404);
      if (b.status) j.status = b.status;
      if (b.usta_id !== undefined) j.usta_id = b.usta_id;
      return ok(j);
    }
    return fail('Method not allowed', 405);
  },

  'chat-rooms': (_m, _q, _b, d) => ok([...d.chat_rooms].sort((a, c) => c.member_count - a.member_count)),

  'chat-messages': (m, q, b, d) => {
    if (m === 'GET') {
      const room = q.get('room_id');
      return ok(d.chat_messages.filter(x => !room || same(x.room_id, room))
        .sort((a, c) => String(a.created_at).localeCompare(String(c.created_at))));
    }
    if (m === 'POST') {
      const row = { id: nextId(d.chat_messages), room_id: Number(b.room_id), user_id: b.user_id, user_name: b.user_name, content: String(b.content || ''), created_at: nowIso() };
      d.chat_messages.push(row);
      setTimeout(() => {
        const dd = load();
        dd.chat_messages.push({ id: nextId(dd.chat_messages), room_id: row.room_id, user_id: 'bot', user_name: rand(ROOM_VOICES), content: rand(ROOM_REPLIES), created_at: nowIso() });
        save();
      }, 3500);
      return ok(row, 201);
    }
    return fail('Method not allowed', 405);
  },

  emergency: (m, q, b, d) => {
    if (m === 'GET') {
      advanceEmergencies(d);
      const st = q.get('status'), user = q.get('user_id');
      return ok(d.emergency.filter(r => (!st || r.status === st) && (!user || r.user_id === user)).sort(byDateDesc)
        .map(r => ({ ...r, ustas: pick(ustaOf(d, r.assigned_usta_id), ['name', 'avatar', 'phone', 'rating', 'lat', 'lng']) })));
    }
    if (m === 'POST') {
      const row = { id: nextId(d.emergency), status: 'pending', assigned_usta_id: null, created_at: nowIso(), ...b };
      d.emergency.push(row);
      return ok(row, 201);
    }
    if (m === 'PUT') {
      const r = d.emergency.find(x => same(x.id, b.id));
      if (!r) return fail('Talep bulunamadı', 404);
      if (b.status) r.status = b.status;
      if (b.assigned_usta_id) r.assigned_usta_id = b.assigned_usta_id;
      return ok(r);
    }
    return fail('Method not allowed', 405);
  },

  tracking: (m, q, b, d) => {
    if (m === 'GET') {
      advanceEmergencies(d);
      advanceTracking(d);
      const ustaId = q.get('usta_id'), jobId = q.get('job_id');
      return ok(d.tracking.filter(t => (!ustaId || same(t.usta_id, ustaId)) && (!jobId || same(t.job_id, jobId)))
        .sort((a, c) => String(c.updated_at).localeCompare(String(a.updated_at)))
        .map(t => ({ ...t, ustas: pick(ustaOf(d, t.usta_id), ['name', 'avatar', 'phone', 'rating']) })));
    }
    if (m === 'POST') {
      const row = { id: nextId(d.tracking), status: 'on_the_way', updated_at: nowIso(), ...b };
      d.tracking.push(row);
      return ok(row, 201);
    }
    if (m === 'PUT') {
      const t = d.tracking.find(x => same(x.id, b.id));
      if (!t) return fail('Kayıt bulunamadı', 404);
      Object.assign(t, Object.fromEntries(['lat', 'lng', 'eta_minutes', 'distance_km', 'status'].filter(k => b[k] !== undefined).map(k => [k, b[k]])), { updated_at: nowIso() });
      return ok(t);
    }
    return fail('Method not allowed', 405);
  },

  notifications: (m, q, b, d) => {
    if (m === 'GET') {
      const user = q.get('user_id');
      return ok(d.notifications.filter(n => !user || n.user_id === user).sort(byDateDesc));
    }
    if (m === 'POST') {
      const row = { id: nextId(d.notifications), read: false, created_at: nowIso(), ...b };
      d.notifications.unshift(row);
      return ok(row, 201);
    }
    if (m === 'PUT') {
      const n = d.notifications.find(x => same(x.id, b.id));
      if (!n) return fail('Bildirim bulunamadı', 404);
      n.read = true;
      return ok(n);
    }
    if (m === 'DELETE') {
      d.notifications = d.notifications.filter(x => !same(x.id, b.id));
      return ok({ ok: true });
    }
    return fail('Method not allowed', 405);
  },

  blog: (m, q, _b, d) => {
    if (m !== 'GET') return fail('Method not allowed', 405);
    const slug = q.get('slug');
    if (slug) {
      const p = d.blog.find(x => x.slug === slug);
      return p ? ok(p) : fail('Yazı bulunamadı', 404);
    }
    return ok([...d.blog].sort(byDateDesc));
  },

  contact: (m, _q, b, d) => {
    if (m !== 'POST') return fail('Method not allowed', 405);
    const row = { id: nextId(d.contact), created_at: nowIso(), ...b };
    d.contact.push(row);
    return ok(row, 201);
  },
};

export function handleMockRequest(method: string, url: URL, body: any): Result {
  const route = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
  const handler = ROUTES[route];
  if (!handler) return fail(`Route not found: /api/${route}`, 404);
  const d = load();
  const result = handler(method, url.searchParams, body || {}, d);
  save();
  return result;
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// window.fetch'i sarar: aynı origin'deki /api/* istekleri örnek veriyle yanıtlanır, diğerleri gerçek ağa gider.
export function installMockApi() {
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, location.origin);
    if (url.origin !== location.origin || !url.pathname.startsWith('/api/')) return realFetch(input, init);

    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    let body: any;
    try { body = init?.body ? JSON.parse(String(init.body)) : undefined; } catch { body = undefined; }
    await delay(60 + Math.random() * 120);
    const [status, data] = handleMockRequest(method, url, body);
    return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  };
}
