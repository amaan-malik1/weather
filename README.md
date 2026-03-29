# 🌤 ATMOS — Weather Intelligence Dashboard

A responsive React weather dashboard built with Open-Meteo API. Features real-time weather, air quality metrics, hourly charts, and historical trend analysis.

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd weather-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Recharts | Data visualizations |
| Open-Meteo API | Weather & air quality data |
| Nominatim API | Reverse geocoding (location name) |

## 📦 Features

### Page 1 — Current Weather & Hourly Forecast
- **Auto GPS detection** — automatically locates user on load
- **Date picker** — view weather for any past date
- **Stat cards** — Temperature (min/max/current), Precipitation, Humidity, UV Index, Sunrise/Sunset, Wind Speed, Precipitation Probability
- **Air Quality** — AQI, PM10, PM2.5, CO, NO₂, SO₂
- **Hourly Charts** — Temperature (°C/°F toggle), Humidity, Precipitation, Visibility, Wind Speed, PM10 & PM2.5

### Page 2 — Historical Analysis (up to 2 years)
- **Date range selector** with validation (max 730 days)
- **Historical Charts** — Temperature trends, Sun cycle (IST), Precipitation totals, Wind speed & direction, Air quality PM10/PM2.5

## 📡 APIs Used

| API | Endpoint |
|-----|---------|
| Weather (current + forecast) | `https://api.open-meteo.com/v1/forecast` |
| Historical weather | `https://archive-api.open-meteo.com/v1/archive` |
| Air quality | `https://air-quality-api.open-meteo.com/v1/air-quality` |
| Reverse geocoding | `https://nominatim.openstreetmap.org/reverse` |

All APIs are **free** with no API key required.

## ⚠️ Notes

- **CO₂** is not available in the Open-Meteo API and is displayed as "Not in API"
- Air quality historical data uses hourly readings averaged to daily means
- The app falls back to New Delhi coordinates if GPS is denied
- Large date ranges (> 90 days) are sampled for chart readability

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── HourlyChart.jsx      # 6 hourly charts for Page 1
│   │   └── HistoricalCharts.jsx # 5 historical charts for Page 2
│   ├── pages/
│   │   ├── CurrentPage.jsx      # Page 1
│   │   └── HistoricalPage.jsx   # Page 2
│   └── ui/
│       ├── ChartCard.jsx        # Scrollable chart wrapper
│       ├── DatePicker.jsx       # Styled date input
│       ├── Navbar.jsx           # Top navigation
│       ├── SectionHeader.jsx    # Section title component
│       └── StatCard.jsx         # Individual metric card
├── hooks/
│   └── useLocation.js           # GPS + reverse geocoding hook
├── utils/
│   ├── api.js                   # All Open-Meteo API calls
│   └── helpers.js               # Date/unit formatting utilities
├── styles/
│   └── global.css               # CSS variables + global styles
├── App.jsx
└── main.jsx
```

## 🌐 Deployment (Vercel)

```bash
npm run build
# Deploy the dist/ folder to Vercel, Netlify, or GitHub Pages
```

For Vercel: just connect your GitHub repo and it auto-deploys.
# weather
