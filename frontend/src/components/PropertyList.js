import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  CardMedia
} from '@mui/material';
import { LocationOn, Bed, Bathtub, Home as HomeIcon, Person, BookOnline } from '@mui/icons-material';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
const response = await axios.get('http://localhost:8080/api/properties');
      setProperties(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching properties:', err);
setError('Failed to load properties. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookProperty = (property) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    // Navigate to booking page or show booking dialog
    console.log('Book property:', property.id);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}
        >
          🏠 House Rental Portal
        </Typography>
        
        <Box>
          {isAuthenticated() ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body1" color="text.secondary">
                Welcome, {user?.name}
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  if (user?.role === 'OWNER') {
                    navigate('/owner-dashboard');
                  } else {
                    navigate('/customer-dashboard');
                  }
                }}
              >
                Dashboard
              </Button>
              <Button variant="outlined" color="error" onClick={logout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="contained" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          Available Properties
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
        </Typography>
      </Box>

      {properties.length === 0 ? (
        <Paper 
          elevation={2} 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            backgroundColor: 'grey.50',
            borderRadius: 3
          }}
        >
          <HomeIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No properties found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for new property listings!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card 
                elevation={4} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8
                  }
                }}
              >
                {/* Image Section */}
                <Box sx={{ position: 'relative' }}>
                  {property.imageUrl ? (
                    <CardMedia
                      component="img"
                      height="220"
                      image={property.imageUrl}
                      alt={property.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <Box
                    className="fallback-icon"
                    sx={{
                      display: property.imageUrl ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 220,
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 80, opacity: 0.7 }} />
                  </Box>
                  
                  {/* Price Badge */}
                  <Chip
                    label={`₹${property.monthlyRent?.toLocaleString() || '0'}/month`}
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Title */}
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {property.title || 'Untitled Property'}
                  </Typography>
                  
                  {/* Location */}
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOn sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {property.address || 'Address not specified'}
                    </Typography>
                  </Box>

                  {/* Owner */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person sx={{ fontSize: 18, mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {property.ownerName || 'Unknown'}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{
                      flexGrow: 1,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {property.description || 'No description available'}
                  </Typography>

                  {/* Room Details */}
                  <Box display="flex" justifyContent="space-around" mb={3}>
                    <Box display="flex" alignItems="center" sx={{ 
                      backgroundColor: 'grey.100', 
                      px: 2, 
                      py: 1, 
                      borderRadius: 2,
                      minWidth: '80px',
                      justifyContent: 'center'
                    }}>
                      <Bed sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight={600}>
                        {property.bedrooms || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ 
                      backgroundColor: 'grey.100', 
                      px: 2, 
                      py: 1, 
                      borderRadius: 2,
                      minWidth: '80px',
                      justifyContent: 'center'
                    }}>
                      <Bathtub sx={{ fontSize: 20, mr: 1, color: 'secondary.main' }} />
                      <Typography variant="body2" fontWeight={600}>
                        {property.bathrooms || 0}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" gap={1} sx={{ mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<BookOnline />}
                      onClick={() => handleBookProperty(property)}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PropertyList;


