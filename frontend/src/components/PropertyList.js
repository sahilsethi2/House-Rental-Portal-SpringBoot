import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip
} from '@mui/material';
import { LocationOn, Bed, Bathtub, Home as HomeIcon, Delete, Person } from '@mui/icons-material';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
const response = await axios.get('http://localhost:8082/api/properties');
      setProperties(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching properties:', err);
setError('Failed to load properties. Make sure the backend is running on port 8082.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;
    
    try {
      setDeleting(true);
await axios.delete(`http://localhost:8082/api/properties/${propertyToDelete.id}`);
      
      // Remove the property from the list
      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
      setError('');
      
      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
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
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        🏠 House Rental Portal - Demo
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        Available Properties ({properties.length})
      </Typography>

      {properties.length === 0 ? (
        <Box textAlign="center" py={8}>
          <HomeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            No properties found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    height: 150,
                    backgroundColor: 'primary.light',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <HomeIcon sx={{ fontSize: 60, color: 'white' }} />
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {property.title || 'Untitled Property'}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {property.address || 'Address not specified'}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <Person sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Owner: {property.ownerName || 'Unknown'}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {property.description && property.description.length > 100 
                      ? `${property.description.substring(0, 100)}...` 
                      : (property.description || 'No description available')
                    }
                  </Typography>

                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ₹{property.monthlyRent?.toLocaleString() || '0'}/month
                  </Typography>

                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Bed sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {property.bedrooms || 0} beds
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Bathtub sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {property.bathrooms || 0} baths
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" gap={1} sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      sx={{ flex: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(property)}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      <Delete sx={{ fontSize: 18 }} />
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Property
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the property "{propertyToDelete?.title}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PropertyList;

