// LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// ----------------------------------
// 1. Material UI Theme
// ----------------------------------
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#357AE8', // Blue
    },
    background: {
      default: '#F8F9FA', // Light gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827', // Darker text
      secondary: '#6B7280', // Gray text
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px #6B7280)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px #6B7280)',
        },
      },
    },
  },
});

export default function LandingPage() {
  const navigate = useNavigate();

  // Define the actions as tiles with titles, descriptions, and navigation handlers.
  const actions = [
    {
      title: 'Review Campaign Dashboard',
      description: 'Check the latest metrics and insights.',
      onClick: () => navigate('/dashboard'),
    },
    {
      title: 'View Active Campaigns',
      description: 'See all currently running campaigns.',
      onClick: () => navigate('/active-campaigns'),
    },
    {
      title: 'Behaviors in Campaign Segments',
      description: 'Explore how different segments engage with campaigns.',
      onClick: () => navigate('/campaign-segments'),
    },
    {
      title: 'Generate New Campaign for Social Media',
      description: 'Start a new multi-channel campaign for social media.',
      onClick: () => navigate('/campaign-builder', { state: { step: 2 } }),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select an action below to get started
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {actions.map((action, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <CardActionArea onClick={action.onClick}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {action.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
