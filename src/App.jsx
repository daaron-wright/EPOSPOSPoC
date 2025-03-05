import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  IconButton, 
  Button, 
  Tooltip, 
  Badge, 
  Snackbar, 
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Settings, 
  Campaign as CampaignIcon, 
  Info as InfoIcon,
  Help as HelpIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import GenAICampaignBuilder from './components/GenAICampaignBuilder';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AIOnboardingModal from './components/AIOnboardingModal';

function App() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Global notification system that can be used by any component
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({
      ...notification,
      open: false
    });
  };

  // Loading screen
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Box 
          component="img"
          src="/epos-logo.png"
          alt="EPOS Logo"
          sx={{ height: 80, mb: 4 }}
        />
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Router>
      {/* Global feedback system */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Outer wrapper with full height and light-gray background */}
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
        {/* Top Bar */}
        <TopBar />
        
        {/* Main Content Area */}
        <Box sx={{ maxWidth: '1280px', mx: 'auto', width: '100%', px: { xs: 2, md: 3 }, py: 3 }}>
          <Routes>
            <Route path="/" element={<LandingPage showNotification={showNotification} />} />
            <Route path="/dashboard" element={<Dashboard showNotification={showNotification} />} />
            <Route
              path="/campaign-builder"
              element={
                <GenAICampaignBuilder
                  showNotification={showNotification}
                  apiKey={import.meta.env.VITE_OPENAI_API_KEY || 'demo-api-key'}
                />
              }
            />
            <Route path="/ai-help" element={<AIOnboardingModal showNotification={showNotification} />} />
            {/* Fallback route - redirect to dashboard */}
            <Route path="*" element={<Navigate />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

/**
 * Navigate component
 * Simple component to handle 404s and redirects
 */
function Navigate() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </Box>
  );
}

/**
 * TopBar
 * ------
 * Places the logo on the left and the Home, Create Campaign, and
 * Settings icon on the right. All wrapped in a white banner with a subtle border.
 */
function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [aiHelpOpen, setAiHelpOpen] = useState(false);

  const handleHome = () => {
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleCreateCampaign = () => {
    console.log('Navigating to campaign builder...');
    try {
      // Primary navigation method
      navigate('/campaign-builder');
      
      // Set a timeout to check if navigation succeeded
      setTimeout(() => {
        if (window.location.pathname !== '/campaign-builder') {
          console.warn('Navigation via React Router may have failed, trying direct method');
          window.location.href = '/campaign-builder';
        }
      }, 300);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback direct navigation
      window.location.href = '/campaign-builder';
    }
  };

  const handleAIHelp = () => {
    navigate('/ai-help');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  // Determine if we're on the campaign builder page
  const isOnCampaignBuilder = location.pathname === '/campaign-builder';

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid #E5E7EB',
        px: { xs: 2, md: 6 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left side: EPOS logo (clickable to home) */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          cursor: 'pointer'
        }}
        onClick={handleHome}
      >
        <Box
          component="img"
          src="/epos-logo.png"
          alt="EPOS Logo"
          sx={{ height: 40 }}
        />
      </Box>

      {/* Right side: Navigation buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
        <Tooltip title="Dashboard">
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleDashboard}
            sx={{
              borderRadius: '9999px',
              textTransform: 'none',
              fontWeight: 500,
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            Dashboard
          </Button>
        </Tooltip>
        
        <Tooltip title="Create a new marketing campaign with AI assistance">
          <Button
            variant="contained"
            startIcon={<CampaignIcon />}
            onClick={handleCreateCampaign}
            disabled={isOnCampaignBuilder}
            sx={{
              borderRadius: '9999px',
              textTransform: 'none',
              fontWeight: 500,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Create Campaign
          </Button>
        </Tooltip>

        <Tooltip title="Learn about AI features in this application">
          <IconButton onClick={handleAIHelp} sx={{ color: 'primary.main' }}>
            <Badge color="secondary" variant="dot" invisible={false}>
              <HelpIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={handleSettings} sx={{ color: 'text.secondary' }}>
          <Settings />
        </IconButton>
      </Box>

      {aiHelpOpen && <AIOnboardingModal open={aiHelpOpen} onClose={() => setAiHelpOpen(false)} />}
    </Box>
  );
}

export default App;