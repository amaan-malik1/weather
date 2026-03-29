import React, { useState, useEffect, useCallback } from 'react';
import { fetchCurrentWeather, fetchWeatherForDate, fetchAirQuality, getAQILabel, WMO_CODES } from '../../utils/api';
import { formatTime, formatDate, todayISO } from '../../utils/helpers';
import StatCard from '../ui/StatCard';
import SectionHeader from '../ui/SectionHeader';
import DatePicker from '../ui/DatePicker';
import HourlyCharts from '../charts/HourlyChart';

export default function CurrentPage({ location }) {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [weather, setWeather] = useState(null);
  const [tempUnit, setTempUnit] = useState('C');
  const isToday = selectedDate === todayISO();
  const [aq, setAq] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    try {
      const [wData, aqData] = await Promise.all([
        isToday
          ? fetchCurrentWeather(location.lat, location.lon)
          : fetchWeatherForDate(location.lat, location.lon, selectedDate),
        fetchAirQuality(location.lat, location.lon, selectedDate),
      ]);
      setWeather(wData);
      setAq(aqData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [location, selectedDate, isToday]);

  useEffect(() => { load(); }, [load]);  

  const toTemp = (v) => {
    if (v == null) return null;
    return tempUnit === 'F' ? Math.round(v * 9 / 5 + 32) : Math.round(v * 10) / 10;
  };
  const tempSuffix = tempUnit === 'F' ? '°F' : '°C';

  const current = weather?.current;
  const daily = weather?.daily;
  const dailyIdx = 0;

  // Pick current AQ values (first non-null from the hourly array)
  const firstVal = (arr) => arr?.find(v => v != null) ?? null;
  const aqH = aq?.hourly;
  const currentAQI = aqH ? firstVal(aqH.european_aqi) : null;
  const currentPM10 = aqH ? firstVal(aqH.pm10) : null;
  const currentPM25 = aqH ? firstVal(aqH.pm2_5) : null;
  const currentCO = aqH ? firstVal(aqH.carbon_monoxide) : null;
  const currentNO2 = aqH ? firstVal(aqH.nitrogen_dioxide) : null;
  const currentSO2 = aqH ? firstVal(aqH.sulphur_dioxide) : null;
  const aqiInfo = getAQILabel(currentAQI);

  // Hourly data for charts
  const hourlyTimes = weather?.hourly?.time?.map(t => {
    const h = new Date(t).getHours();
    return `${h.toString().padStart(2, '0')}:00`;
  }) ?? [];

  const hourlyData = weather ? {
    times: hourlyTimes,
    temp: weather.hourly?.temperature_2m ?? [],
    humidity: weather.hourly?.relative_humidity_2m ?? [],
    precip: weather.hourly?.precipitation ?? [],
    visibility: weather.hourly?.visibility ?? [],
    windSpeed: weather.hourly?.wind_speed_10m ?? [],
  } : null;

  const aqHourly = aqH ? {
    times: hourlyTimes,
    pm10: aqH.pm10 ?? [],
    pm25: aqH.pm2_5 ?? [],
  } : null;

  const weatherCode = isToday ? current?.weather_code : daily?.weather_code?.[dailyIdx];
  const weatherDesc = WMO_CODES[weatherCode] || 'Unknown';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 24 }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div className="fade-up">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
            {isToday ? 'Live Conditions' : formatDate(selectedDate)}
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            {location?.city}
          </h1>
          {!loading && <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.9rem' }}>{weatherDesc}</p>}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <DatePicker label="Select Date" value={selectedDate} onChange={setSelectedDate} max={todayISO()} min="2022-01-01" />
          <button
            onClick={() => setTempUnit(u => u === 'C' ? 'F' : 'C')}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '8px 14px',
              color: 'var(--accent)', fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            °{tempUnit === 'C' ? 'C → F' : 'F → C'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="loader" />
        </div>
      ) : (
        <>
          {/* Temperature Cards */}
          <SectionHeader title="Temperature" subtitle={`Showing in ${tempSuffix}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>
            <StatCard icon="🌡️" label="Current Temp" value={toTemp(isToday ? current?.temperature_2m : null)} unit={tempSuffix} delay={0} color="var(--accent-warn)" />
            <StatCard icon="🔺" label="Max Temp" value={toTemp(daily?.temperature_2m_max?.[dailyIdx])} unit={tempSuffix} delay={50} color="var(--accent-danger)" />
            <StatCard icon="🔻" label="Min Temp" value={toTemp(daily?.temperature_2m_min?.[dailyIdx])} unit={tempSuffix} delay={100} color="var(--accent-2)" />
          </div>

          {/* Atmospheric Conditions */}
          <SectionHeader title="Atmospheric Conditions" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>
            <StatCard icon="🌧️" label="Precipitation" value={daily?.precipitation_sum?.[dailyIdx]} unit="mm" delay={0} />
            <StatCard icon="💧" label="Humidity" value={isToday ? current?.relative_humidity_2m : null} unit="%" delay={50} color="var(--accent)" />
            <StatCard icon="☀️" label="UV Index" value={daily?.uv_index_max?.[dailyIdx]} delay={100} color="var(--accent-warn)"
              sub={daily?.uv_index_max?.[dailyIdx] > 6 ? 'High — use protection' : daily?.uv_index_max?.[dailyIdx] > 3 ? 'Moderate' : 'Low'}
            />
          </div>

          {/* Sun Cycle */}
          <SectionHeader title="Sun Cycle" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>
            <StatCard icon="🌅" label="Sunrise" value={formatTime(daily?.sunrise?.[dailyIdx])} delay={0} color="#fbbf24" />
            <StatCard icon="🌇" label="Sunset" value={formatTime(daily?.sunset?.[dailyIdx])} delay={50} color="#f97316" />
          </div>

          {/* Wind & Air */}
          <SectionHeader title="Wind & Air" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>
            <StatCard icon="💨" label="Max Wind Speed" value={daily?.wind_speed_10m_max?.[dailyIdx]} unit="km/h" delay={0} color="var(--accent-3)" />
            <StatCard icon="🌂" label="Precip Prob Max" value={daily?.precipitation_probability_max?.[dailyIdx]} unit="%" delay={50} />
          </div>

          {/* Air Quality */}
          <SectionHeader title="Air Quality Metrics" subtitle={currentAQI != null ? `AQI: ${aqiInfo.label}` : ''} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 32 }}>
            <StatCard icon="🌬️" label="AQI (European)" value={currentAQI} color={aqiInfo.color} sub={aqiInfo.label} delay={0} />
            <StatCard icon="🟤" label="PM10" value={currentPM10} unit="μg/m³" delay={50} />
            <StatCard icon="🟣" label="PM2.5" value={currentPM25} unit="μg/m³" delay={100} />
            <StatCard icon="💨" label="CO" value={currentCO} unit="μg/m³" delay={150} />
            <StatCard icon="🌫️" label="CO₂" value="—" sub="Not in API" delay={200} color="var(--text-muted)" />
            <StatCard icon="🔵" label="NO₂" value={currentNO2} unit="μg/m³" delay={250} />
            <StatCard icon="🟡" label="SO₂" value={currentSO2} unit="μg/m³" delay={300} />
          </div>

          {/* Hourly Charts */}
          <SectionHeader title="Hourly Breakdown" subtitle={`All 24 hours for ${formatDate(selectedDate)}`} />
          <HourlyCharts hourlyData={hourlyData} aqHourly={aqHourly} tempUnit={tempUnit} />
        </>
      )}
    </div>
  );
}
