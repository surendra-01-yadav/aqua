const express = require('express');
const cors = require('cors');
const path = require('path');
const data = require('./data.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static React build in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// GET all states/UTs (summary - without cities/lakes for listing)
app.get('/api/states', (req, res) => {
  const summary = data.map(({ id, name, type, rivers, cities, lakes }) => ({
    id,
    name,
    type,
    riverCount: rivers.length,
    cityCount: cities.length,
    lakeCount: lakes.length,
    rivers
  }));
  res.json(summary);
});

// GET single state/UT by id (full detail)
app.get('/api/states/:id', (req, res) => {
  const state = data.find(s => s.id === parseInt(req.params.id));
  if (!state) return res.status(404).json({ error: 'State not found' });
  res.json(state);
});

// Search across all data
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json({ states: [], cities: [], lakes: [] });

  const states = [];
  const cities = [];
  const lakes = [];

  data.forEach(state => {
    // Match state name
    if (state.name.toLowerCase().includes(q)) {
      states.push({ id: state.id, name: state.name, type: state.type });
    }
    // Match cities
    state.cities.forEach(city => {
      if (city.name.toLowerCase().includes(q) || city.waterBodies.toLowerCase().includes(q)) {
        cities.push({
          cityName: city.name,
          waterBodies: city.waterBodies,
          stateId: state.id,
          stateName: state.name
        });
      }
    });
    // Match lakes
    state.lakes.forEach(lake => {
      if (lake.name.toLowerCase().includes(q) || lake.location.toLowerCase().includes(q)) {
        lakes.push({
          lakeName: lake.name,
          location: lake.location,
          stateId: state.id,
          stateName: state.name
        });
      }
    });
    // Match rivers
    state.rivers.forEach(river => {
      if (river.toLowerCase().includes(q)) {
        const alreadyAdded = states.find(s => s.id === state.id);
        if (!alreadyAdded) {
          states.push({ id: state.id, name: state.name, type: state.type, matchedRiver: river });
        }
      }
    });
  });

  res.json({ states, cities, lakes });
});

// Stats
app.get('/api/stats', (req, res) => {
  const totalStates = data.filter(s => s.type === 'state').length;
  const totalUTs = data.filter(s => s.type === 'ut').length;
  const totalCities = data.reduce((sum, s) => sum + s.cities.length, 0);
  const totalLakes = data.reduce((sum, s) => sum + s.lakes.length, 0);
  const totalRivers = new Set(data.flatMap(s => s.rivers)).size;

  res.json({ totalStates, totalUTs, totalCities, totalLakes, totalRivers });
});

// Fallback to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
