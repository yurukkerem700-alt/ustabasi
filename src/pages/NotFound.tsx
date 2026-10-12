import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="pt-24 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center px-4">
      <p className="text-7xl font-extrabold gradient-text mb-2">404</p>
      <h1 className="text-2xl font-bold mb-2">Sayfa bulunamadı</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg transition-all">
        Ana sayfaya dön
      </Link>
    </div>
  );
}
