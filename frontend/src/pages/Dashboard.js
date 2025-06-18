import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import OpacityIcon from '@mui/icons-material/Opacity';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import axios from 'axios';

const energyData = [
  { district: 'Central', value: 480 },
  { district: 'West', value: 200 },
  { district: 'East', value: 450 },
  { district: 'South', value: 320 },
  { district: 'North', value: 590 },
];

const recommendations = [
  {
    icon: <RecyclingIcon fontSize="small" sx={{ color: '#ff9800' }} />,
    title: 'Recycling Reminder',
    desc: 'Collection day tomorrow! Your neighborhood recycling rate: 76%. Help us reach 80%.',
    impact: 'Impact: 4% improvement needed',
    color: '#fff3e0',
  },
  {
    icon: <LightbulbIcon fontSize="small" sx={{ color: '#1976d2' }} />,
    title: 'Energy Peak Hours',
    desc: 'Avoid high energy usage between 3-7 PM. Run dishwasher after 8 PM for 20% savings.',
    impact: 'Impact: 20% savings',
    color: '#e3f2fd',
  },
];

const districtPerformance = [
  { rank: 1, name: 'North', air: 89, energy: 85, waste: 78, score: 79, color: '#2196f3' },
  { rank: 2, name: 'West', air: 72, energy: 80, waste: 85, score: 78, color: '#4caf50' },
  { rank: 3, name: 'South', air: 84, energy: 77, waste: 70, score: 77, color: '#ffb300' },
  { rank: 4, name: 'Central', air: 70, energy: 75, waste: 72, score: 74, color: '#bdbdbd' },
  { rank: 5, name: 'East', air: 68, energy: 73, waste: 70, score: 72, color: '#bdbdbd' },
];

const OPENAQ_API_KEY = '37017410d15b98a6ffdf74c1da84d2b3c24a5f09cba7316e9783895109ec432f';

const alerts = [
  {
    type: 'aqi',
    message: 'High AQI detected in Central district',
    time: '2 min ago',
    color: '#d32f2f',
    icon: <WarningAmberIcon sx={{ color: '#d32f2f' }} />,
  },
  {
    type: 'traffic',
    message: 'Traffic congestion in West district',
    time: '5 min ago',
    color: '#1976d2',
    icon: <DirectionsCarIcon sx={{ color: '#1976d2' }} />,
  },
  {
    type: 'water',
    message: 'Low water quality alert in South district',
    time: '10 min ago',
    color: '#0288d1',
    icon: <OpacityIcon sx={{ color: '#0288d1' }} />,
  },
];

const Dashboard = () => {
  const [aqiData, setAqiData] = useState([]);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [aqiError, setAqiError] = useState('');

  useEffect(() => {
    // Mock air quality data for the last 7 days
    const mockAQIData = [
      { date: '2024-03-01', pm25: 45 },
      { date: '2024-03-02', pm25: 52 },
      { date: '2024-03-03', pm25: 48 },
      { date: '2024-03-04', pm25: 55 },
      { date: '2024-03-05', pm25: 42 },
      { date: '2024-03-06', pm25: 38 },
      { date: '2024-03-07', pm25: 35 },
    ];

    setAqiData(mockAQIData);
    setAqiLoading(false);
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {/* Air Quality Trends */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>
              Air Quality Trends
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
              Last 7 days PM2.5 readings
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
              {aqiLoading ? (
                <CircularProgress />
              ) : aqiError ? (
                <Alert severity="error">{aqiError}</Alert>
              ) : aqiData.length === 0 ? (
                <>
                  <BarChartIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No air quality data available
                  </Typography>
                </>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={aqiData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Line type="monotone" dataKey="pm25" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} name="PM2.5 (µg/m³)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
        {/* Energy Consumption */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, minHeight: 280, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>
              Energy Consumption
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
              Current usage by district (MWh)
            </Typography>
            <Box sx={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="district" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2196f3" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        {/* Citizen Recommendations */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, minHeight: 220, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>
              Citizen Recommendations
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Personalized sustainability tips
            </Typography>
            <Box>
              {recommendations.map((rec, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, background: rec.color, borderRadius: 2, p: 2 }}>
                  <Avatar sx={{ bgcolor: 'white', color: '#222', boxShadow: 1, mr: 2, width: 32, height: 32 }}>
                    {rec.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#222' }}>{rec.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{rec.desc}</Typography>
                    <Typography variant="caption" color="text.secondary">{rec.impact}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        {/* District Performance */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, minHeight: 220, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>
              District Performance
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Sustainability rankings by area
            </Typography>
            <List>
              {districtPerformance.map((d) => (
                <ListItem key={d.rank} sx={{ px: 0, py: 1, display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: d.color, color: '#fff', width: 32, height: 32, fontWeight: 700, fontSize: 18, mr: 2 }}>{d.rank}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#222' }}>{d.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Air: {d.air} &nbsp; Energy: {d.energy} &nbsp; Waste: {d.waste}
                    </Typography>
                  </Box>
                  <Chip label={d.score} sx={{ fontWeight: 700, bgcolor: '#f5f5f5', color: '#222', fontSize: 16, minWidth: 44, textAlign: 'center' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    Sustainability Score
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, minHeight: 180, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#222', mb: 0.5 }}>
                Real-time Alerts
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                Latest environmental and infrastructure alerts
              </Typography>
              <List>
                {alerts.map((alert, idx) => (
                  <ListItem key={idx} sx={{ px: 0, py: 1, display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: alert.color + '22', color: alert.color, mr: 2, width: 32, height: 32 }}>
                      {alert.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ color: '#222', fontWeight: 500 }}>{alert.message}</Typography>
                      <Typography variant="caption" color="text.secondary">{alert.time}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 