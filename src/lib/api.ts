// API 4xx/5xx döndüğünde gövde bir hata nesnesidir ({ error }), dizi değil.
// Sayfaların .filter/.map ile çökmemesi için liste uç noktalarında bunu kullanın.
export async function fetchList<T = any>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
