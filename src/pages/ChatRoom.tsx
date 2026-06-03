import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Users, Clock } from 'lucide-react';

export default function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRoom();
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRoom = async () => {
    try {
      const res = await fetch('/api/chat-rooms');
      const data = await res.json();
      const r = Array.isArray(data) ? data.find((x: any) => x.id === parseInt(roomId || '0')) : null;
      setRoom(r);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat-messages?room_id=${roomId}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await fetch('/api/chat-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: parseInt(roomId || '0'), user_id: 'demo-user', user_name: 'Misafir Kullanıcı', content: input })
      });
      setInput('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-16 h-screen flex flex-col">
      {/* Header */}
      <div className="glass border-b border-gray-200 dark:border-white/10 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/sohbet" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h2 className="font-semibold text-sm">{room?.name || 'Sohbet Kanalı'}</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1"><Users size={10} /> {room?.member_count || 0} üye • <span className="text-green-500">Çevrimiçi</span></p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide max-w-3xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full"><div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" /></div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">Henüz mesaj yok. Sohbeti başlat!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === 'demo-user';
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-md'
                }`}>
                  {!isMe && <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.user_name}</p>}
                  <p>{msg.content}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                    <Clock size={10} />
                    {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-white/10 p-3 max-w-3xl mx-auto w-full">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Mesaj yaz..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
          />
          <button type="submit" disabled={!input.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white disabled:opacity-50 hover:shadow-lg transition-all">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
