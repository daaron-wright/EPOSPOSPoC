import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon, 
  ArrowBack as ArrowBackIcon, 
  Close as CloseIcon,
  Check as CheckIcon,
  Image as ImageIcon,
  TextFields as TextFieldsIcon,
  Star as StarIcon
} from '@mui/icons-material';

// =============================================================================
// GenAI Campaign Builder Component
// -----------------------------------------------------------------------------
function GenAICampaignBuilder({ showNotification, apiKey, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // States for campaign data
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [channelContent, setChannelContent] = useState({});

  // Available audiences
  const audienceSegments = [
    {
      id: 'high-value',
      name: 'High-Value Customers',
      count: 252,
      characteristics: [
        'Average order: $905+',
        'High purchase value',
        'Premium buyers'
      ],
      behaviors: [
        'Large transactions',
        'Multiple categories',
        'Regular shopping'
      ],
      suggestion: 'Premium Rewards'
    },
    {
      id: 'budget',
      name: 'Budget Shoppers',
      count: 373,
      characteristics: [
        'Average order: below $905',
        'Low spending',
        'Price sensitive'
      ],
      behaviors: [
        'Discount searches',
        'Infrequent purchases',
        'Bargain hunting'
      ],
      suggestion: 'Discount Offers'
    }
  ];

  // Available channels
  const availableChannels = [
    { id: 'email', name: 'Email' },
    { id: 'sms', name: 'SMS' },
    { id: 'social', name: 'Social Media' },
    { id: 'push', name: 'Push Notification' },
    { id: 'inapp', name: 'In-App Message' }
  ];

  // Handle audience selection
  const handleSelectAudience = (audienceId) => {
    setSelectedAudience(audienceId);
  };

  // Handle channel selection
  const handleChannelToggle = (channelId) => {
    if (selectedChannels.includes(channelId)) {
      setSelectedChannels(selectedChannels.filter(id => id !== channelId));
    } else {
      setSelectedChannels([...selectedChannels, channelId]);
    }
  };

  // Handle content update for a channel
  const handleContentUpdate = (channelId, field, value) => {
    setChannelContent(prev => ({
      ...prev,
      [channelId]: {
        ...(prev[channelId] || {}),
        [field]: value
      }
    }));
  };

  // Generate campaign with AI
  const generateCampaign = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Audience-specific campaign details
      const selectedAudienceData = audienceSegments.find(a => a.id === selectedAudience);
      
      if (selectedAudienceData) {
        // Set generated campaign details
        setCampaignDetails({
          name: `${selectedAudienceData.suggestion} Campaign`,
          description: `Special campaign designed for our ${selectedAudienceData.id === 'high-value' ? 'high-value' : 'budget-conscious'} customers`,
          targetMetrics: '20% increase in engagement',
          duration: '30 days',
          predictedEngagement: selectedAudienceData.id === 'high-value' ? '85%' : '65%',
          scheduledDate: '3/3/2025',
          cta: 'Shop Now',
          keyBenefits: ['Increased customer loyalty', 'Higher conversion rates']
        });
        
        // Set recommended channels
        setSelectedChannels(selectedAudienceData.id === 'high-value' 
          ? ['email', 'sms', 'social', 'push', 'inapp'] 
          : ['email', 'sms', 'social']);
        
        // Set generated content for each channel
        const generatedContent = {};
        
        // Email content
        generatedContent.email = {
          headline: `Special Offer - Email`,
          message: `Exclusive deal for ${selectedAudienceData.name}! Check out our latest offers tailored just for you.`,
          cta: 'Shop Now',
          bestTime: selectedAudienceData.id === 'high-value' ? '10 AM' : '3 PM',
          engagement: selectedAudienceData.id === 'high-value' ? '35%' : '28%'
        };
        
        // SMS content
        generatedContent.sms = {
          headline: `Special Offer - SMS`,
          message: `Exclusive deal for ${selectedAudienceData.id === 'high-value' ? 'High-Value' : 'Budget'} Customers`,
          cta: 'Shop Now',
          bestTime: '2 PM',
          engagement: selectedAudienceData.id === 'high-value' ? '25%' : '20%'
        };
        
        // Social Media content
        generatedContent.social = {
          headline: `Social Media Offer`,
          message: `Special promotion for our valued customers! Limited time only.`,
          cta: 'Learn More',
          bestTime: '5 PM',
          engagement: selectedAudienceData.id === 'high-value' ? '40%' : '32%'
        };
        
        // Push Notification content
        generatedContent.push = {
          headline: `New Offer Alert!`,
          message: `Tap to see exclusive deals for ${selectedAudienceData.name}.`,
          cta: 'View Offers',
          bestTime: '9 AM',
          engagement: '22%'
        };
        
        // In-App Message content
        generatedContent.inapp = {
          headline: `Special In-App Offer`,
          message: `We've created special offers just for you!`,
          cta: 'Explore',
          bestTime: '11 AM',
          engagement: '30%'
        };
        
        setChannelContent(generatedContent);
      }
      
      // Move to review step after generation
      setStep(3);
    } catch (error) {
      console.error('Error generating campaign:', error);
      setError('Failed to generate campaign. Please try again.');
      showNotification('Failed to generate campaign content', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Launch campaign
  const launchCampaign = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to launch campaign
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification(
        `Campaign "${campaignDetails.name}" has been successfully launched!`,
        'success'
      );
      
      // Move to completion step
      setStep(4);
    } catch (error) {
      console.error('Error launching campaign:', error);
      setError('Failed to launch campaign. Please try again.');
      setIsLoading(false);
      showNotification('Failed to launch campaign', 'error');
    }
  };

  // Go to dashboard to view campaigns
  const viewCampaigns = () => {
    navigate('/dashboard');
  };

  // Render audience selection step
  const renderAudienceSelection = () => {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Target Audience
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {audienceSegments.length} segments identified
        </Typography>
        
        <Grid container spacing={3}>
          {audienceSegments.map((audience) => (
            <Grid item xs={12} md={6} key={audience.id}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: selectedAudience === audience.id ? 'primary.main' : 'divider',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectAudience(audience.id)}
              >
                {selectedAudience === audience.id && (
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                  </Box>
                )}
                
                <Typography variant="h6" gutterBottom>
                  {audience.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {audience.count} customers
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Characteristics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {audience.characteristics.map((characteristic, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 0.5 }}>
                      <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                        • {characteristic}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Recent Behaviors
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {audience.behaviors.map((behavior, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 0.5 }}>
                      <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                        • {behavior}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  AI Suggestion
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  {audience.suggestion}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Render content generation step
  const renderContentGeneration = () => {
    if (isGenerating) {
      return (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <CircularProgress size={50} sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom>
            Generating Campaign
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Creating personalized content and visuals...
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <ImageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">Generating Images</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <TextFieldsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">Creating Copy</Typography>
            </Box>
          </Box>
        </Box>
      );
    }
    
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6
          }}
        >
          <Box sx={{ mb: 3 }}>
            <StarIcon color="primary" sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h5" gutterBottom>
            Ready to Generate
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
            Our AI will create personalized content based on your selected audience
          </Typography>
          
          <Button 
            variant="contained"
            size="large"
            onClick={generateCampaign}
            sx={{ px: 4 }}
          >
            Generate Campaign
          </Button>
        </Box>
      </Box>
    );
  };

  // Render review and launch step
  const renderReviewAndLaunch = () => {
    const selectedAudienceData = audienceSegments.find(a => a.id === selectedAudience);
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Review Generated Campaign
        </Typography>
        
        <Grid container spacing={3}>
          {/* Campaign Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Campaign Details</Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Campaign Name</Typography>
              <Typography variant="h6" gutterBottom>{campaignDetails?.name}</Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Key Benefits</Typography>
              <Box sx={{ my: 1 }}>
                <CheckIcon color="success" fontSize="small" />
              </Box>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Target Audience</Typography>
              <Typography variant="body1" gutterBottom>
                {selectedAudienceData?.name} ({selectedAudienceData?.count} customers)
              </Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Campaign Duration</Typography>
              <Typography variant="body1" gutterBottom>{campaignDetails?.duration}</Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Target Metrics</Typography>
              <Typography variant="body1" gutterBottom>{campaignDetails?.targetMetrics}</Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Description</Typography>
              <Typography variant="body1" gutterBottom>{campaignDetails?.description}</Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Call to Action</Typography>
              <Button variant="contained" size="small" sx={{ mt: 1 }}>
                {campaignDetails?.cta}
              </Button>
            </Box>
          </Grid>
          
          {/* Campaign Performance */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Campaign Performance</Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Predicted Engagement</Typography>
              <Typography 
                variant="h5" 
                color="success.main" 
                gutterBottom
              >
                {campaignDetails?.predictedEngagement}
              </Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Recommended Channels</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 3 }}>
                {availableChannels.map(channel => (
                  <Chip 
                    key={channel.id}
                    label={channel.name}
                    color={selectedChannels.includes(channel.id) ? "primary" : "default"}
                  />
                ))}
              </Box>
              
              <Typography variant="subtitle2">Scheduled Launch Date</Typography>
              <Typography variant="body1">{campaignDetails?.scheduledDate}</Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Channel Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Select Channels to Include</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Choose which channels you want to use in this campaign:
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {availableChannels.map(channel => (
              <FormControlLabel
                key={channel.id}
                control={
                  <Checkbox 
                    checked={selectedChannels.includes(channel.id)} 
                    onChange={() => handleChannelToggle(channel.id)}
                  />
                }
                label={channel.name}
              />
            ))}
          </Box>
        </Box>
        
        {/* Preview Email Content */}
        {selectedChannels.includes('email') && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Email Preview</Typography>
            <Paper sx={{ p: 3, mb: 2, maxWidth: 600 }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>From:</Typography>
                <Typography variant="body2">Your Brand</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Subject:</Typography>
                <Typography variant="body2">Special Offer - Email</Typography>
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* Preview SMS Content */}
        {selectedChannels.includes('sms') && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>SMS Preview</Typography>
            <Box 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                p: 2, 
                borderRadius: 2,
                maxWidth: 280
              }}
            >
              <Typography variant="body2">
                {channelContent.sms?.message} <strong>{channelContent.sms?.cta}</strong>
              </Typography>
            </Box>
          </Box>
        )}
        
        {/* Preview Social Media Content */}
        {selectedChannels.includes('social') && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Social Media Preview</Typography>
            <Paper sx={{ p: 2, maxWidth: 400 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Typography>YB</Typography>
                </Box>
                <Typography variant="subtitle2">Your Brand</Typography>
              </Box>
              
              <Box 
                sx={{ 
                  bgcolor: 'grey.100', 
                  height: 180, 
                  borderRadius: 1, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary">Image Preview</Typography>
              </Box>
              
              <Typography variant="body1" gutterBottom>
                {selectedAudienceData?.id === 'high-value' 
                  ? "Exclusive deal for High-Value Customers" 
                  : "Special offers for our valued customers!"}
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Box sx={{ width: 24, height: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>❤️</Box>
                <Box sx={{ width: 24, height: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>💬</Box>
                <Box sx={{ width: 24, height: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>↗️</Box>
              </Box>
              
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ mt: 2, cursor: 'pointer' }}
              >
                Shop Now
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
    );
  };
  
  // Render completion step
  const renderCompletion = () => {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Box 
          sx={{ 
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <ArrowForwardIcon sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Typography variant="h4" gutterBottom>
          Campaign Complete!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your campaign has been successfully launched.
        </Typography>
        
        <Button 
          variant="contained"
          size="large"
          onClick={viewCampaigns}
        >
          View Active Campaigns
        </Button>
      </Box>
    );
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderAudienceSelection();
      case 2:
        return renderContentGeneration();
      case 3:
        return renderReviewAndLaunch();
      case 4:
        return renderCompletion();
      default:
        return <Typography>Invalid step</Typography>;
    }
  };
  
  // Handle next step navigation
  const handleNext = () => {
    // Validation for each step
    if (step === 1 && !selectedAudience) {
      showNotification('Please select a target audience', 'warning');
      return;
    }
    
    setStep(prevStep => prevStep + 1);
  };
  
  // Handle previous step navigation
  const handleBack = () => {
    setStep(prevStep => prevStep - 1);
  };

  // Handle error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              sx={{ mr: 2 }}
            >
              Restart Campaign Builder
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">
            Processing your campaign...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This may take a few moments
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper sx={{ overflow: 'hidden', borderRadius: 3 }}>
        {/* Header */}
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            p: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6">Create Campaign</Typography>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Stepper */}
        <Box sx={{ px: 3, pt: 3 }}>
          <Stepper activeStep={step - 1} alternativeLabel>
            <Step key="Select Audience" completed={step > 1}>
              <StepLabel>Select Audience</StepLabel>
            </Step>
            <Step key="Generate Content" completed={step > 2}>
              <StepLabel>Generate Content</StepLabel>
            </Step>
            <Step key="Review & Launch" completed={step > 3}>
              <StepLabel>Review & Launch</StepLabel>
            </Step>
            <Step key="Complete" completed={step > 4}>
              <StepLabel>Complete</StepLabel>
            </Step>
          </Stepper>
        </Box>
        
        {/* Content */}
        <Box>
          {renderStepContent()}
        </Box>
        
        {/* Footer with navigation buttons */}
        {step < 4 && (
          <Box 
            sx={{ 
              p: 3, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            {step > 1 ? (
              <Button 
                variant="outlined" 
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                disabled={isGenerating}
              >
                Back
              </Button>
            ) : (
              <Box />
            )}
            
            {step === 1 || step === 2 ? (
              <Button 
                variant="contained" 
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                disabled={step === 1 && !selectedAudience}
              >
                Continue
              </Button>
            ) : step === 3 ? (
              <Button 
                variant="contained" 
                onClick={launchCampaign}
                endIcon={<ArrowForwardIcon />}
                color="primary"
              >
                Launch Campaign
              </Button>
            ) : null}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default GenAICampaignBuilder;