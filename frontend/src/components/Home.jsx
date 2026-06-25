import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/locations')
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error('Error fetching map landmarks:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#d4af37', textShadow: '2px 2px 4px #000' }}>
          ⚔️ Adventurer's Bounty Board ⚔️
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa' }}>
          Select a landmark on the realm map to view local quest listings.
        </p>
      </header>

      {/* Required Visual Interface Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {locations.map((loc) => (
          <Link key={loc.id} to={`/location/${loc.slug}`}>
            <div 
              style={{
                background: '#2c251e',
                border: '3px solid #8b5a2b',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.borderColor = '#d4af37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#8b5a2b';
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                {loc.icon_type === 'tavern' && '🍻'}
                {loc.icon_type === 'forest' && '🌲'}
                {loc.icon_type === 'dungeon' && '💀'}
                {loc.icon_type === 'market' && '⚖️'}
              </div>
              <h2 style={{ color: '#f5deb3', margin: '0 0 0.5rem 0' }}>{loc.name}</h2>
              <p style={{ color: '#c0c0c0', fontSize: '0.9rem', lineHeight: '1.4' }}>{loc.description}</p>
              <div style={{ marginTop: '1.5rem', color: '#d4af37', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Inspect Region ➔
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}