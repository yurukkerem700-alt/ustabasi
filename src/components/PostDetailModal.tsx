import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Heart, MessageCircle, Bookmark, Share2, MapPin, Star,
  Clock, DollarSign, Shield, Award, BadgeCheck, Send,
  CheckCircle2, Phone, MessageSquare, Calendar, Wrench,
  ChevronLeft, ChevronRight, User, Check
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import ReputationBadges from './ReputationBadges';
import { Link } from 'react-router-dom';

interface Props {
  post: any | null;
  onClose: () => void;
}

export default function PostDetailModal({ post, onClose }: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (post) {
      fetchComments();
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [post]);

  const fetchComments = async () => {
    if (!post?.id) return;
    try {
      const res = await fetch(`/api/ustagram-comments?post_id=${post.id}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    }
  };

  const sendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post?.id) return;
    try {
      await fetch('/api/ustagram-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id, user_id: 'demo-user', user_name: 'Misafir Kullanıcı', content: newComment })
      });
      setNewComment('');
      fetchComments();
    } catch {}
  };

  if (!post) return null;
  const usta = post?.ustas || {};
  const fallbackImg = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800';
  const galleryImages = post?.gallery_images || [];
  const allImages = [post?.after_image || post?.before_image || fallbackImg, ...galleryImages].filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl max-w-5xl w-full max-h-[100vh] sm:max-h-[92vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Media Side */}
          <div className="lg:w-3/5 bg-black flex items-center justify-center relative">
            {post?.post_type === 'before_after' && post?.before_image && post?.after_image ? (
              <BeforeAfterSlider
                beforeImage={post.before_image}
                afterImage={post.after_image}
                className="w-full h-72 sm:h-96 lg:h-full max-h-[50vh] lg:max-h-[92vh]"
              />
            ) : allImages.length > 1 ? (
              <div className="relative w-full h-72 sm:h-96 lg:h-full max-h-[50vh] lg:max-h-[92vh]">
                <img src={allImages[galleryIndex]} alt="" className="w-full h-full object-contain" />
                {galleryIndex > 0 && (
                  <button onClick={() => setGalleryIndex(i => i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <ChevronLeft size={20} />
                  </button>
                )}
                {galleryIndex < allImages.length - 1 && (
                  <button onClick={() => setGalleryIndex(i => i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <ChevronRight size={20} />
                  </button>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i === galleryIndex ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </div>
            ) : (
              <img src={post?.after_image || post?.before_image || fallbackImg} alt="" className="w-full h-72 sm:h-96 lg:h-full max-h-[50vh] lg:max-h-[92vh] object-contain" />
            )}
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 lg:hidden">
              <X size={18} />
            </button>
          </div>

          {/* Info Side */}
          <div className="lg:w-2/5 flex flex-col max-h-[50vh] lg:max-h-[92vh]">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={usta?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usta?.name || 'u'}`} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm">{usta?.name || 'Usta'}</span>
                    {usta?.certified && <BadgeCheck size={14} className="text-amber-500" />}
                  </div>
                  <p className="text-xs text-gray-500">{usta?.location || ''}</p>
                </div>
              </div>
              <button onClick={onClose} className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              <div>
                <h2 className="font-bold text-lg mb-1">{post?.title || ''}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{post?.caption || ''}</p>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-2">
                {post?.cost_min && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><DollarSign size={12} /> Maliyet</p>
                    <p className="font-semibold text-sm">{post.cost_min.toLocaleString('tr-TR')} - {post.cost_max?.toLocaleString('tr-TR')} TL</p>
                  </div>
                )}
                {post?.duration_days && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock size={12} /> Süre</p>
                    <p className="font-semibold text-sm">{post.duration_days} gün</p>
                  </div>
                )}
                {post?.completion_date && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12} /> Tarih</p>
                    <p className="font-semibold text-sm">{post.completion_date}</p>
                  </div>
                )}
                {post?.materials && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 col-span-2">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Wrench size={12} /> Malzemeler</p>
                    <p className="font-semibold text-sm">{post.materials}</p>
                  </div>
                )}
              </div>

              {/* Badges */}
              <ReputationBadges usta={usta} size="md" />

              {/* Conversion Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Link to={`/usta/${usta?.id || ''}`} className="col-span-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold text-center hover:shadow-lg transition-all">
                  Profili Görüntüle
                </Link>
                <Link to="/is-talebi" className="py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-sm font-medium text-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
                  <Phone size={14} /> Teklif Al
                </Link>
                <Link to={`/mesajlar`} className="py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-sm font-medium text-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
                  <MessageSquare size={14} /> Mesaj At
                </Link>
              </div>

              {/* Comments */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold mb-3">Yorumlar ({comments.length})</h3>
                <div className="space-y-3">
                  {comments.length === 0 && <p className="text-xs text-gray-500">Henüz yorum yok. İlk yorumu sen yap!</p>}
                  {comments.map((c: any) => (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(c.user_name || 'U')[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{c.user_name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => setLiked(!liked)} className={`transition-colors ${liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                  <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button className="text-gray-700 dark:text-gray-300">
                  <MessageCircle size={24} />
                </button>
                <button onClick={() => setSaved(!saved)} className={`transition-colors ${saved ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'}`}>
                  <Bookmark size={24} fill={saved ? 'currentColor' : 'none'} />
                </button>
                <button className="text-gray-700 dark:text-gray-300 ml-auto">
                  <Share2 size={22} />
                </button>
              </div>
              <form onSubmit={sendComment} className="flex gap-2">
                <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Yorum yaz..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                <button type="submit" disabled={!newComment.trim()} className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white disabled:opacity-50">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
