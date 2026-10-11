import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Ortam değişkenleri eksikse uygulama çökmesin (beyaz ekran yerine arayüz açılır, istekler hata döner)
export const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseKey || 'missing-anon-key');

export default supabase;
