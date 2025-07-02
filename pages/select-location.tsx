// pages/select-location.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { LOCATIONS_LIST } from '../lib/constants';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  });

export default function SelectLocationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: locations, error } = useSWR('/api/locations', fetcher);

  // 1. While loading session, show nothing
  if (status === 'loading') return null;

  // 2. If not authenticated, redirect to login
  if (!session) {
    router.replace('/login');
    return null;
  }

  const handleSelect = (id: string) => router.push(`/dashboard?location=${id}`);
  const handleLogout = () => router.replace('/login');

  if (error) {
    return <p style={styles.msg}>Failed to load locations.</p>;
  }
  if (!locations) {
    return <p style={styles.msg}>Loading locations…</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
        <img src="/climetz-logo.png" alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>Select a Location</h2>
        <ul style={styles.list}>
          {locations.map((loc: { id: string; name: string }) => (
            <li key={loc.id} style={styles.item}>
              <button
                onClick={() => handleSelect(loc.id)}
                style={styles.button}
              >
                {loc.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  msg: {
    textAlign: 'center',
    marginTop: 32,
    color: '#e53e3e',
    fontSize: '1rem',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f3f4f6',
    padding: '0 16px',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '360px',
    background: '#fff',
    padding: '32px 24px 24px',
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  logout: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: '8px 12px',
    background: '#5dade2',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  logo: {
    width: 120,
    margin: '0 auto 24px',
    height: 'auto',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: 24,
    color: '#333',
    fontWeight: 600,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    marginBottom: 16,
  },
  button: {
    width: '100%',
    padding: 12,
    background: '#5dade2',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '1rem',
  },
};
