export function cToF(c) {
  if (c == null) return null;
  return Math.round(((c * 9) / 5 + 32) * 10) / 10;
}

export function formatHour(isoStr) {
  const d = new Date(isoStr);
  return d.getHours().toString().padStart(2, "0") + ":00";
}

export function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function toIST(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function maxDateISO() {
  return todayISO();
}

export function minHistoricalISO() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 2);
  return d.toISOString().split("T")[0];
}

export function getWindDirection(degrees) {
  if (degrees == null) return "N/A";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}

// Aggregate hourly AQ to daily mean for historical view
export function hourlyToDailyMean(times, values) {
  const map = {};
  times.forEach((t, i) => {
    const date = t.split("T")[0];
    if (!map[date]) map[date] = [];
    if (values[i] != null) map[date].push(values[i]);
  });
  return Object.entries(map).map(([date, vals]) => ({
    date,
    value: vals.length
      ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
      : null,
  }));
}
