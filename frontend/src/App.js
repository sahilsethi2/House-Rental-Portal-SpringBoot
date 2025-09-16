import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import OwnerDashboard from './components/OwnerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import PropertyList from './components/PropertyList';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/properties" replace />} />
              <Route path="/properties" element={<PropertyList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/owner-dashboard" 
                element={
                  <ProtectedRoute requiredRole="OWNER">
                    <OwnerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer-dashboard" 
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


