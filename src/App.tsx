import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Ustalar from './pages/Ustalar';
import UstaDetail from './pages/UstaDetail';
import JobRequest from './pages/JobRequest';
import Offers from './pages/Offers';
import Chat from './pages/Chat';
import Ustagram from './pages/Ustagram';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Subscriptions from './pages/Subscriptions';
import Companies from './pages/Companies';
import WorldMap from './pages/WorldMap';
import Notifications from './pages/Notifications';
import Emergency from './pages/Emergency';
import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';
import Tracking from './pages/Tracking';
import KVKK from './pages/KVKK';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ustalar" element={<Ustalar />} />
          <Route path="/usta/:id" element={<UstaDetail />} />
          <Route path="/firmalar" element={<Companies />} />
          <Route path="/harita" element={<WorldMap />} />
          <Route path="/is-talebi" element={<JobRequest />} />
          <Route path="/teklifler/:jobId?" element={<Offers />} />
          <Route path="/mesajlar/:jobId?" element={<Chat />} />
          <Route path="/ustagram" element={<Ustagram />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/giris" element={<Auth />} />
          <Route path="/abonelik" element={<Subscriptions />} />
          <Route path="/bildirimler" element={<Notifications />} />
          <Route path="/acil-durum" element={<Emergency />} />
          <Route path="/sohbet" element={<ChatRooms />} />
          <Route path="/sohbet/:roomId" element={<ChatRoom />} />
          <Route path="/takip" element={<Tracking />} />
          <Route path="/kvkk" element={<KVKK />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
