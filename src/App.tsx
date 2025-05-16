import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Decks } from './pages/Decks';
import { Review } from './pages/Review';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/review/:deckId?" element={<Review />} />
          <Route path="/dashboard" element={<div>Dashboard - Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
