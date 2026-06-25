import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function LocationDetail() {
  const { slug } = useParams();
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/api/locations/${slug}`)
      .then((res) => res.json())
      .then((locData) => {
        if (locData.error) throw new Error(locData.error);
        setLocation(locData);
        return fetch(`http://localhost:5001/api/locations/${locData.id}/events`);
      })
      .then((res) => res.json())
      .then((eventData) => {
        setEvents(eventData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Consulting guild archives...</div>;
  if (!location) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Region lost to history.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#d4af37', fontWeight: 'bold' }}>⬅ Return to World Board</Link>
      
      <div style={{ borderBottom: '2px solid #8b5a2b', paddingBottom: '1rem', marginTop: '1.5rem' }}>
        <h1 style={{ color: '#f5deb3', fontSize: '2.5rem', margin: 0 }}>{location.name}</h1>
        <p style={{ fontStyle: 'italic', color: '#aaa', margin: '0.5rem 0 0 0' }}>{location.description}</p>
      </div>

      <h2 style={{ color: '#d4af37', marginTop: '2rem' }}>Active Quest Board Notices</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {events.length === 0 ? (
          <p style={{ color: '#888' }}>Peaceful quiet reigns here... for now.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} style={{ background: '#221c16', borderLeft: '4px solid #d4af37', padding: '1.5rem', borderRadius: '4px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#f5deb3' }}>{event.title}</h3>
              <p style={{ color: '#ddd', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>{event.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#aaa' }}>
                <span><strong>Issued By:</strong> {event.quest_giver}</span>
                <span><strong>Deadline:</strong> {new Date(event.event_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}