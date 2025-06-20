import axios from 'axios';
import { useEffect, useState } from 'react';

const Water = () => {
  const [waterData, setWaterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://urban-sustainability-dashboard.onrender.com';
        const res = await axios.get(`${apiUrl}/api/water`);
        if (res.data && res.data.length > 0) {
          setWaterData(res.data[0]);
        } else {
          setWaterData(null);
        }
      } catch (err) {
        setError('Error fetching water data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default Water;
