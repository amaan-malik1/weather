import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import ChartCard from "../ui/ChartCard";

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-bright)",
        borderRadius: 8,
        padding: "8px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        maxWidth: 200,
      }}
    >
      <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}:{" "}
          <strong>
            {p.value != null ? p.value : "—"}
            {unit || ""}
          </strong>
        </div>
      ))}
    </div>
  );
};

export default function HistoricalCharts({ data }) {
  if (!data) return null;

  const { daily } = data;
  const dates = daily.time;

  // Temperature
  const tempData = dates.map((d, i) => ({
    date: d,
    max: daily.temperature_2m_max?.[i],
    min: daily.temperature_2m_min?.[i],
    mean: daily.temperature_2m_mean?.[i],
  }));

  // Sun cycle in IST
  const sunData = dates.map((d, i) => {
    const riseISO = daily.sunrise?.[i];
    const setISO = daily.sunset?.[i];
    const toMins = (iso) => {
      if (!iso) return null;
      const dt = new Date(iso);
      const ist = new Date(
        dt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      );
      return ist.getHours() * 60 + ist.getMinutes();
    };
    return { date: d, sunrise: toMins(riseISO), sunset: toMins(setISO) };
  });

  const formatMins = (val) => {
    if (val == null) return "";
    const h = Math.floor(val / 60),
      m = val % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  // Precip
  const precipData = dates.map((d, i) => ({
    date: d,
    precip: daily.precipitation_sum?.[i],
  }));

  // Wind
  const windData = dates.map((d, i) => ({
    date: d,
    speed: daily.wind_speed_10m_max?.[i],
    dir: daily.wind_direction_10m_dominant?.[i],
  }));

  // AQ
  const aqData = data.aqDaily || [];

  // For large datasets, sample every Nth point for readability
  const sample = (arr, n) => (n <= 1 ? arr : arr.filter((_, i) => i % n === 0));
  const N = Math.max(1, Math.floor(dates.length / 90));
  const sTemp = sample(tempData, N);
  const sSun = sample(sunData, N);
  const sPrec = sample(precipData, N);
  const sWind = sample(windData, N);
  const sAQ = sample(aqData, N);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Temperature */}
      <ChartCard title="Temperature — Mean / Max / Min (°C)" height={220}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart
            data={sTemp}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <YAxis
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <Tooltip content={<CustomTooltip unit="°C" />} />
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="max"
              fill="rgba(251,191,36,0.1)"
              stroke="var(--accent-warn)"
              strokeWidth={1.5}
              dot={false}
              name="Max"
            />
            <Line
              type="monotone"
              dataKey="mean"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              name="Mean"
            />
            <Area
              type="monotone"
              dataKey="min"
              fill="rgba(56,189,248,0.05)"
              stroke="var(--accent-2)"
              strokeWidth={1.5}
              dot={false}
              name="Min"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Sun Cycle */}
      <ChartCard
        title="Sun Cycle — Sunrise & Sunset (IST, minutes from midnight)"
        height={220}
      >
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart
            data={sSun}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <YAxis
              tickFormatter={formatMins}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(val) => formatMins(val)}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-bright)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                    }}
                  >
                    <div
                      style={{ color: "var(--text-muted)", marginBottom: 4 }}
                    >
                      {label}
                    </div>
                    {payload.map((p, i) => (
                      <div key={i} style={{ color: p.color }}>
                        {p.name}: <strong>{formatMins(p.value)} IST</strong>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="sunrise"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
              name="Sunrise"
            />
            <Line
              type="monotone"
              dataKey="sunset"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              name="Sunset"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Precipitation */}
      <ChartCard title="Precipitation — Daily Total (mm)" height={200}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={sPrec}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <YAxis
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <Tooltip content={<CustomTooltip unit=" mm" />} />
            <Bar
              dataKey="precip"
              fill="var(--accent-2)"
              name="Precipitation"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Wind */}
      <ChartCard
        title="Wind — Max Speed (km/h) & Dominant Direction (°)"
        height={220}
      >
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart
            data={sWind}
            margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <YAxis
              yAxisId="left"
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 360]}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="speed"
              fill="#fb923c"
              name="Wind Speed (km/h)"
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="dir"
              stroke="var(--accent-3)"
              strokeWidth={1.5}
              dot={false}
              name="Direction (°)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Air Quality */}
      {sAQ.length > 0 && (
        <ChartCard
          title="Air Quality — PM10 & PM2.5 Daily Mean (μg/m³)"
          height={200}
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={sAQ}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{
                  fill: "var(--text-muted)",
                  fontSize: 9,
                  fontFamily: "var(--font-mono)",
                }}
              />
              <YAxis
                tick={{
                  fill: "var(--text-muted)",
                  fontSize: 9,
                  fontFamily: "var(--font-mono)",
                }}
              />
              <Tooltip content={<CustomTooltip unit=" μg/m³" />} />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#f472b6"
                strokeWidth={2}
                dot={false}
                name="PM10"
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
                name="PM2.5"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
