import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    monthlyRent: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
const response = await axios.post('http://localhost:8082/api/properties/demo', {
        ...formData,
        monthlyRent: parseFloat(formData.monthlyRent)
      });
      
      setSuccess('Property added successfully!');
      setFormData({
        title: '',
        description: '',
        address: '',
        monthlyRent: ''
      });
    } catch (err) {
      console.error('Error adding property:', err);
      setError('Failed to add property. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <HomeIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" color="primary">
            Add New Property
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Property Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            placeholder="e.g., Cozy 2BHK Apartment"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
            sx={{ mb: 3 }}
            placeholder="Describe the property features, amenities, etc."
          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            placeholder="e.g., Sector 15, Noida, UP"
          />

          <TextField
            fullWidth
            label="Monthly Rent (₹)"
            name="monthlyRent"
            type="number"
            value={formData.monthlyRent}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            placeholder="e.g., 15000"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Property'}
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          This is a demo form. In a real application, properties would require approval before being listed.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AddPropertyForm;
