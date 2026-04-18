import { useState, useEffect } from 'react';
import { Building2, Waves, Droplets, MapPin, Filter } from 'lucide-react';
import StateCard from '../components/StateCard';
import './Home.css';

export default function Home() {
  const [states, setStates] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/states').then(r => r.json()),
      fetch('/api/stats').then(r => r.json())
    ]).then(([statesData, statsData]) => {
      setStates(statesData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  const filtered = states.filter(s => {
    if (filter === 'states') return s.type === 'state';
    if (filter === 'uts') return s.type === 'ut';
    return true;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading India's waterways...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Explore India's <span className="highlight">Rivers & Lakes</span>
          </h1>
          <p className="hero-subtitle">
            A comprehensive guide to cities, rivers, and lakes across all Indian states and union territories
          </p>
          {stats && (
            <div className="stats-bar">
              <div className="stat-item">
                <MapPin size={18} />
                <div>
                  <span className="stat-number">{stats.totalStates + stats.totalUTs}</span>
                  <span className="stat-label">States & UTs</span>
                </div>
              </div>
              <div className="stat-item">
                <Building2 size={18} />
                <div>
                  <span className="stat-number">{stats.totalCities}</span>
                  <span className="stat-label">Cities</span>
                </div>
              </div>
              <div className="stat-item">
                <Waves size={18} />
                <div>
                  <span className="stat-number">{stats.totalRivers}</span>
                  <span className="stat-label">Rivers</span>
                </div>
              </div>
              <div className="stat-item">
                <Droplets size={18} />
                <div>
                  <span className="stat-number">{stats.totalLakes}</span>
                  <span className="stat-label">Lakes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>All States & Union Territories</h2>
          <div className="filter-bar">
            <Filter size={16} />
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({states.length})
            </button>
            <button
              className={`filter-btn ${filter === 'states' ? 'active' : ''}`}
              onClick={() => setFilter('states')}
            >
              States ({states.filter(s => s.type === 'state').length})
            </button>
            <button
              className={`filter-btn ${filter === 'uts' ? 'active' : ''}`}
              onClick={() => setFilter('uts')}
            >
              UTs ({states.filter(s => s.type === 'ut').length})
            </button>
          </div>
        </div>

        <div className="states-grid">
          {filtered.map(state => (
            <StateCard key={state.id} state={state} />
          ))}
        </div>
      </section>
    </div>
  );
}
