import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, SlidersHorizontal, TrendingUp, Clock, Star, MapPin,
  Shield, Filter, Layers, Image, Grid3X3, MessageSquare,
  Heart, Bookmark, Plus, Compass, Play
} from 'lucide-react';
import PostCard from '../components/PostCard';
import PostDetailModal from '../components/PostDetailModal';
import StoryBar from '../components/StoryBar';
import CompanyAdPanel from '../components/CompanyAdPanel';
import AdminModerationPanel from '../components/AdminModerationPanel';

const categories = [
  'Tümü', 'Elektrik', 'Su Tesisatı', 'Boya', 'Temizlik', 'Nakliyat',
  'Klima', 'Mobilya', 'Çatı', 'İnşaat', 'Bahçe', 'Cam Balkon',
  'Fayans', 'Parke', 'Alçıpan', 'Kombi'
];

const sortOptions = [
  { value: 'newest', label: 'En Yeni', icon: Clock },
  { value: 'popular', label: 'En Popüler', icon: TrendingUp },
  { value: 'rated', label: 'En Yüksek Puan', icon: Star },
];

const postTypeFilters = [
  { value: 'all', label: 'Tümü', icon: Layers },
  { value: 'before_after', label: 'Öncesi/Sonrası', icon: Image },
  { value: 'project_gallery', label: 'Proje', icon: Grid3X3 },
  { value: 'testimonial', label: 'Yorum', icon: MessageSquare },
];

export default function Ustagram() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedType, setSelectedType] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [followingUstas, setFollowingUstas] = useState<Set<number>>(new Set());
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'explore'>('feed');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (reset = false) => {
    const currentOffset = reset ? 0 : offset;
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'Tümü') params.set('category', selectedCategory);
      if (selectedType !== 'all') params.set('post_type', selectedType);
      if (search) params.set('search', search);
      params.set('sort', selectedSort);
      params.set('limit', '12');
      params.set('offset', String(currentOffset));

      const res = await fetch(`/api/ustagram-posts?${params.toString()}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];

      if (reset) {
        setPosts(arr);
        setOffset(12);
      } else {
        setPosts(prev => [...prev, ...arr]);
        setOffset(currentOffset + 12);
      }
      setHasMore(arr.length === 12);
    } catch (err) {
      console.error(err);
      if (reset) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
    fetchFollowing();
  }, [selectedCategory, selectedSort, selectedType]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        fetchPosts(false);
      }
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, offset]);

  const fetchFollowing = async () => {
    try {
      const res = await fetch('/api/ustagram-followers?follower_id=demo-user');
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setFollowingUstas(new Set(arr.map((f: any) => f.following_id)));
    } catch {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(true);
  };

  const handleLike = async (postId: number) => {
    const isLiked = likedPosts.has(postId);
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (isLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });
    try {
      await fetch('/api/ustagram-likes', {
        method: isLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, user_id: 'demo-user' })
      });
    } catch {}
  };

  const handleSave = async (postId: number) => {
    const isSaved = savedPosts.has(postId);
    setSavedPosts(prev => {
      const next = new Set(prev);
      if (isSaved) next.delete(postId);
      else next.add(postId);
      return next;
    });
    try {
      await fetch('/api/ustagram-saves', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, user_id: 'demo-user' })
      });
    } catch {}
  };

  const handleFollow = async (ustaId: number) => {
    const isFollowing = followingUstas.has(ustaId);
    setFollowingUstas(prev => {
      const next = new Set(prev);
      if (isFollowing) next.delete(ustaId);
      else next.add(ustaId);
      return next;
    });
    try {
      await fetch('/api/ustagram-followers', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: 'demo-user', following_id: ustaId })
      });
    } catch {}
  };

  const filteredPosts = verifiedOnly
    ? posts.filter(p => p?.ustas?.identity_verified)
    : posts;

  return (
    <div className="pt-16 pb-20 min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <h1 className="text-xl font-bold gradient-text">Ustagram</h1>
            <div className="flex items-center gap-2">
              <CompanyAdPanel />
              <AdminModerationPanel />
              <Link to="/ustagram" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                <Heart size={22} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Story Bar */}
      <StoryBar onSelectUsta={(id) => console.log('Selected usta:', id)} />

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex border-b border-gray-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'feed' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-500'
            }`}
          >
            <Layers size={16} /> Akış
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'explore' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-500'
            }`}
          >
            <Compass size={16} /> Keşfet
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Usta, kategori veya proje ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-amber-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Sıralama</p>
              <div className="flex gap-2">
                {sortOptions.map(opt => (
                  <button key={opt.value} onClick={() => setSelectedSort(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSort === opt.value ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                    <opt.icon size={12} /> {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Gönderi Türü</p>
              <div className="flex gap-2 flex-wrap">
                {postTypeFilters.map(opt => (
                  <button key={opt.value} onClick={() => setSelectedType(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === opt.value ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                    <opt.icon size={12} /> {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${verifiedOnly ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                <Shield size={12} /> Sadece Doğrulanmış
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Feed */}
      <div className="max-w-lg mx-auto px-0 sm:px-4">
        {loading && posts.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden animate-pulse">
                <div className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-2 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
                <div className="aspect-square bg-gray-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold mb-1">Sonuç Bulunamadı</h3>
            <p className="text-sm text-gray-500">Farklı bir arama terimi veya filtre deneyin.</p>
          </div>
        ) : (
          <>
            {filteredPosts.map(post => (
              <PostCard
                key={post?.id || Math.random()}
                post={post}
                onOpenDetail={setSelectedPost}
                onLike={handleLike}
                onSave={handleSave}
                onFollow={handleFollow}
                likedPosts={likedPosts}
                savedPosts={savedPosts}
                followingUstas={followingUstas}
              />
            ))}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {loadingMore && <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" />}
            </div>
          </>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}
