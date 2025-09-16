import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Approval as ApprovalIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [locationDialog, setLocationDialog] = useState(false);
  const [newLocation, setNewLocation] = useState({ city: '', state: '', zipCode: '' });

  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || !hasRole('ADMIN')) {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [isAuthenticated, hasRole, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      const [propertiesRes, usersRes, locationsRes] = await Promise.all([
        axios.get('http://localhost:8082/api/admin/properties'),
        axios.get('http://localhost:8082/api/admin/users'),
        axios.get('http://localhost:8082/api/admin/locations')
      ]);

      setProperties(propertiesRes.data);
      setUsers(usersRes.data);
      setLocations(locationsRes.data);
      setError('');
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyAction = async (propertyId, action) => {
    try {
      await axios.put(`http://localhost:8082/api/admin/properties/${propertyId}/${action}`);
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action} property:`, error);
      alert(`Failed to ${action} property`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddLocation = async () => {
    try {
      await axios.post('http://localhost:8082/api/admin/locations', newLocation);
      setLocationDialog(false);
      setNewLocation({ city: '', state: '', zipCode: '' });
      fetchAdminData();
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING_APPROVAL': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const pendingProperties = properties.filter(p => p.propertyStatus === 'PENDING_APPROVAL');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <HomeIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Properties
                  </Typography>
                  <Typography variant="h4">
                    {properties.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ApprovalIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Approval
                  </Typography>
                  <Typography variant="h4">
                    {pendingProperties.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {users.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocationIcon color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Locations
                  </Typography>
                  <Typography variant="h4">
                    {locations.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Properties" />
          <Tab label="Users" />
          <Tab label="Locations" />
        </Tabs>
      </Box>

      {/* Properties Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {property.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </Typography>
                  </TableCell>
                  <TableCell>{property.owner?.name}</TableCell>
                  <TableCell>{property.propertyType}</TableCell>
                  <TableCell>
                    {property.location?.city}, {property.location?.state}
                  </TableCell>
                  <TableCell>₹{property.monthlyRent?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={property.propertyStatus || 'PENDING_APPROVAL'}
                      color={getStatusColor(property.propertyStatus || 'PENDING_APPROVAL')}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {property.propertyStatus === 'PENDING_APPROVAL' && (
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handlePropertyAction(property.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handlePropertyAction(property.id, 'reject')}
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
      </TabPanel>

      {/* Users Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Registration Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Locations Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box mb={2}>
          <Button
            variant="contained"
            onClick={() => setLocationDialog(true)}
          >
            Add Location
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Zip Code</TableCell>
                <TableCell>Properties</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.city}</TableCell>
                  <TableCell>{location.state}</TableCell>
                  <TableCell>{location.zipCode}</TableCell>
                  <TableCell>
                    {properties.filter(p => p.location?.id === location.id).length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Add Location Dialog */}
      <Dialog open={locationDialog} onClose={() => setLocationDialog(false)}>
        <DialogTitle>Add New Location</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="City"
            fullWidth
            variant="outlined"
            value={newLocation.city}
            onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="State"
            fullWidth
            variant="outlined"
            value={newLocation.state}
            onChange={(e) => setNewLocation({...newLocation, state: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Zip Code"
            fullWidth
            variant="outlined"
            value={newLocation.zipCode}
            onChange={(e) => setNewLocation({...newLocation, zipCode: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLocation} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
