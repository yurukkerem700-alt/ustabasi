import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category, search, status, lat, lng } = req.query;
      let query = supabase.from('ustas').select('*');
      if (category) query = query.contains('specialties', [category]);
      if (status) query = query.eq('status', status);
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query.order('rating', { ascending: false });
      if (error) throw error;
      let result = data || [];
      if (lat && lng) {
        const ulat = parseFloat(lat);
        const ulng = parseFloat(lng);
        result = result.map(u => {
          const dlat = (u.lat || ulat) - ulat;
          const dlng = (u.lng || ulng) - ulng;
          const dist = Math.sqrt(dlat*dlat + dlng*dlng) * 111;
          return { ...u, distance_km: parseFloat(dist.toFixed(1)) };
        }).sort((a,b) => a.distance_km - b.distance_km);
      }
      return res.status(200).json(result);
    }
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase.from('ustas').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
