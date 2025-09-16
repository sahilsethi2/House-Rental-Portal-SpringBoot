import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RoleSelector from './components/RoleSelector';
import OwnerDashboard from './components/OwnerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
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
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  const handleRoleSelect = (role, name) => {
    setUserRole(role);
    setUserName(name);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          {!userRole ? (
            <RoleSelector onRoleSelect={handleRoleSelect} />
          ) : (
            <Routes>
              <Route 
                path="/*" 
                element={
                  userRole === 'owner' ? 
                    <OwnerDashboard userName={userName} onLogout={handleLogout} /> :
                    <CustomerDashboard userName={userName} onLogout={handleLogout} />
                } 
              />
            </Routes>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

