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
  Chip,
  Stack,
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
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const highTrafficRoute = [
  [12.9716, 77.5946], // Bangalore center - Example
  [12.975, 77.605],
  [12.98, 77.615],
  [12.985, 77.625],
];

const lowTrafficRoute = [
  [12.95, 77.55],
  [12.94, 77.56],
  [12.93, 77.57],
];

const Traffic = () => {
  const [trafficData, setTrafficData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const mockTrafficData = {
          congestion: 65,
          averageSpeed: 35,
          incidents: 3,
          timestamp: new Date().toISOString(),
        };

        const mockHistoricalData = Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          congestion: Math.floor(Math.random() * 100),
          averageSpeed: Math.floor(Math.random() * 60) + 20,
        }));

        setTrafficData(mockTrafficData);
        setHistoricalData(mockHistoricalData);
      } catch (err) {
        setError('Error fetching traffic data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCongestionColor = (congestion) => {
    if (congestion <= 30) return '#00e400';
    if (congestion <= 50) return '#ffff00';
    if (congestion <= 70) return '#ff7e00';
    return '#ff0000';
  };

  const getCongestionDescription = (congestion) => {
    if (congestion <= 30) return 'Low';
    if (congestion <= 50) return 'Moderate';
    if (congestion <= 70) return 'High';
    return 'Severe';
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
        Traffic Monitoring
      </Typography>

      <Grid container spacing={3}>
        {/* Current Traffic Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Traffic Status
              </Typography>
              {trafficData && (
                <>
                  <Typography
                    variant="h3"
                    sx={{ color: getCongestionColor(trafficData.congestion) }}
                  >
                    {trafficData.congestion}%
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {getCongestionDescription(trafficData.congestion)} Congestion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {new Date(trafficData.timestamp).toLocaleString()}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Traffic Metrics */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {trafficData && [
              { label: 'Average Speed', value: trafficData.averageSpeed, unit: 'km/h' },
              { label: 'Active Incidents', value: trafficData.incidents, unit: '' },
            ].map((metric) => (
              <Grid item xs={6} key={metric.label}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="h6">
                    {metric.value} {metric.unit}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Historical Data Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, width: 500 }}>
            <Typography variant="h6" gutterBottom>
              Traffic Trends (24 Hours)
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="congestion"
                  stroke="#1976d2"
                  name="Congestion %"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="averageSpeed"
                  stroke="#2e7d32"
                  name="Average Speed (km/h)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      </Grid>
      
      {/* Traffic Map - New Row, Full Width */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400, width: 800, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Traffic Map
            </Typography>
            <MapContainer
              center={[12.9716, 77.5946]} // Bangalore center
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Example traffic routes */}
              <Polyline
                positions={highTrafficRoute}
                color="red"
                weight={5}
              >
                <Popup>
                  <Typography variant="subtitle2">
                    High Traffic Zone
                  </Typography>
                </Popup>
              </Polyline>
              <Polyline
                positions={lowTrafficRoute}
                color="green"
                weight={5}
              >
                <Popup>
                  <Typography variant="subtitle2">
                    Low Traffic Zone
                  </Typography>
                </Popup>
              </Polyline>
            </MapContainer>
             {/* Legend overlay */}
             <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'white', p: 1, borderRadius: 2, boxShadow: 1, zIndex: 1000 }}>
              <Chip label="High Traffic" sx={{ bgcolor: 'red', color: 'white', fontWeight: 600, height: '24px' }} />
              <Chip label="Low Traffic" sx={{ bgcolor: 'green', color: 'white', fontWeight: 600, height: '24px' }} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Traffic; 