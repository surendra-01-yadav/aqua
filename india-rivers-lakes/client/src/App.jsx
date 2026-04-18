import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StateDetail from './pages/StateDetail';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/state/:id" element={<StateDetail />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <p>India Cities, Rivers & Lakes Explorer</p>
            <p className="footer-sub">Covering all 28 States & 8 Union Territories</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
