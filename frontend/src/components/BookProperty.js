import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
// Date picker imports removed for now
import { useAuth } from '../contexts/AuthContext';

const BookProperty = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    checkInDate: null,
    checkOutDate: null,
    numberOfGuests: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [propertyLoading, setPropertyLoading] = useState(true);

  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || !hasRole('CUSTOMER')) {
      navigate('/login');
      return;
    }
    fetchPropertyDetails();
  }, [propertyId, isAuthenticated, hasRole, navigate]);

  const fetchPropertyDetails = async () => {
    try {
      setPropertyLoading(true);
      const response = await axios.get(`http://localhost:8082/api/properties/${propertyId}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Property not found');
    } finally {
      setPropertyLoading(false);
    }
  };

  const calculateTotalCost = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !property) {
      return 0;
    }

    const diffTime = Math.abs(formData.checkOutDate - formData.checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const monthlyRent = property.monthlyRent || 0;
    const dailyRate = monthlyRent / 30; // Approximate daily rate
    
    return Math.round(dailyRate * diffDays);
  };

  const handleChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate dates
    if (!formData.checkInDate || !formData.checkOutDate) {
      setError('Please select both check-in and check-out dates');
      setLoading(false);
      return;
    }

    if (formData.checkInDate >= formData.checkOutDate) {
      setError('Check-out date must be after check-in date');
      setLoading(false);
      return;
    }

    if (formData.checkInDate < new Date()) {
      setError('Check-in date cannot be in the past');
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        propertyId: parseInt(propertyId),
        checkInDate: formData.checkInDate.toISOString().split('T')[0],
        checkOutDate: formData.checkOutDate.toISOString().split('T')[0],
        numberOfGuests: parseInt(formData.numberOfGuests),
        totalCost: calculateTotalCost()
      };

      await axios.post('http://localhost:8082/api/bookings', bookingData);
      
      setSuccess('Booking request submitted successfully! You will be notified once the owner responds.');
      
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (propertyLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 4 }}>
          Property not found
        </Alert>
      </Container>
    );
  }

  const totalCost = calculateTotalCost();

  return (
    <Container component="main" maxWidth="md">
        <Box sx={{ marginTop: 4, marginBottom: 8 }}>
          <Grid container spacing={4}>
            {/* Property Details */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {property.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {property.description}
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="h6" color="primary">
                      ₹{property.monthlyRent?.toLocaleString()}/month
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Security Deposit: ₹{property.securityDeposit?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    📍 {property.location?.city}, {property.location?.state}
                  </Typography>
                  <Typography variant="body2">
                    🏠 {property.propertyType} • {property.bedrooms} beds • {property.bathrooms} baths
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Booking Form */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                  Book This Property
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
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="checkInDate"
                    label="Check-in Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0]
                    }}
                    value={formData.checkInDate ? formData.checkInDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange('checkInDate')(new Date(e.target.value))}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="checkOutDate"
                    label="Check-out Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: formData.checkInDate ? formData.checkInDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                    }}
                    value={formData.checkOutDate ? formData.checkOutDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange('checkOutDate')(new Date(e.target.value))}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="numberOfGuests"
                    label="Number of Guests"
                    type="number"
                    inputProps={{ min: 1, max: 10 }}
                    value={formData.numberOfGuests}
                    onChange={(e) => handleChange('numberOfGuests')(e.target.value)}
                  />

                  <Divider sx={{ my: 3 }} />

                  {/* Cost Summary */}
                  {totalCost > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Cost Summary
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Duration:</Typography>
                        <Typography>
                          {Math.ceil(Math.abs(formData.checkOutDate - formData.checkInDate) / (1000 * 60 * 60 * 24))} days
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="h6">Total Cost:</Typography>
                        <Typography variant="h6" color="primary">
                          ₹{totalCost.toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        *Security deposit will be collected separately
                      </Typography>
                    </Box>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    disabled={loading || !totalCost}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit Booking Request'}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
  );
};

export default BookProperty;
