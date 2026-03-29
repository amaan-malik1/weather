// Open-Meteo API utility functions

export const WMO_CODES = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Icy Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  61: "Slight Rain",
  63: "Rain",
  65: "Heavy Rain",
  71: "Slight Snow",
  73: "Snow",
  75: "Heavy Snow",
  80: "Slight Showers",
  81: "Showers",
  82: "Heavy Showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ Hail",
  99: "Heavy Thunderstorm w/ Hail",
};

export async function fetchCurrentWeather(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "uv_index",
    ].join(","),
  );
  url.searchParams.set(
    "daily",
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "uv_index_max",
    ].join(","),
  );
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "visibility",
      "wind_speed_10m",
    ].join(","),
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Weather API failed");
  return res.json();
}

export async function fetchWeatherForDate(lat, lon, date) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set(
    "daily",
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "uv_index_max",
      "weather_code",
    ].join(","),
  );
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "visibility",
      "wind_speed_10m",
    ].join(","),
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", date);
  url.searchParams.set("end_date", date);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Weather API failed");
  return res.json();
}

export async function fetchAirQuality(lat, lon, date) {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set(
    "hourly",
    [
      "pm10",
      "pm2_5",
      "carbon_monoxide",
      "nitrogen_dioxide",
      "sulphur_dioxide",
      "european_aqi",
    ].join(","),
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", date);
  url.searchParams.set("end_date", date);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Air quality API failed");
  return res.json();
}

export async function fetchHistorical(lat, lon, startDate, endDate) {
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set(
    "daily",
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "temperature_2m_mean",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
    ].join(","),
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Historical API failed");
  return res.json();
}

export async function fetchHistoricalAirQuality(lat, lon, startDate, endDate) {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("hourly", ["pm10", "pm2_5"].join(","));
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Historical AQ API failed");
  return res.json();
}

export function getAQILabel(aqi) {
  if (aqi == null) return { label: "N/A", color: "#64748b" };
  if (aqi <= 20) return { label: "Good", color: "#34d399" };
  if (aqi <= 40) return { label: "Fair", color: "#a3e635" };
  if (aqi <= 60) return { label: "Moderate", color: "#fbbf24" };
  if (aqi <= 80) return { label: "Poor", color: "#f97316" };
  if (aqi <= 100) return { label: "Very Poor", color: "#f87171" };
  return { label: "Hazardous", color: "#c026d3" };
}
