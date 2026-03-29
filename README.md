# 🌤 ATMOS — Weather Intelligence Dashboard

A sleek, responsive weather dashboard built with **React + Vite**, powered by the free **Open-Meteo API**. Auto-detects your location via GPS, shows real-time conditions, air quality metrics, hourly charts, and up to 2 years of historical trend analysis.

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# → App opens at http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

> **No API key required.** Open-Meteo is completely free and open.

---

## ✨ Features

### 📍 Page 1 — Current Weather & Hourly Forecast

- **Auto GPS Detection** — Detects your location on load via browser geolocation; gracefully falls back to New Delhi if denied
- **Date Picker** — View weather for any past date, not just today
- **°C / °F Toggle** — Switch temperature units across all displays and charts

#### Stat Cards
| Section | Metrics Shown |
|---|---|
| Temperature | Current, Max, Min |
| Atmospheric | Precipitation, Humidity, UV Index |
| Sun Cycle | Sunrise, Sunset |
| Wind & Air | Max Wind Speed, Precipitation Probability |
| Air Quality | AQI, PM10, PM2.5, CO, NO₂, SO₂ |

#### Hourly Charts (all 24 hours)
- 🌡 Temperature (°C / °F)
- 💧 Relative Humidity
- 🌧 Precipitation
- 👁 Visibility
- 💨 Wind Speed (10m)
- 🟣 PM10 & PM2.5 — combined on one chart

---

### 📊 Page 2 — Historical Analysis (up to 2 years)

Select any date range up to **730 days** and analyze long-term trends:

| Chart | Type | Variables |
|---|---|---|
| Temperature | Area + Line | Mean, Max, Min (°C) |
| Sun Cycle | Line | Sunrise & Sunset (displayed in **IST**) |
| Precipitation | Bar | Daily total (mm) |
| Wind | Composed Bar + Line | Max speed (km/h) + Dominant direction (°) |
| Air Quality | Line | PM10 & PM2.5 daily mean (μg/m³) |

All charts include **horizontal scroll** for dense datasets, and data is **auto-sampled** for ranges over 90 days so charts stay legible.

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool (fast HMR) |
| Recharts | Responsive, composable charts |
| Open-Meteo API | Weather, historical & air quality data — free, no key |
| Nominatim API | Reverse geocoding (lat/lon → city name) |
| Google Fonts | Syne (display) + Space Mono (monospace) |

---

## 📡 API Endpoints Used

| Data | Endpoint |
|---|---|
| Current + forecast weather | `https://api.open-meteo.com/v1/forecast` |
| Historical weather (archive) | `https://archive-api.open-meteo.com/v1/archive` |
| Air quality (current + historical) | `https://air-quality-api.open-meteo.com/v1/air-quality` |
| Reverse geocoding | `https://nominatim.openstreetmap.org/reverse` |

All requests are fired in **parallel** using `Promise.all()` to meet the 500ms performance target.

---

## 📁 Project Structure

```
weather-dashboard/
├── index.html                        # Google Fonts loaded here
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx                      # React entry point
    ├── App.jsx                       # Root: page routing + location state
    ├── styles/
    │   └── global.css                # CSS variables, dark theme, animations
    ├── hooks/
    │   └── useLocation.js            # GPS detection + reverse geocoding
    ├── utils/
    │   ├── api.js                    # All Open-Meteo API fetch functions
    │   └── helpers.js                # Date/unit/direction formatting utilities
    └── components/
        ├── ui/
        │   ├── Navbar.jsx            # Top nav with page switcher + location
        │   ├── StatCard.jsx          # Individual metric display card
        │   ├── ChartCard.jsx         # Scrollable chart wrapper
        │   ├── SectionHeader.jsx     # Section title + subtitle
        │   └── DatePicker.jsx        # Styled date input
        ├── charts/
        │   ├── HourlyChart.jsx       # 6 hourly charts for Page 1
        │   └── HistoricalCharts.jsx  # 5 historical charts for Page 2
        └── pages/
            ├── CurrentPage.jsx       # Page 1 — current weather
            └── HistoricalPage.jsx    # Page 2 — historical analysis
```

---

## ⚠️ Known Limitations

| Limitation | Reason |
|---|---|
| **CO₂ shows "Not in API"** | Open-Meteo does not expose atmospheric CO₂ data |
| **Historical AQ is daily mean** | The air quality archive returns hourly data; it is averaged to daily for chart readability |
| **GPS requires browser permission** | If denied, the app defaults to New Delhi (28.61°N, 77.21°E) |
| **Historical data starts ~2022** | Open-Meteo archive availability varies by region |

---

## 🌐 Deployment

### Vercel (recommended)

```bash
# 1. Push your repo to GitHub
# 2. Go to vercel.com → New Project → Import your repo
# 3. Vercel auto-detects Vite — just click Deploy
```

### Manual (Netlify / GitHub Pages)

```bash
npm run build        # Outputs to dist/
# Upload the dist/ folder to any static host
```

---

## 📸 Screenshots

> _Add screenshots here after running the app locally._

| Page 1 — Current Weather | Page 2 — Historical Trends |
|---|---|
| _(screenshot)_ | _(screenshot)_ |

---

## 📬 Submission

Built as part of a **Junior ReactJS Frontend Developer** selection test.

- GitHub: [github.com/your-username/weather-dashboard](https://github.com/your-username/weather-dashboard)
- Live Demo: [your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)

---

## 📄 License

MIT — free to use and modify.
