import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    monthlyRent: '',
    securityDeposit: '',
    address: '',
    locationId: ''
  });
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || !hasRole('OWNER')) {
      navigate('/login');
      return;
    }
    fetchLocations();
  }, [isAuthenticated, hasRole, navigate]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/locations/public');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to load locations');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/properties', {
        ...formData,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit),
        locationId: parseInt(formData.locationId)
      });

      setSuccess('Property added successfully! It will be visible after admin approval.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        monthlyRent: '',
        securityDeposit: '',
        address: '',
        locationId: ''
      });

      setTimeout(() => {
        navigate('/owner/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error adding property:', error);
      setError(error.response?.data || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 8, marginBottom: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Add New Property
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="title"
                  label="Property Title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    name="propertyType"
                    value={formData.propertyType}
                    label="Property Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="APARTMENT">Apartment</MenuItem>
                    <MenuItem value="HOUSE">House</MenuItem>
                    <MenuItem value="CONDO">Condo</MenuItem>
                    <MenuItem value="STUDIO">Studio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Location</InputLabel>
                  <Select
                    name="locationId"
                    value={formData.locationId}
                    label="Location"
                    onChange={handleChange}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.city}, {location.state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="bedrooms"
                  label="Bedrooms"
                  type="number"
                  inputProps={{ min: 0, max: 10 }}
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="bathrooms"
                  label="Bathrooms"
                  type="number"
                  inputProps={{ min: 0, max: 10 }}
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="monthlyRent"
                  label="Monthly Rent (₹)"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formData.monthlyRent}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="securityDeposit"
                  label="Security Deposit (₹)"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formData.securityDeposit}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address"
                  label="Complete Address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Property'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/owner/dashboard')}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddProperty;

