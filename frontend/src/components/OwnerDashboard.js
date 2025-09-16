import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  CardActions
} from '@mui/material';
import { 
  Home, 
  Add, 
  BookOnline, 
  ExitToApp, 
  Business, 
  PhotoCamera, 
  CloudUpload, 
  Edit, 
  Delete,
  Save,
  Cancel
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const OwnerDashboard = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Edit/Delete State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editUploading, setEditUploading] = useState(false);
  
  // Add Property Form State
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    address: '',
    monthlyRent: '',
    bedrooms: '',
    bathrooms: '',
    ownerName: user?.name || '',
    imageUrl: ''
  });

  useEffect(() => {
    if (user) {
      fetchOwnerData();
      setNewProperty(prev => ({ ...prev, ownerName: user.name }));
    }
  }, [user]);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const [propertiesRes, bookingsRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/properties/owner/${user?.name}`),
        axios.get(`http://localhost:8080/api/bookings/owner/${user?.name}`)
      ]);
      setProperties(propertiesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/properties/owner', {
        ...newProperty,
        monthlyRent: parseFloat(newProperty.monthlyRent),
        bedrooms: parseInt(newProperty.bedrooms),
        bathrooms: parseInt(newProperty.bathrooms)
      });
      setSuccess('Property added successfully!');
      setNewProperty({
        title: '',
        description: '',
        address: '',
        monthlyRent: '',
        bedrooms: '',
        bathrooms: '',
        ownerName: user?.name || '',
        imageUrl: ''
      });
      resetImageUpload();
      fetchOwnerData();
    } catch (err) {
      setError('Failed to add property');
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status`, { status });
      setSuccess(`Booking ${status.toLowerCase()} successfully!`);
      fetchOwnerData();
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const handleInputChange = (field, value) => {
    setNewProperty(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:8080/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const fullImageUrl = `http://localhost:8080${response.data.imageUrl}`;
        setNewProperty(prev => ({ ...prev, imageUrl: fullImageUrl }));
        setSuccess('Image uploaded successfully!');
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const resetImageUpload = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setNewProperty(prev => ({ ...prev, imageUrl: '' }));
  };

  // Edit Property Functions
  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setEditFormData({
      title: property.title,
      description: property.description,
      address: property.address,
      monthlyRent: property.monthlyRent.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      imageUrl: property.imageUrl || ''
    });
    setEditImagePreview(property.imageUrl);
    setEditDialogOpen(true);
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = async () => {
    if (!editSelectedFile) return;

    try {
      setEditUploading(true);
      const formData = new FormData();
      formData.append('file', editSelectedFile);

      const response = await axios.post('http://localhost:8080/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const fullImageUrl = `http://localhost:8080${response.data.imageUrl}`;
        setEditFormData(prev => ({ ...prev, imageUrl: fullImageUrl }));
        setSuccess('Image uploaded successfully!');
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setEditUploading(false);
    }
  };

  const handleUpdateProperty = async () => {
    try {
      await axios.put(`http://localhost:8080/api/properties/${editingProperty.id}`, {
        ...editFormData,
        monthlyRent: parseFloat(editFormData.monthlyRent),
        bedrooms: parseInt(editFormData.bedrooms),
        bathrooms: parseInt(editFormData.bathrooms),
        ownerName: user?.name
      });
      setSuccess('Property updated successfully!');
      setEditDialogOpen(false);
      resetEditForm();
      fetchOwnerData();
    } catch (err) {
      setError('Failed to update property');
    }
  };

  const resetEditForm = () => {
    setEditingProperty(null);
    setEditFormData({});
    setEditSelectedFile(null);
    setEditImagePreview(null);
  };

  // Delete Property Functions
  const handleDeleteProperty = (property) => {
    setEditingProperty(property);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProperty = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/properties/${editingProperty.id}`);
      setSuccess('Property deleted successfully!');
      setDeleteDialogOpen(false);
      setEditingProperty(null);
      fetchOwnerData();
    } catch (err) {
      setError('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Business sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Property Owner Dashboard - Welcome, {user?.name}!
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<ExitToApp />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<Home />} label="My Properties" />
            <Tab icon={<Add />} label="Add Property" />
            <Tab icon={<BookOnline />} label="Booking Requests" />
          </Tabs>
        </Box>

        {/* My Properties Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Your Properties ({properties.length})
          </Typography>
          {properties.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No properties added yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on "Add Property" tab to add your first property
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {properties.map((property) => (
                <Grid item xs={12} md={6} lg={4} key={property.id}>
                  <Card elevation={2}>
                    {property.imageUrl && (
                      <Box sx={{ height: 200, overflow: 'hidden' }}>
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    )}
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {property.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {property.description?.substring(0, 100)}...
                      </Typography>
                      <Typography variant="body2">
                        📍 {property.address}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                        ₹{property.monthlyRent?.toLocaleString()}/month
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip label={`${property.bedrooms} beds`} size="small" sx={{ mr: 1 }} />
                        <Chip label={`${property.bathrooms} baths`} size="small" />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditProperty(property)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteProperty(property)}
                      >
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Add Property Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Add New Property
          </Typography>
          <Paper sx={{ p: 4 }}>
            <form onSubmit={handleAddProperty}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Property Title"
                    value={newProperty.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={newProperty.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={newProperty.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </Grid>
                
                {/* Photo Upload Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Property Photo
                  </Typography>
                  <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                    {!imagePreview ? (
                      <>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="photo-upload"
                          type="file"
                          onChange={handleFileSelect}
                        />
                        <label htmlFor="photo-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCamera />}
                            sx={{ mb: 2 }}
                          >
                            Select Photo
                          </Button>
                        </label>
                        <Typography variant="body2" color="text.secondary">
                          Upload a photo of your property (JPG, PNG, etc.)
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={imagePreview}
                            alt="Property preview"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              objectFit: 'contain',
                              borderRadius: '8px'
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                          {!newProperty.imageUrl && (
                            <Button
                              variant="contained"
                              onClick={handleImageUpload}
                              disabled={uploading}
                              startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                            >
                              {uploading ? 'Uploading...' : 'Upload Photo'}
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            onClick={resetImageUpload}
                            disabled={uploading}
                          >
                            Remove Photo
                          </Button>
                        </Box>
                        {newProperty.imageUrl && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            ✅ Photo uploaded successfully!
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Monthly Rent (₹)"
                    type="number"
                    value={newProperty.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Bedrooms"
                    type="number"
                    value={newProperty.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Bathrooms"
                    type="number"
                    value={newProperty.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" size="large">
                    Add Property
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </TabPanel>

        {/* Booking Requests Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Booking Requests ({bookings.length})
          </Typography>
          {bookings.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No booking requests yet
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Check-out</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.booking.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {booking.property?.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {booking.booking.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.booking.customerEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>{booking.booking.checkInDate}</TableCell>
                      <TableCell>{booking.booking.checkOutDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.booking.status}
                          color={
                            booking.booking.status === 'APPROVED' ? 'success' :
                            booking.booking.status === 'REJECTED' ? 'error' : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {booking.booking.status === 'PENDING' && (
                          <Box>
                            <Button
                              size="small"
                              color="success"
                              onClick={() => handleBookingStatusUpdate(booking.booking.id, 'APPROVED')}
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleBookingStatusUpdate(booking.booking.id, 'REJECTED')}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        
        {/* Edit Property Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Property Title"
                  value={editFormData.title || ''}
                  onChange={(e) => handleEditInputChange('title', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={editFormData.description || ''}
                  onChange={(e) => handleEditInputChange('description', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={editFormData.address || ''}
                  onChange={(e) => handleEditInputChange('address', e.target.value)}
                  required
                />
              </Grid>
              
              {/* Photo Update Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Property Photo
                </Typography>
                <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                  {editImagePreview ? (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <img
                          src={editImagePreview}
                          alt="Property preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            borderRadius: '8px'
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="edit-photo-upload"
                          type="file"
                          onChange={handleEditFileSelect}
                        />
                        <label htmlFor="edit-photo-upload">
                          <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
                            Change Photo
                          </Button>
                        </label>
                        {editSelectedFile && !editFormData.imageUrl && (
                          <Button
                            variant="contained"
                            onClick={handleEditImageUpload}
                            disabled={editUploading}
                            startIcon={editUploading ? <CircularProgress size={16} /> : <CloudUpload />}
                          >
                            {editUploading ? 'Uploading...' : 'Upload New Photo'}
                          </Button>
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="edit-photo-upload"
                        type="file"
                        onChange={handleEditFileSelect}
                      />
                      <label htmlFor="edit-photo-upload">
                        <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
                          Add Photo
                        </Button>
                      </label>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Upload a photo of your property
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Monthly Rent (₹)"
                  type="number"
                  value={editFormData.monthlyRent || ''}
                  onChange={(e) => handleEditInputChange('monthlyRent', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  value={editFormData.bedrooms || ''}
                  onChange={(e) => handleEditInputChange('bedrooms', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  value={editFormData.bathrooms || ''}
                  onChange={(e) => handleEditInputChange('bathrooms', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setEditDialogOpen(false); resetEditForm(); }} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProperty} 
              variant="contained" 
              startIcon={<Save />}
              disabled={editUploading}
            >
              Update Property
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Property</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{editingProperty?.title}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteProperty} color="error" variant="contained" startIcon={<Delete />}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
      </Container>
    </div>
  );
};

export default OwnerDashboard;

