import { Link } from 'react-router-dom';
import { MapPin, Droplets, Waves, Building2 } from 'lucide-react';
import './StateCard.css';

export default function StateCard({ state }) {
  return (
    <Link to={`/state/${state.id}`} className="state-card">
      <div className="state-card-header">
        <span className={`state-badge ${state.type}`}>
          {state.type === 'state' ? 'State' : 'UT'}
        </span>
        <h3 className="state-name">{state.name}</h3>
      </div>
      <div className="state-stats">
        <div className="stat">
          <Building2 size={14} />
          <span>{state.cityCount} Cities</span>
        </div>
        <div className="stat">
          <Waves size={14} />
          <span>{state.riverCount} Rivers</span>
        </div>
        <div className="stat">
          <Droplets size={14} />
          <span>{state.lakeCount} Lakes</span>
        </div>
      </div>
      <div className="state-rivers-preview">
        {state.rivers.slice(0, 4).map((r, i) => (
          <span key={i} className="river-tag">{r}</span>
        ))}
        {state.rivers.length > 4 && (
          <span className="river-tag more">+{state.rivers.length - 4}</span>
        )}
      </div>
    </Link>
  );
}
