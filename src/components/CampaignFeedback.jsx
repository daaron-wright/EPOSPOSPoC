import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  LinearProgress,
  IconButton,
  Tooltip,
  Collapse,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AutoAwesome as AIIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Campaign as CampaignIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Public as SocialIcon,
  Notifications as PushIcon,
  Apps as AppIcon,
  Share as ShareIcon,
  EditNote as EditIcon,
  Adjustments as AdjustIcon,
  Archive as ArchiveIcon,
  BugReport as IssueIcon
} from '@mui/icons-material';

/**
 * CampaignFeedback Component
 * 
 * A comprehensive component that provides transparent feedback on campaign performance,
 * identifies issues, and offers actionable insights for improvements.
 * 
 * Features:
 * - Overall campaign performance metrics
 * - Channel-specific performance breakdown
 * - AI-generated insights and recommendations
 * - Anomaly detection and issue reporting
 * - Performance comparison against benchmarks
 * - User controls to adjust future campaigns
 */
const CampaignFeedback = ({ 
  campaign, 
  isLoading = false,
  error = null,
  onEditCampaign,
  onDuplicateCampaign,
  onArchiveCampaign 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showDataDetails, setShowDataDetails] = useState(false);
  const [showIssues, setShowIssues] = useState(true);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Determine trend direction
  const getTrendIcon = (actual, target) => {
    const percentage = (actual / target) * 100;
    
    if (percentage >= 90) {
      return <TrendingUpIcon fontSize="small" sx={{ color: 'success.main' }} />;
    } else if (percentage >= 70) {
      return <TrendingUpIcon fontSize="small" sx={{ color: 'warning.main' }} />;
    } else {
      return <TrendingDownIcon fontSize="small" sx={{ color: 'error.main' }} />;
    }
  };

  // Get color based on performance
  const getPerformanceColor = (actual, target) => {
    const percentage = (actual / target) * 100;
    
    if (percentage >= 90) return 'success.main';
    if (percentage >= 70) return 'warning.main';
    return 'error.main';
  };

  // Get channel icon based on type
  const getChannelIcon = (channel) => {
    switch(channel.toLowerCase()) {
      case 'email':
        return <EmailIcon />;
      case 'sms':
        return <SmsIcon />;
      case 'social media':
        return <SocialIcon />;
      case 'push notification':
        return <PushIcon />;
      case 'in-app message':
        return <AppIcon />;
      default:
        return <CampaignIcon />;
    }
  };

  // Format performance value with colored indicator
  const formatPerformance = (value, benchmark, inverse = false) => {
    if (!value || !benchmark) return '—';
    
    const ratio = value / benchmark;
    let color;
    
    if (inverse) {
      // For metrics where lower is better (e.g., unsubscribe rate)
      color = ratio <= 0.9 ? 'success.main' : ratio <= 1.1 ? 'warning.main' : 'error.main';
    } else {
      // For metrics where higher is better (e.g., open rate)
      color = ratio >= 1.1 ? 'success.main' : ratio >= 0.9 ? 'warning.main' : 'error.main';
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box 
          sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: color,
            mr: 1 
          }} 
        />
        <Typography 
          variant="body2" 
          sx={{ color: 'text.primary' }}
        >
          {value}%
        </Typography>
      </Box>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Loading Campaign Results
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fetching performance data and generating insights...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <AlertTitle>Error Loading Campaign Data</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  // If no campaign data
  if (!campaign) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>No Campaign Selected</Typography>
        <Typography variant="body2" color="text.secondary">
          Please select a campaign to view its performance data.
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Campaign Header */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CampaignIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            {campaign.title} Performance
          </Typography>
        </Box>
        
        <Box>
          <Chip
            label={campaign.status}
            size="small"
            color={campaign.status === 'Active' ? 'success' : 'default'}
            sx={{ mr: 1 }}
          />
          <Chip
            label={`${campaign.daysSinceStart} days running`}
            size="small"
            variant="outlined"
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
          />
        </Box>
      </Box>

      {/* Issues Alert (if any) */}
      {campaign.issues && campaign.issues.length > 0 && (
        <Collapse in={showIssues}>
          <Alert 
            severity="warning" 
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowIssues(false)}
              >
                <ExpandLessIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>Performance Issues Detected</AlertTitle>
            <List dense disablePadding>
              {campaign.issues.map((issue, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <WarningIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={issue} />
                </ListItem>
              ))}
            </List>
          </Alert>
        </Collapse>
      )}

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="campaign feedback tabs"
        >
          <Tab label="Overview" />
          <Tab label="Channel Performance" />
          <Tab label="Audience Insights" />
          <Tab label="Recommendations" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Performance Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Data from {campaign.startDate} to {campaign.endDate || 'Present'}
              </Typography>
            </Box>
            
            {/* Main KPI Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    height: '100%', 
                    borderColor: getPerformanceColor(campaign.metrics.reach.actual, campaign.metrics.reach.target) 
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Reach
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                      {campaign.metrics.reach.actual.toLocaleString()}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      /{campaign.metrics.reach.target.toLocaleString()} target
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (campaign.metrics.reach.actual / campaign.metrics.reach.target) * 100)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getPerformanceColor(campaign.metrics.reach.actual, campaign.metrics.reach.target)
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(campaign.metrics.reach.actual, campaign.metrics.reach.target)}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        ml: 0.5,
                        color: getPerformanceColor(campaign.metrics.reach.actual, campaign.metrics.reach.target)
                      }}
                    >
                      {Math.round((campaign.metrics.reach.actual / campaign.metrics.reach.target) * 100)}% of target
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    borderColor: getPerformanceColor(campaign.metrics.engagement.actual, campaign.metrics.engagement.target)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Engagement Rate
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                      {campaign.metrics.engagement.actual}%
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      /{campaign.metrics.engagement.target}% target
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (campaign.metrics.engagement.actual / campaign.metrics.engagement.target) * 100)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getPerformanceColor(campaign.metrics.engagement.actual, campaign.metrics.engagement.target)
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(campaign.metrics.engagement.actual, campaign.metrics.engagement.target)}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        ml: 0.5,
                        color: getPerformanceColor(campaign.metrics.engagement.actual, campaign.metrics.engagement.target)
                      }}
                    >
                      {Math.round((campaign.metrics.engagement.actual / campaign.metrics.engagement.target) * 100)}% of target
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    borderColor: getPerformanceColor(campaign.metrics.conversion.actual, campaign.metrics.conversion.target)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Conversion Rate
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                      {campaign.metrics.conversion.actual}%
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      /{campaign.metrics.conversion.target}% target
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (campaign.metrics.conversion.actual / campaign.metrics.conversion.target) * 100)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getPerformanceColor(campaign.metrics.conversion.actual, campaign.metrics.conversion.target)
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(campaign.metrics.conversion.actual, campaign.metrics.conversion.target)}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        ml: 0.5,
                        color: getPerformanceColor(campaign.metrics.conversion.actual, campaign.metrics.conversion.target)
                      }}
                    >
                      {Math.round((campaign.metrics.conversion.actual / campaign.metrics.conversion.target) * 100)}% of target
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    borderColor: getPerformanceColor(campaign.metrics.revenue.actual, campaign.metrics.revenue.target)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Revenue Generated
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                      ${campaign.metrics.revenue.actual.toLocaleString()}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      /${campaign.metrics.revenue.target.toLocaleString()} target
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (campaign.metrics.revenue.actual / campaign.metrics.revenue.target) * 100)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getPerformanceColor(campaign.metrics.revenue.actual, campaign.metrics.revenue.target)
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(campaign.metrics.revenue.actual, campaign.metrics.revenue.target)}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        ml: 0.5,
                        color: getPerformanceColor(campaign.metrics.revenue.actual, campaign.metrics.revenue.target)
                      }}
                    >
                      {Math.round((campaign.metrics.revenue.actual / campaign.metrics.revenue.target) * 100)}% of target
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            {/* AI-powered Insights */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AIIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  AI-Generated Performance Insights
                </Typography>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <List disablePadding>
                  {campaign.insights.map((insight, idx) => (
                    <React.Fragment key={idx}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {insight.type === 'positive' ? (
                            <CheckIcon color="success" fontSize="small" />
                          ) : insight.type === 'warning' ? (
                            <WarningIcon color="warning" fontSize="small" />
                          ) : (
                            <InfoIcon color="info" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={insight.text}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      {idx < campaign.insights.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
            
            {/* Campaign Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={onEditCampaign}
              >
                Edit Campaign
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ShareIcon />}
                onClick={onDuplicateCampaign}
              >
                Duplicate
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<ArchiveIcon />}
                onClick={onArchiveCampaign}
              >
                Archive
              </Button>
            </Box>
          </Box>
        </CardContent>
      )}

      {/* Channel Performance Tab */}
      {activeTab === 1 && (
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Performance by Channel
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  size="small" 
                  startIcon={showDataDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setShowDataDetails(!showDataDetails)}
                >
                  {showDataDetails ? 'Hide Details' : 'Show Benchmarks'}
                </Button>
              </Box>
            </Box>
            
            {/* Channel Metrics Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Channel</TableCell>
                    <TableCell align="right">Recipients</TableCell>
                    <TableCell align="right">Engagement</TableCell>
                    <TableCell align="right">Conversion</TableCell>
                    <TableCell align="right">Performance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaign.channels.map((channel) => (
                    <TableRow
                      key={channel.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 1, color: 'primary.main' }}>
                            {getChannelIcon(channel.name)}
                          </Box>
                          <Typography variant="body2">{channel.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{channel.recipients.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        {formatPerformance(channel.engagement, channel.benchmarks?.engagement)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPerformance(channel.conversion, channel.benchmarks?.conversion)}
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={channel.performance} 
                          size="small"
                          color={
                            channel.performance === 'Excellent' ? 'success' :
                            channel.performance === 'Good' ? 'primary' :
                            channel.performance === 'Average' ? 'secondary' : 'error'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Channel Performance Details */}
            <Collapse in={showDataDetails}>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Detailed Channel Metrics
                </Typography>
                <Typography variant="body2" paragraph color="text.secondary">
                  Comparison with industry benchmarks and previous campaigns.
                </Typography>
                
                <Grid container spacing={2}>
                  {campaign.channels.map((channel) => (
                    <Grid item xs={12} key={channel.name}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 1, color: 'primary.main' }}>
                              {getChannelIcon(channel.name)}
                            </Box>
                            <Typography variant="subtitle2">{channel.name} Details</Typography>
                          </Box>
                          <Chip 
                            label={channel.performance} 
                            size="small"
                            color={
                              channel.performance === 'Excellent' ? 'success' :
                              channel.performance === 'Good' ? 'primary' :
                              channel.performance === 'Average' ? 'secondary' : 'error'
                            }
                          />
                        </Box>
                        
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Metric</TableCell>
                                <TableCell align="right">Current</TableCell>
                                <TableCell align="right">Benchmark</TableCell>
                                <TableCell align="right">Previous Campaign</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {channel.detailedMetrics.map((metric) => (
                                <TableRow key={metric.name}>
                                  <TableCell>
                                    <Tooltip title={metric.description || ''}>
                                      <Typography variant="body2">{metric.name}</Typography>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: getPerformanceColor(
                                          metric.value, 
                                          metric.benchmark,
                                          metric.inverse
                                        ) 
                                      }}
                                    >
                                      {metric.value}%
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">{metric.benchmark}%</TableCell>
                                  <TableCell align="right">{metric.previous}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        
                        {channel.issues && channel.issues.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom color="error.main">
                              Channel-specific Issues
                            </Typography>
                            <List dense disablePadding>
                              {channel.issues.map((issue, idx) => (
                                <ListItem key={idx} disablePadding>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <IssueIcon fontSize="small" color="error" />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={issue} 
                                    primaryTypographyProps={{ variant: 'body2' }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>
          </Box>
        </CardContent>
      )}

      {/* Audience Insights Tab */}
      {activeTab === 2 && (
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Audience Response Analysis
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              How different segments of your audience interacted with this campaign.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {campaign.segmentPerformance.map((segment) => (
                <Grid item xs={12} sm={6} key={segment.name}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2">{segment.name}</Typography>
                      <Chip 
                        label={`${segment.size.toLocaleString()} customers`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Engagement
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: getPerformanceColor(segment.engagement, campaign.metrics.engagement.target)
                            }}
                          >
                            {segment.engagement}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Conversion
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: getPerformanceColor(segment.conversion, campaign.metrics.conversion.target)
                            }}
                          >
                            {segment.conversion}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Top Performing Channel: {segment.topChannel}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {segment.insight}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="subtitle2" gutterBottom>
              Audience Behavior Analysis
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2 }}>
              <List disablePadding>
                {campaign.audienceInsights.map((insight, idx) => (
                  <React.Fragment key={idx}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <InfoIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={insight}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    {idx < campaign.audienceInsights.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <AIIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  These insights were generated by analyzing patterns in customer engagement with your campaign.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </CardContent>
      )}

      {/* Recommendations Tab */}
      {activeTab === 3 && (
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AIIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                AI-Generated Recommendations
              </Typography>
            </Box>
            <Typography variant="body2" paragraph color="text.secondary">
              Based on this campaign's performance, here are actionable recommendations for future campaigns.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {campaign.recommendations.map((recommendation, idx) => (
                <Grid item xs={12} key={idx}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderLeftWidth: 4,
                      borderLeftColor: 
                        recommendation.priority === 'high' ? 'error.main' :
                        recommendation.priority === 'medium' ? 'warning.main' : 'info.main'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">{recommendation.title}</Typography>
                      <Chip 
                        label={`${recommendation.priority} priority`} 
                        size="small"
                        color={
                          recommendation.priority === 'high' ? 'error' :
                          recommendation.priority === 'medium' ? 'warning' : 'info'
                        }
                      />
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {recommendation.description}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Implementation Steps:
                      </Typography>
                      <List dense disablePadding>
                        {recommendation.steps.map((step, stepIdx) => (
                          <ListItem key={stepIdx} disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={step}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    
                    {recommendation.action && (
                      <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => recommendation.action.handler()}
                        >
                          {recommendation.action.label}
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AdjustIcon />}
                onClick={() => onEditCampaign && onEditCampaign(campaign.id)}
              >
                Apply These Recommendations
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                This will create a new draft campaign with these improvements applied.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default CampaignFeedback;
