// pages/chart.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SoilDataPoint = {
  timestamp: string;
  d10: number;
  d30: number;
  d60: number;
};

export default function ChartPage() {
  const router = useRouter();
  const { location } = router.query as { location: string };
  const [dataPoints, setDataPoints] = useState<SoilDataPoint[]>([]);

  // Fetch data when location changes
  useEffect(() => {
    if (!location) return;
    fetch(`/api/soil-moisture?location=${location}`)
      .then(res => res.json())
      .then(json => setDataPoints(json.data))
      .catch(console.error);
  }, [location]);

  // Prepare the chart data
  const data = {
    labels: dataPoints.map(pt => new Date(pt.timestamp).toLocaleString()),
    datasets: [
      {
        label: '10 cm',
        data: dataPoints.map(pt => pt.d10),
        fill: false,
        tension: 0.4,
      },
      {
        label: '30 cm',
        data: dataPoints.map(pt => pt.d30),
        fill: false,
        tension: 0.4,
      },
      {
        label: '60 cm',
        data: dataPoints.map(pt => pt.d60),
        fill: false,
        tension: 0.4,
      },
    ],
  };

  // Chart options with correct typing
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',    // only allowed literal values
      },
      title: {
        display: false,
        text: 'Soil Moisture Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Moisture (%)',
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <button onClick={() => router.back()} style={{ marginBottom: 16 }}>
        ← Back
      </button>
      <Line data={data} options={options} />
    </div>
  );
}
