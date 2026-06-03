import { createClient } from '@supabase/supabase-js';

const PROJECT_REF = process.env.FULLSTACK_PROJECT_REF || '';
const RESTORE_URL = process.env.FULLSTACK_RESTORE_API_URL || '';
let _restoreTriggered = false;
function triggerRestore() {
  if (_restoreTriggered || !PROJECT_REF || !RESTORE_URL) return;
  _restoreTriggered = true;
  fetch(RESTORE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_ref: PROJECT_REF }),
  }).catch(() => {});
  setTimeout(() => { _restoreTriggered = false; }, 60000);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    global: {
      fetch: async (url, options) => {
        const res = await fetch(url, options);
        if (!res.ok && res.status >= 500) triggerRestore();
        return res;
      },
    },
  }
);

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const ok = (res, data, status = 200) => res.status(status).json(data);
const err = (res, message, status = 500) => res.status(status).json({ error: message });

// ===== USTAS + CATEGORIES + REVIEWS =====
async function handleUstas(req, res) {
  try {
    if (req.method === 'GET') {
      const { category, search, status, lat, lng, id } = req.query;
      if (id) {
        const { data, error } = await supabase.from('ustas').select('*').eq('id', id).single();
        if (error) throw error;
        return ok(res, data);
      }
      let query = supabase.from('ustas').select('*');
      if (category) query = query.contains('specialties', [category]);
      if (status) query = query.eq('status', status);
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query.order('rating', { ascending: false });
      if (error) throw error;
      let result = data || [];
      if (lat && lng) {
        const ulat = parseFloat(lat), ulng = parseFloat(lng);
        result = result.map(u => {
          const dlat = (u.lat || ulat) - ulat;
          const dlng = (u.lng || ulng) - ulng;
          const dist = Math.sqrt(dlat * dlat + dlng * dlng) * 111;
          return { ...u, distance_km: parseFloat(dist.toFixed(1)) };
        }).sort((a, b) => a.distance_km - b.distance_km);
      }
      return ok(res, result);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('ustas').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleCategories(req, res) {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
    if (error) throw error;
    return ok(res, data);
  } catch (e) { return err(res, e.message); }
}

async function handleReviews(req, res) {
  try {
    if (req.method === 'GET') {
      const { usta_id } = req.query;
      let query = supabase.from('reviews').select('*');
      if (usta_id) query = query.eq('usta_id', usta_id);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { usta_id, user_id, rating, comment } = req.body;
      const { data, error } = await supabase.from('reviews').insert({ usta_id, user_id, rating, comment }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

// ===== JOBS + OFFERS + MESSAGES =====
async function handleJobs(req, res) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('jobs').select('*, categories(name)').order('created_at', { ascending: false });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { category_id, title, description, location, budget, user_id, images } = req.body;
      const { data, error } = await supabase.from('jobs').insert({ category_id, title, description, location, budget, user_id, images }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data, error } = await supabase.from('jobs').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleOffers(req, res) {
  try {
    if (req.method === 'GET') {
      const { job_id } = req.query;
      let query = supabase.from('offers').select('*, ustas(*)');
      if (job_id) query = query.eq('job_id', job_id);
      const { data, error } = await query.order('price', { ascending: true });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { job_id, usta_id, price, message, estimated_days } = req.body;
      const { data, error } = await supabase.from('offers').insert({ job_id, usta_id, price, message, estimated_days }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data, error } = await supabase.from('offers').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleMessages(req, res) {
  try {
    if (req.method === 'GET') {
      const { job_id } = req.query;
      let query = supabase.from('messages').select('*');
      if (job_id) query = query.eq('job_id', job_id);
      const { data, error } = await query.order('created_at', { ascending: true });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { sender_id, receiver_id, job_id, content } = req.body;
      const { data, error } = await supabase.from('messages').insert({ sender_id, receiver_id, job_id, content }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

// ===== USTAGRAM: POSTS + LIKES + COMMENTS + SAVES + FOLLOWERS =====
async function handleUstagramPosts(req, res) {
  try {
    if (req.method === 'GET') {
      const { category, search, sort, usta_id, post_type, limit = '20', offset = '0' } = req.query;
      let query = supabase.from('usta_posts').select('*, ustas(name, avatar, rating, completed_jobs, location, specialties, identity_verified, phone_verified, certified, premium)');
      if (category) query = query.eq('category', category);
      if (usta_id) query = query.eq('usta_id', usta_id);
      if (post_type) query = query.eq('post_type', post_type);
      if (search) query = query.ilike('title', `%${search}%`);
      if (sort === 'popular') query = query.order('likes_count', { ascending: false });
      else query = query.order('created_at', { ascending: false });
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('usta_posts').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleUstagramLikes(req, res) {
  try {
    if (req.method === 'GET') {
      const { post_id, user_id } = req.query;
      let query = supabase.from('post_likes').select('*');
      if (post_id) query = query.eq('post_id', post_id);
      if (user_id) query = query.eq('user_id', user_id);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { post_id, user_id } = req.body;
      const { data, error } = await supabase.from('post_likes').insert({ post_id, user_id }).select().single();
      if (error) throw error;
      const { data: post } = await supabase.from('usta_posts').select('likes_count').eq('id', post_id).single();
      await supabase.from('usta_posts').update({ likes_count: (post?.likes_count || 0) + 1 }).eq('id', post_id);
      return ok(res, data, 201);
    }
    if (req.method === 'DELETE') {
      const { post_id, user_id } = req.body;
      await supabase.from('post_likes').delete().eq('post_id', post_id).eq('user_id', user_id);
      const { data: post } = await supabase.from('usta_posts').select('likes_count').eq('id', post_id).single();
      if (post && post.likes_count > 0) await supabase.from('usta_posts').update({ likes_count: post.likes_count - 1 }).eq('id', post_id);
      return ok(res, { ok: true });
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleUstagramComments(req, res) {
  try {
    if (req.method === 'GET') {
      const { post_id } = req.query;
      let query = supabase.from('post_comments').select('*').order('created_at', { ascending: true });
      if (post_id) query = query.eq('post_id', post_id);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { post_id, user_id, user_name, content } = req.body;
      const { data, error } = await supabase.from('post_comments').insert({ post_id, user_id, user_name, content }).select().single();
      if (error) throw error;
      const { data: post } = await supabase.from('usta_posts').select('comments_count').eq('id', post_id).single();
      await supabase.from('usta_posts').update({ comments_count: (post?.comments_count || 0) + 1 }).eq('id', post_id);
      return ok(res, data, 201);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleUstagramSaves(req, res) {
  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      let query = supabase.from('saved_posts').select('*, usta_posts(*)');
      if (user_id) query = query.eq('user_id', user_id);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { post_id, user_id } = req.body;
      const { data, error } = await supabase.from('saved_posts').insert({ post_id, user_id }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'DELETE') {
      const { post_id, user_id } = req.body;
      await supabase.from('saved_posts').delete().eq('post_id', post_id).eq('user_id', user_id);
      return ok(res, { ok: true });
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleFollowers(req, res) {
  try {
    if (req.method === 'GET') {
      const { following_id, follower_id } = req.query;
      let query = supabase.from('followers').select('*');
      if (following_id) query = query.eq('following_id', following_id);
      if (follower_id) query = query.eq('follower_id', follower_id);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { follower_id, following_id } = req.body;
      const { data, error } = await supabase.from('followers').insert({ follower_id, following_id }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'DELETE') {
      const { follower_id, following_id } = req.body;
      await supabase.from('followers').delete().eq('follower_id', follower_id).eq('following_id', following_id);
      return ok(res, { ok: true });
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

// ===== COMPANIES + EMPLOYEES + COMPANY JOBS =====
async function handleCompanies(req, res) {
  try {
    if (req.method === 'GET') {
      const { id, search } = req.query;
      let query = supabase.from('companies').select('*');
      if (id) query = query.eq('id', id).single();
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query.order('name', { ascending: true });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('companies').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleCompanyEmployees(req, res) {
  try {
    if (req.method === 'GET') {
      const { company_id, usta_id } = req.query;
      let query = supabase.from('company_employees').select('*, ustas(*), companies(*)');
      if (company_id) query = query.eq('company_id', company_id);
      if (usta_id) query = query.eq('usta_id', usta_id);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('company_employees').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data, error } = await supabase.from('company_employees').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleCompanyJobs(req, res) {
  try {
    if (req.method === 'GET') {
      const { company_id, usta_id, status } = req.query;
      let query = supabase.from('company_jobs').select('*, ustas(name, avatar, rating), companies(name)');
      if (company_id) query = query.eq('company_id', company_id);
      if (usta_id) query = query.eq('usta_id', usta_id);
      if (status) query = query.eq('status', status);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('company_jobs').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id, status, usta_id } = req.body;
      const update = {};
      if (status) update.status = status;
      if (usta_id !== undefined) update.usta_id = usta_id;
      const { data, error } = await supabase.from('company_jobs').update(update).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

// ===== CHAT =====
async function handleChatRooms(req, res) {
  try {
    const { data, error } = await supabase.from('chat_rooms').select('*').order('member_count', { ascending: false });
    if (error) throw error;
    return ok(res, data);
  } catch (e) { return err(res, e.message); }
}

async function handleChatMessages(req, res) {
  try {
    if (req.method === 'GET') {
      const { room_id } = req.query;
      let query = supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
      if (room_id) query = query.eq('room_id', room_id);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { room_id, user_id, user_name, content } = req.body;
      const { data, error } = await supabase.from('chat_messages').insert({ room_id, user_id, user_name, content }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

// ===== SYSTEM: EMERGENCY + TRACKING + NOTIFICATIONS + REPORTS + FEATURED =====
async function handleEmergency(req, res) {
  try {
    if (req.method === 'GET') {
      const { status, user_id } = req.query;
      let query = supabase.from('emergency_requests').select('*, ustas(name, avatar, phone, rating, lat, lng)');
      if (status) query = query.eq('status', status);
      if (user_id) query = query.eq('user_id', user_id);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('emergency_requests').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id, status, assigned_usta_id } = req.body;
      const update = {};
      if (status) update.status = status;
      if (assigned_usta_id) update.assigned_usta_id = assigned_usta_id;
      const { data, error } = await supabase.from('emergency_requests').update(update).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleTracking(req, res) {
  try {
    if (req.method === 'GET') {
      const { usta_id, job_id } = req.query;
      let query = supabase.from('tracking').select('*, ustas(name, avatar, phone)');
      if (usta_id) query = query.eq('usta_id', usta_id);
      if (job_id) query = query.eq('job_id', job_id);
      const { data, error } = await query.order('updated_at', { ascending: false });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('tracking').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id, lat, lng, eta_minutes, distance_km, status } = req.body;
      const { data, error } = await supabase.from('tracking').update({ lat, lng, eta_minutes, distance_km, status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleNotifications(req, res) {
  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (user_id) query = query.eq('user_id', user_id);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('notifications').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id } = req.body;
      const { data, error } = await supabase.from('notifications').update({ read: true }).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await supabase.from('notifications').delete().eq('id', id);
      return ok(res, { ok: true });
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleReports(req, res) {
  try {
    if (req.method === 'GET') {
      const { status } = req.query;
      let query = supabase.from('reports').select('*, usta_posts(title), ustas(name)');
      if (status) query = query.eq('status', status);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { post_id, reporter_id, reason } = req.body;
      const { data, error } = await supabase.from('reports').insert({ post_id, reporter_id, reason }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data, error } = await supabase.from('reports').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handleFeaturedPosts(req, res) {
  try {
    if (req.method === 'GET') {
      const { company_id } = req.query;
      let query = supabase.from('featured_posts').select('*, usta_posts(*), companies(name)').order('created_at', { ascending: false });
      if (company_id) query = query.eq('company_id', company_id);
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('featured_posts').insert(req.body).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    if (req.method === 'PUT') {
      const { id, impressions, clicks } = req.body;
      const update = {};
      if (impressions) update.impressions = impressions;
      if (clicks) update.clicks = clicks;
      const { data, error } = await supabase.from('featured_posts').update(update).eq('id', id).select().single();
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

// ===== CONTENT: BLOG + POSTS =====
async function handleBlog(req, res) {
  try {
    if (req.method === 'GET') {
      const { slug } = req.query;
      let query = supabase.from('blog_posts').select('*');
      if (slug) query = query.eq('slug', slug).single();
      else query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return ok(res, data);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

async function handlePosts(req, res) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('posts').select('*, ustas(name, avatar)').order('created_at', { ascending: false });
      if (error) throw error;
      return ok(res, data);
    }
    if (req.method === 'POST') {
      const { usta_id, before_image, after_image, caption } = req.body;
      const { data, error } = await supabase.from('posts').insert({ usta_id, before_image, after_image, caption }).select().single();
      if (error) throw error;
      return ok(res, data, 201);
    }
    return err(res, 'Method not allowed', 405);
  } catch (e) { return err(res, e.message); }
}

// ===== ROUTER =====
const ROUTES = {
  'ustas': handleUstas,
  'categories': handleCategories,
  'reviews': handleReviews,
  'jobs': handleJobs,
  'offers': handleOffers,
  'messages': handleMessages,
  'ustagram-posts': handleUstagramPosts,
  'ustagram-likes': handleUstagramLikes,
  'ustagram-comments': handleUstagramComments,
  'ustagram-saves': handleUstagramSaves,
  'ustagram-followers': handleFollowers,
  'followers': handleFollowers,
  'companies': handleCompanies,
  'company-employees': handleCompanyEmployees,
  'company-jobs': handleCompanyJobs,
  'chat-rooms': handleChatRooms,
  'chat-messages': handleChatMessages,
  'emergency': handleEmergency,
  'tracking': handleTracking,
  'notifications': handleNotifications,
  'reports': handleReports,
  'featured-posts': handleFeaturedPosts,
  'blog': handleBlog,
  'posts': handlePosts,
};

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const pathSegments = req.query.path || [];
    const route = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
    const handlerFn = ROUTES[route];

    if (!handlerFn) {
      return err(res, `Route not found: /api/${route}`, 404);
    }

    return await handlerFn(req, res);
  } catch (e) {
    console.error('API error:', e);
    return err(res, e.message);
  }
}
