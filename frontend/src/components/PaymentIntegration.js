import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';

const PaymentIntegration = ({ open, onClose, bookingDetails, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Razorpay integration would go here
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      if (Math.random() > 0.1) { // 90% success rate for demo
        onPaymentSuccess({
          paymentId: 'pay_' + Date.now(),
          amount: bookingDetails.totalCost,
          status: 'SUCCESS'
        });
        onClose();
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Payment</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Booking Summary
          </Typography>
          <Typography variant="body1">
            Property: {bookingDetails.propertyTitle}
          </Typography>
          <Typography variant="body1">
            Check-in: {bookingDetails.checkInDate}
          </Typography>
          <Typography variant="body1">
            Check-out: {bookingDetails.checkOutDate}
          </Typography>
          <Typography variant="body1">
            Guests: {bookingDetails.numberOfGuests}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h6" color="primary">
            Total Amount: ₹{bookingDetails.totalCost?.toLocaleString()}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          This is a demo payment integration. In production, this would integrate with Razorpay.
        </Alert>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handlePayment} 
          variant="contained" 
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Processing...' : `Pay ₹${bookingDetails.totalCost?.toLocaleString()}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentIntegration;

