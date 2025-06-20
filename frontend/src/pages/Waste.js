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
  Stack,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DeleteIcon from '@mui/icons-material/Delete';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DryIcon from '@mui/icons-material/Dry';
import axios from 'axios';

const Waste = () => {
  const [wasteData, setWasteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://urban-sustainability-dashboard.onrender.com';
        const res = await axios.get(`${apiUrl}/api/waste`);
        if (res.data && res.data.length > 0) {
          setWasteData(res.data[0]);
        } else {
          setWasteData(null);
        }
      } catch (err) {
        setError('Error fetching waste data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = [
    { name: 'Wet Waste', value: 1000 },
    { name: 'Dry Waste', value: 1500 },
  ];

  const COLORS = ['#4caf50', '#ff9800'];

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
        Waste Management
      </Typography>

      <Grid container spacing={3}>
        {/* Total Waste Generated */}
        <Grid>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <DeleteIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Waste
                  </Typography>
                  <Typography variant="h4">
                    {wasteData.totalWaste} tons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generated this month
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recycled Waste */}
        <Grid>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <RecyclingIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Recycled Waste
                  </Typography>
                  <Typography variant="h4">
                    {wasteData.recycledWaste} tons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {wasteData.recyclingRate}% recycling rate
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Wet Waste */}
        <Grid>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <WaterDropIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Wet Waste
                  </Typography>
                  <Typography variant="h4">
                    {wasteData.wetWaste} tons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Organic waste
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Dry Waste */}
        <Grid>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <DryIcon sx={{ fontSize: 40, color: '#ff9800' }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Dry Waste
                  </Typography>
                  <Typography variant="h4">
                    {wasteData.dryWaste} tons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recyclable waste
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Waste Distribution Chart */}
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Waste Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width={600} height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Trend Chart */}
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Waste Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width={400}height="100%">
                <BarChart data={wasteData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total Waste" fill="#1976d2" />
                  <Bar dataKey="recycled" name="Recycled Waste" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Waste; 