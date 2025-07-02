import React from 'react';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const handleLogout = () => router.replace('/login');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 16, textAlign: 'right', background: '#fff' }}>
        <button onClick={handleLogout} style={{
          background: '#5dade2', color: '#fff', border: 'none',
          padding: '8px 12px', borderRadius: 6, cursor: 'pointer'
        }}>
          Logout
        </button>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer style={{ padding: 16, textAlign: 'center', fontSize: 12, color: '#666' }}>
        &copy; {new Date().getFullYear()} Climetz
      </footer>
    </div>
  );
}
