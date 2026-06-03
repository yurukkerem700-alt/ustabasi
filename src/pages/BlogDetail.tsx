import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, User, Tag } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog?slug=${slug}`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-24 pb-20 text-center">
        <p className="text-gray-500">Yazı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 mb-6">
            <ArrowLeft size={16} /> Blog'a Dön
          </Link>

          <div className="rounded-2xl overflow-hidden mb-8">
            <img
              src={post.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1"><Tag size={14} /> {post.category}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 5 dk okuma</span>
            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-6">{post.title}</h1>

          <div className="prose dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph: string, i: number) => (
              <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
