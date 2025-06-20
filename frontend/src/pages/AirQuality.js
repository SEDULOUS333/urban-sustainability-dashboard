import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import axios from 'axios';

const AirQuality = () => {
  const [airQualityData, setAirQualityData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAirQuality = async () => {
      setLoading(true);
      setError('');
      try {
        // Example coordinates for Bengaluru
        const lat = 12.9716;
        const lng = 77.5946;
        const apiUrl = process.env.REACT_APP_API_URL || 'https://urban-sustainability-dashboard.onrender.com';
        // Fetch current air quality
        const currentRes = await axios.get(`${apiUrl}/api/airQuality/location?lat=${lat}&lng=${lng}`);
        setAirQualityData(currentRes.data);
        // Fetch historical data (last 7 days)
        const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = new Date().toISOString();
        const historyRes = await axios.get(`${apiUrl}/api/airQuality/history?lat=${lat}&lng=${lng}&startDate=${startDate}&endDate=${endDate}`);
        setHistoricalData(historyRes.data);
      } catch (err) {
        setError('Failed to fetch air quality data');
      } finally {
        setLoading(false);
      }
    };
    fetchAirQuality();
  }, []);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#99004c';
    return '#7e0023';
  };

  const getAQIDescription = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Air Quality Monitoring
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        {/* Current Air Quality Card */}
        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ height: '100%', minHeight: 220, maxHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Current Air Quality
              </Typography>
              {airQualityData && (
                <>
                  <Typography
                    variant="h3"
                    sx={{ color: getAQIColor(airQualityData.aqi) }}
                  >
                    {airQualityData.aqi}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {getAQIDescription(airQualityData.aqi)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {new Date(airQualityData.timestamp).toLocaleString()}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Air Quality Parameters */}
        <Grid sx={{ display: 'flex', flexDirection: 'column', ml: { md: 3 }, mt: { xs: 3, md: 0 } }}>
          <Grid container spacing={2} sx={{ height: '100%',width:800}}>
            {airQualityData && [
              { label: 'PM2.5', value: airQualityData.pm25, unit: 'μg/m³' },
              { label: 'PM10', value: airQualityData.pm10, unit: 'μg/m³' },
              { label: 'O3', value: airQualityData.o3, unit: 'ppb' },
              { label: 'NO2', value: airQualityData.no2, unit: 'ppb' },
              { label: 'SO2', value: airQualityData.so2, unit: 'ppb' },
              { label: 'CO', value: airQualityData.co, unit: 'ppm' },
            ].map((param) => (
              <Grid item xs={6} sm={4} key={param.label} sx={{ height: '100%' }}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%', minHeight: 80, maxHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {param.label}
                  </Typography>
                  <Typography variant="h6">
                    {param.value} {param.unit}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Historical Data Chart - new row, full width */}
      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 4,width:600, height: '100%', display: 'flex', flexDirection: 'column', m: 3 }}>
            <Typography variant="h6" gutterBottom>
              Air Quality Trend (7 Days)
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(timestamp) =>
                      new Date(timestamp).toLocaleDateString()
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(timestamp) =>
                      new Date(timestamp).toLocaleString()
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    stroke="#2e7d32"
                    name="AQI"
                  />
                  <Line
                    type="monotone"
                    dataKey="pm25"
                    stroke="#1976d2"
                    name="PM2.5"
                  />
                  <Line
                    type="monotone"
                    dataKey="pm10"
                    stroke="#ed6c02"
                    name="PM10"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Air Quality Map */}
      <Grid sx={{ mt: 3 }}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Air Quality Map
          </Typography>
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {airQualityData && (
              <Circle
                center={[12.9716, 77.5946]}
                radius={500}
                pathOptions={{
                  color: getAQIColor(airQualityData.aqi),
                  fillColor: getAQIColor(airQualityData.aqi),
                  fillOpacity: 0.3,
                }}
              >
                <Popup>
                  <Typography variant="subtitle2">
                    AQI: {airQualityData.aqi}
                  </Typography>
                  <Typography variant="body2">
                    {getAQIDescription(airQualityData.aqi)}
                  </Typography>
                </Popup>
              </Circle>
            )}
          </MapContainer>
        </Paper>
      </Grid>
    </Box>
  );
};

export default AirQuality; 