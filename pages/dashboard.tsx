// pages/dashboard.tsx
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState } from 'react';
import { LOCATION_NAMES, STATIONS, DEPTHS } from '../lib/constants';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(res => res.json());

export default function DashboardPage() {
  // ─────────────────────────────
  // 1) Hooks (always in the same order)
  // ─────────────────────────────
  const { data: session, status } = useSession();
  const router = useRouter();
  const { location } = router.query as { location?: string };

  // Date filters
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
  const [startDate, setStartDate] = useState(yesterday.toISOString().slice(0, 10));
  const [endDate, setEndDate]     = useState(now.toISOString().slice(0, 10));

  // Station/depth filters
  const [stationFilter, setStationFilter] = useState<'all' | string>('all');
  const [depthFilter,   setDepthFilter]   = useState<'all' | string>('all');

  // SWR fetch (returns empty array as fallback)
  const apiUrl = location
    ? `/api/stations?location=${location}&from=${startDate}&to=${endDate}`
    : null;
  const { data = [], error } = useSWR<string[]>(apiUrl, fetcher);

  // ─────────────────────────────
  // 2) Guard / early returns
  // ─────────────────────────────
  if (status === 'loading') return null;         // still checking session
  if (!session) {
    router.replace('/login');
    return null;
  }
  if (!location) {
    return <p style={styles.msg}>No location selected.</p>;
  }
  if (error) {
    return <p style={styles.msg}>Failed to load data.</p>;
  }

  const displayLocation = LOCATION_NAMES[location] || location;

  // ─────────────────────────────
  // 3) Compute derived data
  // ─────────────────────────────
  // Build visible columns
  const columns = ['timestamp'] as string[];
  STATIONS.forEach(s => {
    if (stationFilter === 'all' || stationFilter === s.key) {
      DEPTHS.forEach(d => {
        if (depthFilter === 'all' || depthFilter === d.key) {
          columns.push(`${s.key}_${d.key}`);
        }
      });
    }
  });

  // ─────────────────────────────
  // 4) Actions
  // ─────────────────────────────
  const goBack = () => router.replace('/select-location');
  const viewGraph = () =>
    router.push({
      pathname: '/chart',
      query: { location, station: stationFilter, depth: depthFilter, from: startDate, to: endDate },
    });

  // ─────────────────────────────
  // 5) Render
  // ─────────────────────────────
  return (
    <div style={styles.page}>
      <button onClick={goBack} style={styles.backButton}>← Back</button>
      <h1 style={styles.heading}>Dashboard for {displayLocation}</h1>

      <div style={styles.controls}>
        <div style={styles.filters}>
          <label>
            From{' '}
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={styles.input}
            />
          </label>
          <label>
            To{' '}
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={styles.input}
            />
          </label>
        </div>

        <select
          value={stationFilter}
          onChange={e => setStationFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Stations</option>
          {STATIONS.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>

        <select
          value={depthFilter}
          onChange={e => setDepthFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Depths</option>
          {DEPTHS.map(d => (
            <option key={d.key} value={d.key}>{d.label}</option>
          ))}
        </select>

        <button onClick={viewGraph} style={styles.button}>View Graph</button>
      </div>

      {data.length === 0 ? (
        <p style={styles.msg}>No data for this date range.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {columns.map(col => {
                  if (col === 'timestamp') {
                    return <th key={col} style={styles.th}>Timestamp</th>;
                  }
                  const [sk, dk] = col.split('_');
                  const s = STATIONS.find(x => x.key === sk)!;
                  const d = DEPTHS.find(x => x.key === dk)!;
                  return <th key={col} style={styles.th}>{s.label} @ {d.label}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((rec: any, i: number) => (
                <tr key={i} style={styles.tr}>
                  {columns.map(col => (
                    <td key={col} style={styles.td}>
                      {col === 'timestamp'
                        ? new Date(rec[col]).toLocaleString()
                        : `${rec[col]}%`}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Protect server-side too
export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { props: {} };
};

const styles: { [k: string]: React.CSSProperties } = {
  msg: { textAlign: 'center', marginTop: 32, color: '#e53e3e' },
  page: { padding: 24, background: '#f3f4f6', minHeight: '100vh', boxSizing: 'border-box' },
  backButton: { position: 'absolute', top: 16, right: 16, padding: '8px 12px', background: '#5dade2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' },
  heading: { textAlign: 'center', margin: '0 0 16px', fontSize: '1.75rem', color: '#333' },
  controls: { display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  filters: { display: 'flex', gap: 8 },
  input: { padding: 6, fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc' },
  select: { padding: 6, fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc' },
  button: { padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden' },
  th: { padding: '12px', background: '#e2e8f0', textAlign: 'left', borderBottom: '1px solid #cbd5e1' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '12px', color: '#374151' },
};
