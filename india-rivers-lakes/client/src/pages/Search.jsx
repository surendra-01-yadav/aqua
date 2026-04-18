import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Building2, Droplets, ArrowRight } from 'lucide-react';
import './Search.css';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, [searchParams]);

  const doSearch = (q) => {
    if (!q.trim()) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      .then(r => r.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const totalResults = results
    ? results.states.length + results.cities.length + results.lakes.length
    : 0;

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="search-hero-inner">
          <h1>Search</h1>
          <form className="search-form" onSubmit={handleSubmit}>
            <SearchIcon size={18} className="search-form-icon" />
            <input
              type="text"
              placeholder="Search for any city, river, lake, or state..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>

      <div className="search-content">
        {loading && (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {results && !loading && (
          <>
            <p className="results-count">
              Found <strong>{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for "<strong>{searchParams.get('q')}</strong>"
            </p>

            {results.states.length > 0 && (
              <div className="result-section">
                <h3><MapPin size={16} /> States & Union Territories ({results.states.length})</h3>
                <div className="result-list">
                  {results.states.map((s, i) => (
                    <Link key={i} to={`/state/${s.id}`} className="result-item state-result">
                      <div>
                        <span className="result-name">{s.name}</span>
                        <span className={`result-type ${s.type}`}>
                          {s.type === 'state' ? 'State' : 'UT'}
                        </span>
                        {s.matchedRiver && (
                          <span className="result-match">River: {s.matchedRiver}</span>
                        )}
                      </div>
                      <ArrowRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.cities.length > 0 && (
              <div className="result-section">
                <h3><Building2 size={16} /> Cities ({results.cities.length})</h3>
                <div className="result-list">
                  {results.cities.map((c, i) => (
                    <Link key={i} to={`/state/${c.stateId}`} className="result-item city-result">
                      <div>
                        <span className="result-name">{c.cityName}</span>
                        <span className="result-state">{c.stateName}</span>
                        <span className="result-detail">{c.waterBodies}</span>
                      </div>
                      <ArrowRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.lakes.length > 0 && (
              <div className="result-section">
                <h3><Droplets size={16} /> Lakes & Reservoirs ({results.lakes.length})</h3>
                <div className="result-list">
                  {results.lakes.map((l, i) => (
                    <Link key={i} to={`/state/${l.stateId}`} className="result-item lake-result">
                      <div>
                        <span className="result-name">{l.lakeName}</span>
                        <span className="result-state">{l.stateName}</span>
                        <span className="result-detail">{l.location}</span>
                      </div>
                      <ArrowRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="empty-search">
                <SearchIcon size={40} />
                <p>No results found for "{searchParams.get('q')}"</p>
                <p className="empty-hint">Try searching for a city name, river, lake, or state</p>
              </div>
            )}
          </>
        )}

        {!results && !loading && (
          <div className="empty-search">
            <SearchIcon size={40} />
            <p>Search across 993 cities, 300+ lakes, and all rivers of India</p>
            <div className="search-suggestions">
              <span>Try:</span>
              {['Ganga', 'Dal Lake', 'Chennai', 'Kerala', 'Brahmaputra'].map(s => (
                <button
                  key={s}
                  className="suggestion"
                  onClick={() => {
                    setQuery(s);
                    setSearchParams({ q: s });
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
