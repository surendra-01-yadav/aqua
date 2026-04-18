import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Waves, Droplets, Search, MapPin } from 'lucide-react';
import './StateDetail.css';

export default function StateDetail() {
  const { id } = useParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('cities');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/states/${id}`)
      .then(r => r.json())
      .then(data => {
        setState(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading state data...</p>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="error-screen">
        <p>State not found.</p>
        <Link to="/">Go back</Link>
      </div>
    );
  }

  const filteredCities = state.cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.waterBodies.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLakes = state.lakes.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="state-detail">
      <div className="detail-hero" >
        <div className="detail-hero-inner">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> All States
          </Link>
          <div className="detail-title-row">
            <span className={`type-badge ${state.type}`}>
              {state.type === 'state' ? 'State' : 'Union Territory'}
            </span>
            <h1>{state.name}</h1>
          </div>
          <div className="detail-stats">
            <span><Building2 size={15} /> {state.cities.length} Cities</span>
            <span><Waves size={15} /> {state.rivers.length} Rivers</span>
            <span><Droplets size={15} /> {state.lakes.length} Lakes</span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="rivers-section">
          <h3><Waves size={16} /> Major Rivers</h3>
          <div className="river-tags">
            {state.rivers.map((r, i) => (
              <span key={i} className="river-chip">{r}</span>
            ))}
            {state.rivers.length === 0 && (
              <span className="no-data">No major rivers</span>
            )}
          </div>
        </div>

        <div className="tabs-section">
          <div className="tabs-header">
            <div className="tabs">
              <button
                className={`tab ${tab === 'cities' ? 'active' : ''}`}
                onClick={() => setTab('cities')}
              >
                <Building2 size={15} />
                Cities ({state.cities.length})
              </button>
              <button
                className={`tab ${tab === 'lakes' ? 'active' : ''}`}
                onClick={() => setTab('lakes')}
              >
                <Droplets size={15} />
                Lakes ({state.lakes.length})
              </button>
            </div>
            <div className="tab-search">
              <Search size={14} />
              <input
                type="text"
                placeholder={tab === 'cities' ? 'Search cities or rivers...' : 'Search lakes...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {tab === 'cities' && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>City</th>
                    <th>River(s) / Lake(s)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCities.map((city, i) => (
                    <tr key={i}>
                      <td className="row-num">{i + 1}</td>
                      <td className="city-name">
                        <MapPin size={13} />
                        {city.name}
                      </td>
                      <td className="water-bodies">{city.waterBodies}</td>
                    </tr>
                  ))}
                  {filteredCities.length === 0 && (
                    <tr>
                      <td colSpan={3} className="no-results">
                        No cities match "{search}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'lakes' && (
            <div className="table-wrapper">
              {state.lakes.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Lake / Reservoir</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLakes.map((lake, i) => (
                      <tr key={i}>
                        <td className="row-num">{i + 1}</td>
                        <td className="lake-name">
                          <Droplets size={13} />
                          {lake.name}
                        </td>
                        <td>{lake.location}</td>
                      </tr>
                    ))}
                    {filteredLakes.length === 0 && (
                      <tr>
                        <td colSpan={3} className="no-results">
                          No lakes match "{search}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <Droplets size={32} />
                  <p>No significant lakes or reservoirs documented for this region.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
