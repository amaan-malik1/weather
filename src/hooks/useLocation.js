import { useState, useEffect } from "react";

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Fallback to Delhi coords
      setLocation({ lat: 28.6139, lon: 77.209, city: "New Delhi" });
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        let city = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          );
          const data = await res.json();
          city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            city;
        } catch {}
        setLocation({ lat, lon, city });
        setLoading(false);
      },
      () => {
        // Fallback just for safety reasons//default
        setLocation({ lat: 28.6139, lon: 77.209, city: "New Delhi" });
        setLoading(false);
      },
      { timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  return { location, error, loading };
}
