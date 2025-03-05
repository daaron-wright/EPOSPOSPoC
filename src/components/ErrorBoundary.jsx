import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <WarningIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Something went wrong loading this component
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {this.state.error && this.state.error.toString()}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => this.setState({ hasError: false })}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;