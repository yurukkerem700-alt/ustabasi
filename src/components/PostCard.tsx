import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, Bookmark, Share2, MapPin, Star,
  Clock, DollarSign, MoreHorizontal, CheckCircle2, Award,
  Verified, Send
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import UstaProfileMini from './UstaProfileMini';
import ReputationBadges from './ReputationBadges';

interface PostCardProps {
  post: any;
  onOpenDetail: (post: any) => void;
  onLike: (postId: number) => void;
  onSave: (postId: number) => void;
  onFollow?: (ustaId: number) => void;
  likedPosts: Set<number>;
  savedPosts: Set<number>;
  followingUstas?: Set<number>;
}

export default function PostCard({ post, onOpenDetail, onLike, onSave, onFollow, likedPosts, savedPosts, followingUstas }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const usta = post?.ustas || {};
  const isLiked = likedPosts.has(post?.id);
  const isSaved = savedPosts.has(post?.id);
  const isFollowing = followingUstas?.has(usta?.id);
  const fallbackImg = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title || '', text: post?.caption || '', url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {}
  };

  if (!post || !post.id) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden mb-4 shadow-sm"
    >
      {/* Usta Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <UstaProfileMini
          usta={usta}
          showFollow={!!onFollow}
          onFollow={onFollow}
          isFollowing={isFollowing}
        />
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400">
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-white/10 z-20 py-1">
              <button onClick={() => { setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">
                Paylaş
              </button>
              <button onClick={() => { setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">
                Kaydet
              </button>
              <button onClick={() => { setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                Şikayet Et
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media */}
      <div className="relative cursor-pointer bg-black" onClick={() => onOpenDetail(post)}>
        {post?.post_type === 'before_after' && post?.before_image && post?.after_image ? (
          <BeforeAfterSlider
            beforeImage={imageError ? fallbackImg : post.before_image}
            afterImage={imageError ? fallbackImg : post.after_image}
            className="w-full aspect-square sm:aspect-[4/3]"
          />
        ) : post?.gallery_images && Array.isArray(post.gallery_images) && post.gallery_images.length > 0 ? (
          <div className="grid grid-cols-2 gap-0.5">
            <img src={post.after_image || post.before_image || fallbackImg} alt="" className="w-full aspect-square object-cover col-span-2" onError={() => setImageError(true)} />
            {post.gallery_images.slice(0, 2).map((img: string, i: number) => (
              <img key={i} src={img} alt="" className="w-full aspect-square object-cover" />
            ))}
          </div>
        ) : (
          <img
            src={post?.after_image || post?.before_image || fallbackImg}
            alt={post?.title || ''}
            className="w-full aspect-square sm:aspect-[4/3] object-cover"
            onError={() => setImageError(true)}
          />
        )}

        {/* Category badge */}
        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
          {post?.category || 'Genel'}
        </span>

        {/* Post type indicator */}
        {post?.post_type === 'before_after' && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-md bg-amber-500/90 text-white text-xs font-medium">
            Öncesi / Sonrası
          </span>
        )}
      </div>

      {/* Engagement Bar */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(post?.id)}
            className={`transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-gray-700 dark:text-gray-300 hover:text-red-500'}`}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => onOpenDetail(post)} className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition-colors">
            <MessageCircle size={24} />
          </button>
          <button onClick={handleShare} className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition-colors">
            <Send size={22} />
          </button>
        </div>
        <button
          onClick={() => onSave(post?.id)}
          className={`transition-colors ${isSaved ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300 hover:text-amber-500'}`}
        >
          <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Likes count */}
      <div className="px-3 py-1">
        <p className="text-sm font-semibold">{(post?.likes_count || 0) + (isLiked ? 1 : 0)} beğenme</p>
      </div>

      {/* Caption */}
      <div className="px-3 pb-2">
        <p className="text-sm">
          <span className="font-semibold">{usta?.name}</span>{' '}
          <span className="text-gray-700 dark:text-gray-300">{post?.caption || ''}</span>
        </p>
        {post?.comments_count > 0 && (
          <button onClick={() => onOpenDetail(post)} className="text-sm text-gray-500 mt-1 hover:text-gray-700">
            {post.comments_count} yorumun tümünü gör
          </button>
        )}
      </div>

      {/* Project Info */}
      <div className="px-3 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {post?.cost_min && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5">
              <DollarSign size={10} /> {post.cost_min.toLocaleString('tr-TR')} - {post.cost_max?.toLocaleString('tr-TR')} TL
            </span>
          )}
          {post?.duration_days && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5">
              <Clock size={10} /> {post.duration_days} gün
            </span>
          )}
          {post?.completion_date && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5">
              <MapPin size={10} /> {post.location}
            </span>
          )}
        </div>
        <div className="mt-2">
          <ReputationBadges usta={usta} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}
