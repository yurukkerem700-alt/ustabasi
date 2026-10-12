import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Paperclip, Phone, MoreVertical, CheckCheck, Trash2, User, FileText } from 'lucide-react';
import { fetchList } from '../lib/api';

const MAX_IMAGE_BYTES = 400 * 1024;

export default function Chat() {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const ustaParam = searchParams.get('usta');

  const [messages, setMessages] = useState<any[]>([]);
  const [usta, setUsta] = useState<any>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clearedAt, setClearedAt] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sohbet edilen usta: ?usta= parametresi, yoksa işin kabul edilen (ya da ilk) teklifi, yoksa en yüksek puanlı usta.
  useEffect(() => {
    let alive = true;
    (async () => {
      let ustaId: string | number | null = ustaParam;
      if (!ustaId && jobId) {
        const offers = await fetchList(`/api/offers?job_id=${jobId}`);
        const chosen = offers.find((o: any) => o.status === 'accepted') || offers[0];
        if (chosen) ustaId = chosen.usta_id;
      }
      let u: any = null;
      if (ustaId) {
        const res = await fetch(`/api/ustas?id=${ustaId}`);
        u = res.ok ? await res.json() : null;
      } else {
        u = (await fetchList('/api/ustas'))[0] || null;
      }
      if (alive && u && !u.error) setUsta(u);
    })().catch(() => {});
    return () => { alive = false; };
  }, [ustaParam, jobId]);

  const query = jobId ? `?job_id=${jobId}` : ustaParam ? `?usta_id=${ustaParam}` : usta ? `?usta_id=${usta.id}` : '';

  const fetchMessages = async () => {
    setMessages(await fetchList(`/api/messages${query}`));
    setLoading(false);
  };

  useEffect(() => {
    // Varsayılan usta belli olana kadar bekle (aksi halde tüm mesajlar karışık gelir)
    if (!jobId && !ustaParam && !usta) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [query]);

  const visible = clearedAt ? messages.filter(m => m.created_at > clearedAt) : messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visible.length]);

  const post = async (content: string) => {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: 'demo-user',
        receiver_id: usta ? `usta-${usta.id}` : 'usta-1',
        job_id: jobId || null,
        content
      })
    });
    fetchMessages();
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    try { await post(text); } catch (err) { console.error(err); }
  };

  const attach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type.startsWith('image/') && file.size <= MAX_IMAGE_BYTES) {
      const reader = new FileReader();
      reader.onload = () => post(String(reader.result)).catch(console.error);
      reader.readAsDataURL(file);
    } else {
      post(`📎 ${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`).catch(console.error);
    }
  };

  const name = usta?.name || 'Usta';
  const online = usta?.status === 'active';

  return (
    <div className="pt-24 pb-20 h-screen flex flex-col">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                {name[0]}
              </div>
              <div>
                <p className="font-semibold text-sm">{name}</p>
                <p className={`text-xs ${online ? 'text-green-500' : 'text-gray-400'}`}>
                  {online ? 'Çevrimiçi' : usta?.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {usta?.phone && (
                <a href={`tel:${String(usta.phone).replace(/\s/g, '')}`} aria-label={`${name} ustayı ara`} title="Ara" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                  <Phone size={18} />
                </a>
              )}
              <button type="button" aria-label="Sohbet menüsü" aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                <MoreVertical size={18} />
              </button>
            </div>
            {menuOpen && (
              <div className="absolute right-4 top-14 z-10 w-52 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 shadow-xl py-1 text-sm">
                {usta && (
                  <Link to={`/usta/${usta.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                    <User size={14} /> Usta profili
                  </Link>
                )}
                <Link to="/is-talebi" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                  <FileText size={14} /> Teklif iste
                </Link>
                <button
                  type="button"
                  onClick={() => { setClearedAt(new Date().toISOString()); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={14} /> Sohbeti temizle
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {loading ? (
              <div className="flex items-center justify-center h-full"><div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" /></div>
            ) : visible.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Henüz mesaj yok. Sohbeti başlat!
              </div>
            ) : (
              visible.map((msg) => {
                const isMe = msg.sender_id === 'demo-user';
                const isImage = typeof msg.content === 'string' && msg.content.startsWith('data:image/');
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-md'
                    }`}>
                      {isImage ? <img src={msg.content} alt="Gönderilen görsel" className="rounded-lg max-h-60" /> : <p className="break-words">{msg.content}</p>}
                      <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                        <span>{new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-white/10 flex items-center gap-2">
            <input ref={fileRef} type="file" className="hidden" onChange={attach} />
            <button type="button" aria-label="Dosya ekle" onClick={() => fileRef.current?.click()} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Mesaj yaz..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
            />
            <button
              type="submit"
              aria-label="Gönder"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
