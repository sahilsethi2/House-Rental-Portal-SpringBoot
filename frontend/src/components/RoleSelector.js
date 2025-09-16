import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Home, Person, Business } from '@mui/icons-material';

const RoleSelector = ({ onRoleSelect }) => {
  const [ownerName, setOwnerName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const handleOwnerLogin = () => {
    if (ownerName.trim()) {
      onRoleSelect('owner', ownerName.trim());
    }
  };

  const handleCustomerLogin = () => {
    if (customerName.trim() && customerEmail.trim()) {
      onRoleSelect('customer', customerName.trim(), customerEmail.trim());
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Box textAlign="center" mb={6}>
        <Home sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          🏠 House Rental Portal
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose your role to get started
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Property Owner Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Business sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Property Owner
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                • Add and manage your properties
                <br />
                • View booking requests
                <br />
                • Approve or decline bookings
                <br />
                • Track your rental income
              </Typography>
              
              <TextField
                fullWidth
                label="Enter Your Name"
                variant="outlined"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                sx={{ mt: 2, mb: 3 }}
                placeholder="e.g., John Smith"
              />
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleOwnerLogin}
                disabled={!ownerName.trim()}
                sx={{ px: 4, py: 1.5 }}
              >
                Continue as Owner
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Customer Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Person sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Customer
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                • Browse available properties
                <br />
                • View detailed property information
                <br />
                • Book properties online
                <br />
                • Manage your bookings
              </Typography>
              
              <TextField
                fullWidth
                label="Enter Your Name"
                variant="outlined"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
                placeholder="e.g., Jane Doe"
              />
              
              <TextField
                fullWidth
                label="Enter Your Email"
                variant="outlined"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="e.g., jane@email.com"
              />
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleCustomerLogin}
                disabled={!customerName.trim() || !customerEmail.trim()}
                sx={{ px: 4, py: 1.5 }}
              >
                Continue as Customer
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, p: 2, textAlign: 'center', backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Demo Mode:</strong> This is a demonstration version. In production, 
          this would be replaced with proper user authentication and registration.
        </Typography>
      </Box>
    </Container>
  );
};

export default RoleSelector;

