import React from 'react';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import { MapContainer, TileLayer, Polygon, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const highTrafficZones = [
  [
    [12.9716, 77.5946],
    [12.975, 77.5946],
    [12.975, 77.6],
    [12.9716, 77.6],
  ],
  [
    [12.935, 77.62],
    [12.94, 77.62],
    [12.94, 77.63],
    [12.935, 77.63],
  ],
];

const lowTrafficZones = [
  [
    [12.98, 77.58],
    [12.985, 77.58],
    [12.985, 77.585],
    [12.98, 77.585],
  ],
  [
    [12.92, 77.65],
    [12.925, 77.65],
    [12.925, 77.655],
    [12.92, 77.655],
  ],
];

const CityMap = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Interactive City Map
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Explore real-time environmental data across Bengaluru districts
      </Typography>
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, minHeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', width: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          City Sustainability Map
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
          Real-time environmental zones
        </Typography>
        <Box sx={{ height: 520, width: '100%', position: 'relative' }}>
          <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: '100%', width: '100%', borderRadius: 12 }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {highTrafficZones.map((zone, idx) => (
              <Polygon key={idx} positions={zone} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }}>
                <LeafletTooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                  High Traffic
                </LeafletTooltip>
              </Polygon>
            ))}
            {lowTrafficZones.map((zone, idx) => (
              <Polygon key={idx} positions={zone} pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.4 }}>
                <LeafletTooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                  Low Traffic
                </LeafletTooltip>
              </Polygon>
            ))}
          </MapContainer>
          {/* Legend as overlay */}
          <Stack direction="row" spacing={2} sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'white', p: 1.5, borderRadius: 2, boxShadow: 1, zIndex: 1000 }}>
            <Chip label="High Traffic" sx={{ bgcolor: 'red', color: 'white', fontWeight: 600 }} />
            <Chip label="Low Traffic" sx={{ bgcolor: 'green', color: 'white', fontWeight: 600 }} />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CityMap;
