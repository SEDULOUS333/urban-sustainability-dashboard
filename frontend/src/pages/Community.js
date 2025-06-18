import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';

const Community = () => {
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/community');
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching community posts:', err);
      setError('Failed to load community posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      setError('Message cannot be empty');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to post messages. Please log in and try again.');
      return;
    }

    try {
      console.log('Sending message with token:', token);
      const response = await axios.post(
        'http://localhost:5000/api/community',
        { message: message.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Message sent successfully:', response.data);
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setMessage('');
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || 'Failed to send message. Please try again.');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection and try again.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Failed to send message. Please try again.');
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust as needed for specific format
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    } else if (name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    return '??';
  };

  return (
    <Box
      sx={{
        p: 3,
        flexGrow: 1,
        backgroundColor: (theme) => theme.palette.grey[100],
        minHeight: '100vh',
      }}
    >
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Community Hub
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Connect, share ideas, and collaborate on sustainability initiatives.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            sx={{ height: '56px' }} // Align height with TextField
          >
            Send
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Community Feed
        </Typography>

        {loading ? (
          <Typography>Loading posts...</Typography>
        ) : posts.length === 0 ? (
          <Typography color="text.secondary">No posts yet. Be the first to share something!</Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {posts.map((post) => (
              <Box key={post._id} sx={{ mb: 2 }}>
                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {getInitials(post.userName)}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="subtitle1"
                        color="text.primary"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {post.userName}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {post.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 0.5 }}
                        >
                          {formatTimestamp(post.createdAt)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ mt: 1, ml: 7 }} /> {/* Indent divider */}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Community;
