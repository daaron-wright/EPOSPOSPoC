import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  IconButton,
  Link
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  BarChart as AnalyticsIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';

const AIOnboardingModal = ({ showNotification }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [aiPreferences, setAiPreferences] = useState({
    enableAIRecommendations: true,
    enableDataAnalysis: true,
    enableContentGeneration: true,
  });

  const steps = [
    'Welcome to AI-Assisted Marketing',
    'How We Use AI',
    'Your Data',
    'Your Choices',
    'Completion'
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    // Save preferences to local storage or your backend
    localStorage.setItem('aiPreferences', JSON.stringify(aiPreferences));
    
    showNotification('AI preferences saved successfully', 'success');
    navigate('/');
  };

  const handleSettingChange = (event) => {
    setAiPreferences({
      ...aiPreferences,
      [event.target.name]: event.target.checked
    });
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 3,
          display: 'flex',
          alignItems: 'center'
        }}>
          <AIIcon sx={{ mr: 2, fontSize: '2rem' }} />
          <Typography variant="h5" component="h1">
            AI Features Guide
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: '300px' }}>
            {activeStep === 0 && (
              <WelcomeStep />
            )}
            
            {activeStep === 1 && (
              <HowWeUseAIStep />
            )}
            
            {activeStep === 2 && (
              <YourDataStep />
            )}
            
            {activeStep === 3 && (
              <YourChoicesStep 
                aiPreferences={aiPreferences} 
                handleSettingChange={handleSettingChange} 
              />
            )}
            
            {activeStep === 4 && (
              <CompletionStep />
            )}
          </Box>
        </Box>

        <Divider />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={handleFinish}
              endIcon={<CheckIcon />}
            >
              Finish
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
            >
              Continue
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

// Individual step components
const WelcomeStep = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Welcome to AI-Assisted Marketing
    </Typography>
    
    <Typography paragraph>
      Our campaign builder uses artificial intelligence to help you create more effective 
      marketing campaigns. This guide will explain how AI is used in this application, 
      what data is analyzed, and how you can control these features.
    </Typography>
    
    <Typography paragraph>
      AI features in this application:
    </Typography>
    
    <List>
      <ListItem>
        <ListItemIcon><GroupIcon color="primary" /></ListItemIcon>
        <ListItemText 
          primary="Customer Segmentation" 
          secondary="Automatically group your customers based on their behaviors and preferences" 
        />
      </ListItem>
      
      <ListItem>
        <ListItemIcon><EditIcon color="primary" /></ListItemIcon>
        <ListItemText 
          primary="Content Generation" 
          secondary="Create channel-specific marketing content tailored to your audience" 
        />
      </ListItem>
      
      <ListItem>
        <ListItemIcon><AnalyticsIcon color="primary" /></ListItemIcon>
        <ListItemText 
          primary="Campaign Optimization" 
          secondary="Get recommendations for timing, channels, and content based on performance data" 
        />
      </ListItem>
    </List>
  </Box>
);

const HowWeUseAIStep = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      How We Use AI
    </Typography>
    
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Content Generation
      </Typography>
      <Typography paragraph>
        When you create campaigns, AI helps generate tailored content for different channels:
      </Typography>
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
        <Typography variant="body2">
          <strong>Example:</strong> For your "High-Value Customers" segment, AI might suggest 
          email subject lines like "Exclusive Preview: New Collection Just for You" based on 
          what has worked well for similar customer groups.
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        <strong>Note:</strong> All AI-generated content is clearly labeled, and you always 
        have the option to edit or replace it completely.
      </Typography>
    </Box>
    
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Data Analysis
      </Typography>
      <Typography paragraph>
        AI helps analyze your customer data to identify patterns and segments:
      </Typography>
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
        <Typography variant="body2">
          <strong>Example:</strong> AI might identify a "Discount Shoppers" segment by analyzing 
          purchase frequency, average order value, and response to previous promotions.
        </Typography>
      </Box>
    </Box>
    
    <Typography paragraph>
      All AI features use secure techniques and do not share your data with external services 
      beyond what's necessary for the requested functionality.
    </Typography>
  </Box>
);

const YourDataStep = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Your Data
    </Typography>
    
    <Typography paragraph>
      Understanding what data is used to power AI features:
    </Typography>
    
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <SecurityIcon color="primary" sx={{ mr: 1 }} />
        Data Security
      </Typography>
      <Typography paragraph>
        When generating campaign content, we send the following data to our AI provider:
      </Typography>
      <List dense disablePadding>
        <ListItem>
          <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
          <ListItemText primary="Segment characteristics (e.g., 'High-value customers')" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
          <ListItemText primary="Behavioral patterns (e.g., 'Frequent mobile shoppers')" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CloseIcon color="error" fontSize="small" /></ListItemIcon>
          <ListItemText primary="We NEVER send personally identifiable information" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CloseIcon color="error" fontSize="small" /></ListItemIcon>
          <ListItemText primary="We NEVER send individual customer records" />
        </ListItem>
      </List>
    </Box>
    
    <Typography variant="subtitle1" gutterBottom>
      Data Used for Segment Analysis:
    </Typography>
    <List>
      <ListItem>
        <ListItemIcon><CheckIcon color="primary" fontSize="small" /></ListItemIcon>
        <ListItemText 
          primary="Purchase history (frequency, value, products)" 
          secondary="Used to identify spending patterns and product preferences" 
        />
      </ListItem>
      <ListItem>
        <ListItemIcon><CheckIcon color="primary" fontSize="small" /></ListItemIcon>
        <ListItemText 
          primary="Campaign engagement data" 
          secondary="How customers have responded to previous campaigns" 
        />
      </ListItem>
      <ListItem>
        <ListItemIcon><CheckIcon color="primary" fontSize="small" /></ListItemIcon>
        <ListItemText 
          primary="Channel preferences" 
          secondary="Which communication channels customers engage with most" 
        />
      </ListItem>
    </List>
  </Box>
);

const YourChoicesStep = ({ aiPreferences, handleSettingChange }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Your AI Preferences
    </Typography>
    
    <Typography paragraph>
      You have control over how AI is used in your campaigns. Customize your experience 
      by enabling or disabling specific AI features:
    </Typography>
    
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <FormControlLabel
        control={
          <Switch
            checked={aiPreferences.enableAIRecommendations}
            onChange={handleSettingChange}
            name="enableAIRecommendations"
            color="primary"
          />
        }
        label="AI Recommendations"
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mb: 2 }}>
        Get AI-powered suggestions for campaign timing, audience targeting, and channel selection
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={aiPreferences.enableDataAnalysis}
            onChange={handleSettingChange}
            name="enableDataAnalysis"
            color="primary"
          />
        }
        label="Advanced Data Analysis"
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mb: 2 }}>
        Use AI to analyze customer segments and identify behavioral patterns
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={aiPreferences.enableContentGeneration}
            onChange={handleSettingChange}
            name="enableContentGeneration"
            color="primary"
          />
        }
        label="AI Content Generation"
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
        Let AI help create marketing content for different channels and audiences
      </Typography>
    </Paper>
    
    <Typography variant="body2" color="text.secondary">
      You can change these preferences at any time from the Settings menu.
      Even when AI features are enabled, you'll always have the final say on all campaign decisions.
    </Typography>
  </Box>
);

// Updated CompletionStep to match the screenshot design
const CompletionStep = () => {
  const navigate = useNavigate();
  
  // Navigate to dashboard to view active campaigns
  const handleViewCampaigns = () => {
    navigate('/dashboard');
  };
  
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      {/* Arrow circle icon matching the screenshot */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '2px solid #3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 4
        }}
      >
        <ArrowForwardIcon sx={{ fontSize: 36, color: '#3B82F6' }} />
      </Box>
      
      {/* Heading and subtitle matching the screenshot */}
      <Typography variant="h4" gutterBottom>
        Onboarding Complete!
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your training has been successfully completed.
      </Typography>
      
      {/* Button matching the screenshot */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleViewCampaigns}
        sx={{ 
          borderRadius: 28,
          px: 4,
          py: 1.2,
          textTransform: 'none',
          fontSize: '1rem'
        }}
      >
        View Active Campaigns
      </Button>
    </Box>
  );
};

export default AIOnboardingModal;