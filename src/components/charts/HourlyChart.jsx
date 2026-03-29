import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import ChartCard from '../ui/ChartCard';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'var(--bg-card)', border:'1px solid var(--border-bright)',
      borderRadius:8, padding:'8px 12px', fontFamily:'var(--font-mono)', fontSize:'0.75rem',
    }}>
      <div style={{ color:'var(--text-muted)', marginBottom:4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}{unit || ''}</strong>
        </div>
      ))}
    </div>
  );
};

function LineChartCard({ title, data, dataKey, color, unit, name }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top:5, right:10, left:-10, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)' }} />
          <YAxis tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)' }} />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} name={name || dataKey} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function BarChartCard({ title, data, dataKey, color, unit, name }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top:5, right:10, left:-10, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)' }} />
          <YAxis tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)' }} />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Bar dataKey={dataKey} fill={color} name={name || dataKey} radius={[2,2,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default function HourlyCharts({ hourlyData, aqHourly, tempUnit }) {
  if (!hourlyData) return null;

  const { times, temp, humidity, precip, visibility, windSpeed } = hourlyData;

  const toTemp = (v) => tempUnit === 'F' ? (v != null ? Math.round(v*9/5+32) : null) : v;

  const tempData = times.map((t, i) => ({ time: t, temp: toTemp(temp[i]) }));
  const humidData = times.map((t, i) => ({ time: t, humidity: humidity[i] }));
  const precipData = times.map((t, i) => ({ time: t, precip: precip[i] }));
  const visData = times.map((t, i) => ({ time: t, visibility: visibility[i] != null ? Math.round(visibility[i]/1000*10)/10 : null }));
  const windData = times.map((t, i) => ({ time: t, wind: windSpeed[i] }));

  const aqData = aqHourly ? aqHourly.times.map((t, i) => ({
    time: t,
    pm10: aqHourly.pm10[i],
    pm25: aqHourly.pm25[i],
  })) : [];

  return (
    <div>
      <LineChartCard title={`Temperature (${tempUnit === 'F' ? '°F' : '°C'})`} data={tempData} dataKey="temp" color="var(--accent-warn)" unit={tempUnit==='F'?' °F':' °C'} name="Temperature" />
      <LineChartCard title="Relative Humidity (%)" data={humidData} dataKey="humidity" color="var(--accent)" unit="%" name="Humidity" />
      <BarChartCard title="Precipitation (mm)" data={precipData} dataKey="precip" color="var(--accent-2)" unit=" mm" name="Precipitation" />
      <LineChartCard title="Visibility (km)" data={visData} dataKey="visibility" color="var(--accent-3)" unit=" km" name="Visibility" />
      <LineChartCard title="Wind Speed 10m (km/h)" data={windData} dataKey="wind" color="#fb923c" unit=" km/h" name="Wind Speed" />
      {aqData.length > 0 && (
        <ChartCard title="PM10 & PM2.5 (μg/m³)">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={aqData} margin={{ top:5, right:10, left:-10, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)' }} />
              <YAxis tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)' }} />
              <Tooltip content={<CustomTooltip unit=" μg/m³" />} />
              <Legend wrapperStyle={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--text-secondary)' }} />
              <Line type="monotone" dataKey="pm10" stroke="#f472b6" strokeWidth={2} dot={false} name="PM10" />
              <Line type="monotone" dataKey="pm25" stroke="#a78bfa" strokeWidth={2} dot={false} name="PM2.5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
