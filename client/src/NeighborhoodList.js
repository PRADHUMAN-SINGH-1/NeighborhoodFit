import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NeighborhoodList.css';

function NeighborhoodList() {

  const [neighborhoods, setNeighborhoods] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [minSafety, setMinSafety] = useState(0);
  const [maxRent, setMaxRent] = useState(100000);

  useEffect(() => {
    axios.get('http://localhost:5050/api/neighborhoods')
      .then(response => setNeighborhoods(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const filteredNeighborhoods = neighborhoods
    .filter(n => {

      const rent = parseInt(n.avg_rent) || 0;
      const safety = parseFloat(n.safety_score) || 0;

      return (
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        rent <= maxRent &&
        safety >= minSafety
      );

    })
    .sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  const topNeighborhoods = [...filteredNeighborhoods].slice(0, 5);

  return (
    <div className="neighborhood-container">

      <h1 className="heading">🏘️ Bengaluru Neighborhoods</h1>

      {/* Filters */}
      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Safety Score"
          value={minSafety}
          onChange={e => setMinSafety(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Rent"
          value={maxRent}
          onChange={e => setMaxRent(e.target.value)}
        />

      </div>


      {/* Top neighborhoods */}
      <div className="top-section">

        <h2 className="top-heading">🏆 Top Neighborhoods</h2>

        <div className="top-list">

          {topNeighborhoods.map((n, i) => (

            <div key={i} className="top-item">

              <span className="rank">{i + 1}️⃣</span>
              <span className="area-name">{n.name}</span>
              <span className="area-score">⭐ {n.match_score}</span>

            </div>

          ))}

        </div>

      </div>


      {/* Cards */}
      <div className="card-grid">

        {filteredNeighborhoods.map((n, i) => (

          <div key={i} className="card">

            {n.match_score > 70 && (
              <span className="top-area-badge">🏆 Top Area</span>
            )}

            <h2>{n.name}</h2>

            <p className="match-score">
              ⭐ Match Score: {n.match_score || 'N/A'}
            </p>

            <p><strong>Ward:</strong> {n.ward || 'N/A'}</p>
            <p><strong>Safety Score:</strong> {n.safety_score || 'N/A'}</p>
            <p><strong>Avg. Rent:</strong> ₹{n.avg_rent || 'N/A'}</p>
            <p><strong>Metro Nearby:</strong> {n.metro_nearby_km || 'N/A'} km</p>
            <p><strong>Schools:</strong> {n.schools_nearby || 'N/A'}</p>
            <p><strong>Parks:</strong> {n.parks_nearby || 'N/A'}</p>
            <p><strong>Population:</strong> {n.population || 'N/A'}</p>

            <div className="tags">

              {parseFloat(n.safety_score) > 7 &&
                <span className="badge safe">Safe</span>
              }

              {parseFloat(n.metro_nearby_km) < 2 &&
                <span className="badge metro">Metro Nearby</span>
              }

              {parseInt(n.avg_rent) > 50000 &&
                <span className="badge rent">High Rent</span>
              }

            </div>


            <div className="lifestyle-tags">

              {n.lifestyle_tags && n.lifestyle_tags.map((tag, idx) => {

                let className = 'lifestyle-badge';

                if (tag.includes('Family')) className += ' family';
                else if (tag.includes('Professionals')) className += ' professionals';
                else if (tag.includes('Quiet')) className += ' quiet';
                else if (tag.includes('Walkable')) className += ' walkable';

                return (
                  <span key={idx} className={className}>
                    {tag}
                  </span>
                );

              })}

            </div>


            {n.lat && n.lon && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${n.lat},${n.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                View on Map
              </a>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default NeighborhoodList;
