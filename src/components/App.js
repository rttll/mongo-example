import { useEffect, useState } from 'react';
import './App.css';

const server = 'http://localhost:9000';
export default function App() {
  const [loading, setLoading] = useState(true);
  const [bots, setBots] = useState([]);

  useEffect(() => {
    fetch(server + '/bots')
      .then((resp) => resp.json())
      .then((json) => {
        if (json.bots) setBots(json.bots);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  function create(e) {
    e.preventDefault();
    fetch(server + '/bots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `George #${bots.length + 1}`,
        almostHuman: true,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.bot) setBots(bots.concat([json.bot]));
      })
      .catch(console.error);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <a
        href='/'
        onClick={create}
        style={{
          color: '#222',
          background: 'lemonchiffon',
          borderRadius: '6px',
          padding: '1rem 2.6rem',
        }}>
        Create bot
      </a>
      <div style={{ margin: '3rem 0' }}>
        {bots.length === 0 && <div>no bots yet</div>}
        {bots.map((bot) => (
          <div key={bot._id}>{bot.name}</div>
        ))}
      </div>
    </>
  );
}
