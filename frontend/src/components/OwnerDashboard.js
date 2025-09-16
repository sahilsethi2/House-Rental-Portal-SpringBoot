import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  CircularProgress
} from '@mui/material';
import { Home, Add, BookOnline, ExitToApp, Business } from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const OwnerDashboard = ({ userName, onLogout }) => {
  const [tabValue, setTabValue] = useState(0);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Add Property Form State
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    address: '',
    monthlyRent: '',
    bedrooms: '',
    bathrooms: '',
    ownerName: userName
  });

  useEffect(() => {
    fetchOwnerData();
  }, [userName]);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const [propertiesRes, bookingsRes] = await Promise.all([
        axios.get(`http://localhost:8082/api/properties/owner/${userName}`),
        axios.get(`http://localhost:8082/api/bookings/owner/${userName}`)
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
      await axios.post('http://localhost:8082/api/properties/owner', {
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
        ownerName: userName
      });
      fetchOwnerData();
    } catch (err) {
      setError('Failed to add property');
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:8082/api/bookings/${bookingId}/status`, { status });
      setSuccess(`Booking ${status.toLowerCase()} successfully!`);
      fetchOwnerData();
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const handleInputChange = (field, value) => {
    setNewProperty(prev => ({ ...prev, [field]: value }));
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
            Property Owner Dashboard - Welcome, {userName}!
          </Typography>
          <Button color="inherit" onClick={onLogout} startIcon={<ExitToApp />}>
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
      </Container>
    </div>
  );
};

export default OwnerDashboard;
