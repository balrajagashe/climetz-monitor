import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { mockDataLocation1, StationRecord } from '../data/mockData';
import { STATIONS, DEPTHS } from '../lib/constants';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

export default function ChartPage() {
  const router = useRouter();
  const { location, station, depth, from, to } = router.query as Record<string,string>;
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);

  useEffect(() => {
    if (!location) return;
    const data: StationRecord[] = mockDataLocation1;
    const filtered = data.filter(rec => {
      const d = rec.timestamp.slice(0,10);
      return (!from||d>=from)&&(!to||d<=to);
    });
    const cols: string[] = [];
    STATIONS.forEach(s=>{
      if(station==='all'||station===s.key){
        DEPTHS.forEach(d=>{
          if(depth==='all'||depth===d.key) cols.push(`${s.key}_${d.key}`);
        });
      }
    });
    const levs = filtered.map(r=>new Date(r.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}));
    setLabels(levs);
    const palette = ['#2563eb','#16a34a','#d97706','#be185d','#0ea5e9','#ca8a04'];
    setDatasets(cols.map((col,i)=>{
      const [sk,dk]=col.split('_');
      const s=STATIONS.find(x=>x.key===sk)!, d=DEPTHS.find(x=>x.key===dk)!;
      return {
        label:`${s.label} @ ${d.label}`,
        data: filtered.map(r=>(r as any)[col]),
        fill:false, borderColor:palette[i%palette.length], backgroundColor:palette[i%palette.length],
        tension:0.2, pointRadius:3
      };
    }));
  },[location,station,depth,from,to]);

  const goBack = ()=>router.replace('/select-location');
  if(!location) return <p style={{textAlign:'center',marginTop:32}}>No location</p>;
  if(!datasets.length) return (
    <div style={{padding:24}}>
      <button onClick={goBack} style={{marginBottom:16}}>← Back</button>
      <p style={{color:'red'}}>Select station & depth first</p>
    </div>
  );

  const data = { labels, datasets };
  const options = {
    responsive:true,
    plugins:{legend:{position:'top'},title:{display:true,text:`Soil Moisture for ${location.toUpperCase()}`}},
    scales:{y:{title:{display:true,text:'Moisture (%)'},min:0,max:100},x:{title:{display:true,text:'Time'}}}
  };

  return (
    <div style={{padding:24}}>
      <button onClick={goBack} style={{marginBottom:16}}>← Back</button>
      <Line data={data} options={options}/>
    </div>
  );
}
