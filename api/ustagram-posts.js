import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category, search, sort, usta_id, post_type, limit = '20', offset = '0' } = req.query;
      let query = supabase.from('usta_posts').select('*, ustas(name, avatar, rating, completed_jobs, location, specialties, identity_verified, phone_verified, certified, premium)');
      if (category) query = query.eq('category', category);
      if (usta_id) query = query.eq('usta_id', usta_id);
      if (post_type) query = query.eq('post_type', post_type);
      if (search) query = query.ilike('title', `%${search}%`);
      if (sort === 'popular') query = query.order('likes_count', { ascending: false });
      else if (sort === 'rated') query = query.order('created_at', { ascending: false });
      else query = query.order('created_at', { ascending: false });
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase.from('usta_posts').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
