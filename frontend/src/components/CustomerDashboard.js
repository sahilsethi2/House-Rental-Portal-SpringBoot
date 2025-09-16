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
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Divider
} from '@mui/material';
import { Home, BookOnline, ExitToApp, Person, LocationOn, Bed, Bathtub } from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    checkInDate: '',
    checkOutDate: ''
  });

  useEffect(() => {
    if (user) {
      fetchCustomerData();
      setBookingForm(prev => ({
        ...prev,
        customerName: user.name,
        customerEmail: user.email
      }));
    }
  }, [user]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [propertiesRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/properties'),
        axios.get(`http://localhost:8080/api/bookings/customer/${user?.email}`)
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

  const handleBookProperty = (property) => {
    setSelectedProperty(property);
    setBookingForm(prev => ({
      ...prev,
      customerName: user?.name,
      customerEmail: user?.email
    }));
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/bookings', {
        propertyId: selectedProperty.id,
        customerName: bookingForm.customerName,
        customerEmail: bookingForm.customerEmail,
        customerPhone: bookingForm.customerPhone,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate
      });
      setSuccess('Booking submitted successfully! Property owner will review your request.');
      setBookingDialogOpen(false);
      setBookingForm({
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: '',
        checkInDate: '',
        checkOutDate: ''
      });
      fetchCustomerData();
    } catch (err) {
      setError('Failed to submit booking');
    }
  };

  const handleInputChange = (field, value) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
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
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Person sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Customer Dashboard - Welcome, {user?.name}!
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
            <Tab icon={<Home />} label="Browse Properties" />
            <Tab icon={<BookOnline />} label="My Bookings" />
          </Tabs>
        </Box>

        {/* Browse Properties Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Available Properties ({properties.length})
          </Typography>
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property.id}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      height: 200,
                      borderRadius: 1,
                      overflow: 'hidden',
                      mb: 2,
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {property.imageUrl ? (
                      <img
                        src={property.imageUrl}
                        alt={property.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <Box
                      sx={{
                        display: property.imageUrl ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        backgroundColor: 'primary.light',
                        color: 'white'
                      }}
                    >
                      <Home sx={{ fontSize: 60 }} />
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {property.title}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {property.address}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {property.description?.substring(0, 120)}...
                    </Typography>

                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      ₹{property.monthlyRent?.toLocaleString()}/month
                    </Typography>

                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Box display="flex" alignItems="center">
                        <Bed sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                          {property.bedrooms} beds
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Bathtub sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                          {property.bathrooms} baths
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary">
                      Owner: {property.ownerName}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleBookProperty(property)}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* My Bookings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            My Bookings ({bookings.length})
          </Typography>
          {bookings.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No bookings yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse properties and make your first booking!
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Check-out</TableCell>
                    <TableCell>Booking Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.booking.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {booking.property?.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{booking.property?.monthlyRent?.toLocaleString()}/month
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {booking.property?.ownerName}
                        </Typography>
                      </TableCell>
                      <TableCell>{booking.booking.checkInDate}</TableCell>
                      <TableCell>{booking.booking.checkOutDate}</TableCell>
                      <TableCell>{booking.booking.bookingDate}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Container>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Property: {selectedProperty?.title}</DialogTitle>
        <DialogContent>
          {selectedProperty && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Property:</strong> {selectedProperty.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Monthly Rent:</strong> ₹{selectedProperty.monthlyRent?.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                <strong>Owner:</strong> {selectedProperty.ownerName}
              </Typography>
              
              <form onSubmit={handleBookingSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={bookingForm.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={bookingForm.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={bookingForm.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Check-in Date"
                      type="date"
                      value={bookingForm.checkInDate}
                      onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Check-out Date"
                      type="date"
                      value={bookingForm.checkOutDate}
                      onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained">
            Submit Booking Request
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;

