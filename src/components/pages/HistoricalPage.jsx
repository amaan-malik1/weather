import React, { useState, useCallback } from "react";
import { fetchHistorical, fetchHistoricalAirQuality } from "../../utils/api";
import {
  todayISO,
  minHistoricalISO,
  hourlyToDailyMean,
} from "../../utils/helpers";
import SectionHeader from "../ui/SectionHeader";
import DatePicker from "../ui/DatePicker";
import HistoricalCharts from "../charts/HistoricalCharts";

function diffDays(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

export default function HistoricalPage({ location }) {
  const today = todayISO();
  const twoYearsAgo = minHistoricalISO();

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!location) return;
    if (diffDays(startDate, endDate) > 730) {
      setError("Date range cannot exceed 2 years (730 days).");
      return;
    }
    if (diffDays(startDate, endDate) < 1) {
      setError("End date must be after start date.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const [hist, aqHist] = await Promise.all([
        fetchHistorical(location.lat, location.lon, startDate, endDate),
        fetchHistoricalAirQuality(
          location.lat,
          location.lon,
          startDate,
          endDate,
        ),
      ]);

      // Convert hourly AQ to daily means
      let aqDaily = [];
      if (aqHist?.hourly) {
        const pm10Daily = hourlyToDailyMean(
          aqHist.hourly.time,
          aqHist.hourly.pm10,
        );
        const pm25Daily = hourlyToDailyMean(
          aqHist.hourly.time,
          aqHist.hourly.pm2_5,
        );
        const pm25Map = Object.fromEntries(
          pm25Daily.map((d) => [d.date, d.value]),
        );
        aqDaily = pm10Daily.map((d) => ({
          date: d.date,
          pm10: d.value,
          pm25: pm25Map[d.date] ?? null,
        }));
      }
      setData({ ...hist, aqDaily });
    } catch (e) {
      setError("Failed to fetch historical data. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [location, startDate, endDate]);

  const days = diffDays(startDate, endDate);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 24 }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--accent-2)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Historical Analysis
        </div>
        <h1
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Long-term Weather Trends
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginTop: 6,
            fontSize: "0.85rem",
          }}
        >
          Select up to 2 years of historical data for {location?.city}
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          min={twoYearsAgo}
          max={endDate}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          min={startDate}
          max={today}
        />
        <div style={{ flex: 1, minWidth: 140 }}>
          <div
            style={{
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Range
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: days > 730 ? "var(--accent-danger)" : "var(--accent-3)",
            }}
          >
            {days} days {days > 730 ? "⚠ Max 730" : "✓"}
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading || days > 730 || days < 1}
          style={{
            background: loading ? "var(--border)" : "var(--accent)",
            color: loading ? "var(--text-muted)" : "#080c14",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "9px 22px",
            fontWeight: 700,
            fontSize: "0.85rem",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.03em",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? "Loading…" : "Analyze →"}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid var(--accent-danger)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 16px",
            color: "var(--accent-danger)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            marginBottom: 20,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 0",
            gap: 16,
          }}
        >
          <div className="loader" />
          <p
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
            FETCHING {days} DAYS OF DATA...
          </p>
        </div>
      )}

      {!loading && data && (
        <>
          <SectionHeader
            title="Historical Charts"
            subtitle={`${startDate} → ${endDate} · ${days} days · ${location?.city}`}
          />
          <HistoricalCharts data={data} />
        </>
      )}

      {!loading && !data && !error && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 20px",
            gap: 16,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem" }}>📊</div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
              maxWidth: 300,
            }}
          >
            Select a date range and click "Analyze →" to load historical weather
            trends.
          </p>
        </div>
      )}
    </div>
  );
}
