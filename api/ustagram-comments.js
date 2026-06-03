import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { post_id } = req.query;
      let query = supabase.from('post_comments').select('*').order('created_at', { ascending: true });
      if (post_id) query = query.eq('post_id', post_id);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { post_id, user_id, user_name, content } = req.body;
      const { data, error } = await supabase.from('post_comments').insert({ post_id, user_id, user_name, content }).select().single();
      if (error) throw error;
      const { data: post } = await supabase.from('usta_posts').select('comments_count').eq('id', post_id).single();
      await supabase.from('usta_posts').update({ comments_count: (post?.comments_count || 0) + 1 }).eq('id', post_id);
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
