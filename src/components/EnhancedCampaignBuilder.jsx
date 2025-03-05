import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  AlertTitle,
  Skeleton,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Link
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Campaign as CampaignIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  NotificationsActive as AlertIcon,
  Star as StarIcon,
  BarChart as ChartIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Group as GroupIcon,
  InsertChart as InsightsIcon,
  AutoAwesome as AIIcon,
  FilterAlt as FilterIcon,
  MoreVert as MoreIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Import custom components
import DataHeadlines from './DataHeadlines';
import ErrorBoundary from './ErrorBoundary';

// Material UI Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6', // Blue
    },
    secondary: {
      main: '#F59E0B', // Amber
    },
    background: {
      default: '#F8F9FA', // Light gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827', // Darker text
      secondary: '#6B7280', // Gray text
    },
    success: {
      main: '#10B981', // Green
    },
    warning: {
      main: '#F59E0B', // Amber
    },
    error: {
      main: '#EF4444', // Red
    },
    info: {
      main: '#3B82F6', // Blue
    }
  },
  shape: {
    borderRadius: 12,
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Custom Tooltip for Campaign Performance
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper sx={{ p: 1 }}>
        <Typography variant="body2">{`Month: ${label}`}</Typography>
        <Typography variant="body2">{`Campaigns: ${data.campaigns}`}</Typography>
        {data.totalReach && (
          <Typography variant="body2">{`Total Reach: ${data.totalReach}`}</Typography>
        )}
        {data.engagementRate !== undefined && (
          <Typography variant="body2">{`Engagement Rate: ${data.engagementRate}%`}</Typography>
        )}
        {data.avgResponseTime !== undefined && (
          <Typography variant="body2">{`Avg. Response Time: ${data.avgResponseTime}h`}</Typography>
        )}
      </Paper>
    );
  }
  return null;
}

// Main Dashboard Component with Enhanced Features
export default function Dashboard({ showNotification }) {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7d');
  const [selectedCampaign, setSelectedCampaign] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDataExplanation, setShowDataExplanation] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Sample data - Replace with API calls in a real implementation
  const metrics = [
    { 
      label: 'Active Campaigns', 
      value: '24', 
      change: +3.2, 
      type: 'campaign',
      explanation: 'Total number of marketing campaigns currently running across all channels.',
      timeframe: 'last month',
      recommendation: 'Consider consolidating similar campaigns for better audience targeting.'
    },
    { 
      label: 'Total Reach', 
      value: '45.2K', 
      change: +1.8, 
      type: 'audience',
      explanation: 'Number of unique customers who received at least one campaign message.',
      timeframe: 'last month',
      recommendation: 'Expand your audience with a lookalike segment based on high-engagement customers.'
    },
    { 
      label: 'Engagement Rate', 
      value: '18.9%', 
      change: +2.3, 
      type: 'engagement',
      explanation: 'Percentage of recipients who interacted with your campaigns (opens, clicks, etc.).',
      timeframe: 'last month',
      valueColor: 'success.main'
    },
    { 
      label: 'Avg. Response Time', 
      value: '1.5h', 
      change: -4.1, 
      type: 'engagement',
      isInverse: true,
      explanation: 'Average time customers take to engage with your campaigns after receiving them.',
      timeframe: 'last month',
      recommendation: 'Your response time is excellent. Consider testing different send times to further optimize.'
    },
  ];

  const insights = [
    {
      title: 'High-Value Customer Segment Growing',
      description: 'Your high-value customer segment has grown by 12% in the last month. This presents an opportunity for targeted premium campaigns.',
      severity: 'high',
      action: {
        label: 'Create Premium Campaign',
        onClick: () => navigate('/campaign-builder', { state: { segmentFocus: 'high-value' } })
      }
    },
    {
      title: 'SMS Engagement Declining',
      description: 'SMS campaign engagement has dropped by 5% this month. Consider refreshing content strategy or testing new send times.',
      severity: 'medium',
      action: {
        label: 'View SMS Analytics',
        onClick: () => setActiveTab(1)
      }
    },
    {
      title: 'Product Category Opportunity',
      description: 'Customers who purchased from the "Home Goods" category show 30% higher engagement than average.',
      severity: 'medium',
      action: {
        label: 'Target This Category',
        onClick: () => navigate('/campaign-builder', { state: { categoryFocus: 'home-goods' } })
      }
    }
  ];

  const campaignPerformanceData = [
    { date: 'Jan', campaigns: 1200 },
    { date: 'Feb', campaigns: 1800 },
    { date: 'Mar', campaigns: 1400 },
    { date: 'Apr', campaigns: 1000 },
  ];

  const campaignPerformanceDataByCampaign = {
    1: [
      { date: 'Jan', campaigns: 200, totalReach: '10K', engagementRate: 10, avgResponseTime: 2 },
      { date: 'Feb', campaigns: 250, totalReach: '12K', engagementRate: 12, avgResponseTime: 1.8 },
      { date: 'Mar', campaigns: 300, totalReach: '15K', engagementRate: 11, avgResponseTime: 1.5 },
      { date: 'Apr', campaigns: 280, totalReach: '14K', engagementRate: 13, avgResponseTime: 1.6 },
    ],
    2: [
      { date: 'Jan', campaigns: 300, totalReach: '15K', engagementRate: 9, avgResponseTime: 2.2 },
      { date: 'Feb', campaigns: 350, totalReach: '16K', engagementRate: 10, avgResponseTime: 2.0 },
      { date: 'Mar', campaigns: 400, totalReach: '17K', engagementRate: 11, avgResponseTime: 1.9 },
      { date: 'Apr', campaigns: 380, totalReach: '16.5K', engagementRate: 12, avgResponseTime: 1.7 },
    ]
  };

  const customerGrowthData = [
    { month: 'Jan', newCustomers: 1000, repeatCustomers: 700 },
    { month: 'Feb', newCustomers: 1050, repeatCustomers: 750 },
    { month: 'Mar', newCustomers: 1100, repeatCustomers: 800 },
  ];

  const avgSpendData = [
    { month: 'Jan', avgSpend: 380 },
    { month: 'Feb', avgSpend: 420 },
    { month: 'Mar', avgSpend: 450 },
  ];

  const saleAnalyticsData = [
    { name: 'Returned', value: 70, color: '#4285F4' },
    { name: 'Completed', value: 20, color: 'rgba(66, 133, 244, 0.5)' },
    { name: 'Distributed', value: 10, color: 'rgba(66, 133, 244, 0.1)' },
  ];

  const digitalPaymentsData = [
    { name: 'Credit Card', value: 50, color: '#F59E0B' },
    { name: 'Mobile Pay', value: 30, color: 'rgba(245, 158, 11, 0.5)' },
    { name: 'Bank Transfer', value: 20, color: 'rgba(245, 158, 11, 0.25)' },
  ];

  const loyaltyData = [
    { name: 'Active', value: 60, color: '#F59E0B' },
    { name: 'Inactive', value: 30, color: '#4285F4' },
    { name: 'Churned', value: 10, color: 'rgba(66, 133, 244, 0.5)' },
  ];

  const recentCampaigns = [
    { id: 1, name: 'Summer Sale', status: 'Active', created: 'Created 1 day ago' },
    { id: 2, name: 'New Customer Welcome', status: 'Active', created: 'Created 2 days ago' },
  ];

  const recentActivity = [
    { customer: 'Sarah M.', action: 'made a purchase', value: '$156.23', time: '5 mins ago' },
    { customer: 'Michael B.', action: 'joined loyalty program', time: '12 mins ago' },
    { customer: 'Jessica R.', action: 'made a purchase', value: '$79.99', time: '20 mins ago' },
  ];

  // Handle "Create Campaign" navigation
  const handleCreateCampaign = () => {
    console.log("Create Campaign button clicked"); // Debug log
    navigate('/campaign-builder');
  };

  // Handle campaign view navigation
  const handleViewCampaign = (campaignId) => {
    navigate(`/active-campaigns/${campaignId}`);
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Simulated data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Force data to load even without backend
        // No need to wait for API
        setDashboardData({
          metrics: metrics,
          campaigns: recentCampaigns,
          insights: insights
        });
        
        setIsLoading(false);
        showNotification('Dashboard data updated', 'success');
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
        setIsLoading(false);
        showNotification('Failed to load dashboard data', 'error');
      }
    };
    
    loadDashboardData();
  }, [showNotification]);

  // Refresh dashboard data
  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      showNotification('Dashboard data refreshed', 'success');
    }, 1000);
  };

  // Use campaign-specific data if available; otherwise, fallback to aggregate data
  const currentCampaignData = campaignPerformanceDataByCampaign[selectedCampaign] || campaignPerformanceData;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Page Title and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InsightsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">Marketing Dashboard</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Refresh dashboard data">
                <IconButton 
                  color="primary" 
                  onClick={handleRefreshData}
                  disabled={isLoading}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Button
  variant="contained"
  color="primary"
  startIcon={<CampaignIcon />}
  onClick={handleCreateCampaign}
  sx={{
    borderRadius: '9999px',
    textTransform: 'none',
    fontWeight: 500,
  }}
>
  Create Campaign
</Button>

            </Box>
          </Box>
          
          {/* Error Message if any */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          
          {/* Show explanation about data */}
          {showDataExplanation && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>About This Dashboard</AlertTitle>
              <Typography variant="body2" paragraph>
                This dashboard displays key metrics and insights about your marketing campaigns.
                Data is refreshed automatically every 24 hours, with the last update at {new Date().toLocaleString()}.
              </Typography>
              <Typography variant="body2">
                <strong>Data sources:</strong> Point of sale transactions, campaign engagement metrics, 
                customer profiles, and website analytics.
              </Typography>
              <Button 
                size="small" 
                onClick={() => setShowDataExplanation(false)} 
                sx={{ mt: 1 }}
              >
                Hide
              </Button>
            </Alert>
          )}
          
          {/* Tabs Navigation */}
          <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="dashboard tabs"
            >
              <Tab label="Overview" id="tab-0" />
              <Tab label="Campaign Performance" id="tab-1" />
              <Tab label="Customer Insights" id="tab-2" />
            </Tabs>
          </Box>
          
          {/* Tab Panels */}
          {/* Overview Tab */}
          <div role="tabpanel" hidden={activeTab !== 0}>
            {activeTab === 0 && (
              <Box>
                {/* Row 1: Key Metrics with DataHeadlines */}
                <ErrorBoundary>
                  <DataHeadlines 
                    metrics={metrics}
                    insights={insights}
                    isLoading={isLoading}
                    error={error}
                    onCreateCampaign={handleCreateCampaign}
                  />
                </ErrorBoundary>
                
                {/* Data explanation toggle */}
                {!showDataExplanation && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 2 }}>
                    <Button 
                      startIcon={<InfoIcon />} 
                      size="small" 
                      onClick={() => setShowDataExplanation(true)}
                    >
                      About This Data
                    </Button>
                  </Box>
                )}
                
                {/* Row 6: Recent Campaigns */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Recent Campaigns
                    </Typography>
                    <Link 
                      component="button" 
                      variant="body2" 
                      onClick={() => navigate('/active-campaigns')}
                    >
                      View All
                    </Link>
                  </Box>
                  
                  {isLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {recentCampaigns.map((c) => (
                        <Box
                          key={c.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: 'rgba(0,0,0,0.02)',
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                            transition: 'background-color 0.2s ease'
                          }}
                          onClick={() => handleViewCampaign(c.id)}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {c.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {c.created}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                px: 2,
                                py: 0.5,
                                bgcolor: 'rgba(15, 157, 88, 0.1)',
                                color: '#0F9D58',
                                fontSize: '0.75rem',
                                borderRadius: 4,
                                fontWeight: 500,
                                mr: 1
                              }}
                            >
                              {c.status}
                            </Typography>
                            <IconButton size="small">
                              <MoreIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<AddIcon />}
                      onClick={handleCreateCampaign}
                    >
                      Create New Campaign
                    </Button>
                  </Box>
                </Paper>
                
                {/* Row 7: Recent Activity */}
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Recent Activity
                  </Typography>
                  
                  {isLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {recentActivity.map((activity, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: 'rgba(0,0,0,0.02)',
                            p: 2,
                            borderRadius: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {activity.customer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {activity.action}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            {activity.value && (
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {activity.value}
                              </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>
            )}
          </div>
          
          {/* Campaign Performance Tab */}
          <div role="tabpanel" hidden={activeTab !== 1}>
            {activeTab === 1 && (
              <Box>
                {/* Campaign Selection Controls */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Campaign Performance
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Select
                        size="small"
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {recentCampaigns.map((campaign) => (
                          <MenuItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Select
                        size="small"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        sx={{ fontSize: '0.875rem' }}
                      >
                        <MenuItem value="7d">Last 7 days</MenuItem>
                        <MenuItem value="30d">Last 30 days</MenuItem>
                        <MenuItem value="90d">Last 90 days</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                  
                  {isLoading ? (
                    <Skeleton variant="rectangular" height={300} />
                  ) : (
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentCampaignData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="date" stroke="#475569" />
                          <YAxis stroke="#475569" />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="campaigns"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                  
                  {/* AI Insight for this campaign */}
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info" icon={<AIIcon />}>
                      <AlertTitle>Performance Insight</AlertTitle>
                      <Typography variant="body2">
                        {selectedCampaign === 1 
                          ? "This campaign's engagement rate is 15% higher than your average. Consider expanding its audience reach."
                          : "This campaign shows steady growth but could benefit from more compelling call-to-actions based on user behavior."}
                      </Typography>
                    </Alert>
                  </Box>
                </Paper>
                
                {/* Channel Performance */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Channel Performance
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Email
                          </Typography>
                          <Typography variant="h5" sx={{ mb: 1 }}>22.3%</Typography>
                          <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                            +2.5% from last period
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Open rate: 28.4% • Click rate: 12.1%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            SMS
                          </Typography>
                          <Typography variant="h5" sx={{ mb: 1 }}>14.8%</Typography>
                          <Typography variant="body2" color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                            <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                            -1.2% from last period
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Click rate: 14.8% • Opt-out rate: 0.7%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Social Media
                          </Typography>
                          <Typography variant="h5" sx={{ mb: 1 }}>18.2%</Typography>
                          <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                            +3.7% from last period
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Engagement: 18.2% • Conversion: 2.5%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </div>
          
          {/* Customer Insights Tab */}
          <div role="tabpanel" hidden={activeTab !== 2}>
            {activeTab === 2 && (
              <Box>
                {/* Row 3: Customer Growth Trend & Average Spend */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Customer Growth Trend
                      </Typography>
                      
                      {isLoading ? (
                        <Skeleton variant="rectangular" height={300} />
                      ) : (
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={customerGrowthData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                              <XAxis dataKey="month" stroke="#475569" />
                              <YAxis stroke="#475569" />
                              <RechartsTooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="newCustomers"
                                name="New Customers"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="repeatCustomers"
                                name="Repeat Customers"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Average Spend
                      </Typography>
                      
                      {isLoading ? (
                        <Skeleton variant="rectangular" height={300} />
                      ) : (
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={avgSpendData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                              <XAxis dataKey="month" stroke="#475569" />
                              <YAxis stroke="#475569" />
                              <RechartsTooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="avgSpend"
                                name="Average Spend ($)"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
                
                {/* Row 4: Donut Charts */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Sale Analytics
                      </Typography>
                      
                      {isLoading ? (
                        <Skeleton variant="circular" width={240} height={240} sx={{ mx: 'auto' }} />
                      ) : (
                        <Box sx={{ width: '100%', height: 240 }}>
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie
                                data={saleAnalyticsData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="60%"
                                outerRadius="80%"
                                stroke="none"
                              >
                                {saleAnalyticsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                              <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Digital Payments
                      </Typography>
                      
                      {isLoading ? (
                        <Skeleton variant="circular" width={240} height={240} sx={{ mx: 'auto' }} />
                      ) : (
                        <Box sx={{ width: '100%', height: 240 }}>
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie
                                data={digitalPaymentsData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="60%"
                                outerRadius="80%"
                                stroke="none"
                              >
                                {digitalPaymentsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                              <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Connected Loyalty
                      </Typography>
                      
                      {isLoading ? (
                        <Skeleton variant="circular" width={240} height={240} sx={{ mx: 'auto' }} />
                      ) : (
                        <Box sx={{ width: '100%', height: 240 }}>
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie
                                data={loyaltyData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="60%"
                                outerRadius="80%"
                                stroke="none"
                              >
                                {loyaltyData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                              <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
                
                {/* Customer Segments Card */}
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Customer Segments
                    </Typography>
                    <Button 
                      size="small" 
                      startIcon={<GroupIcon />}
                      onClick={() => navigate('/customer-segments')}
                    >
                      View All Segments
                    </Button>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: 2, bgcolor: 'primary.light', color: 'white' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">High-Value Customers</Typography>
                            <Chip 
                              label="3,250 customers" 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.2)', 
                                color: 'white' 
                              }} 
                            />
                          </Box>
                          <Typography variant="body2" paragraph>
                            Customers with average order value above $500 and frequent purchases.
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label="+ 12% growth" 
                              size="small" 
                              icon={<TrendingUpIcon />}
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.2)', 
                                color: 'white' 
                              }} 
                            />
                            <Chip 
                              label="22.5% engagement" 
                              size="small" 
                              icon={<StarIcon />}
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.2)', 
                                color: 'white' 
                              }} 
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Budget Shoppers</Typography>
                            <Chip 
                              label="12,750 customers" 
                              size="small" 
                              color="secondary" 
                              variant="outlined" 
                            />
                          </Box>
                          <Typography variant="body2" paragraph>
                            Price-sensitive customers responsive to discounts and promotions.
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label="+ 3% growth" 
                              size="small" 
                              icon={<TrendingUpIcon />}
                              color="success" 
                              variant="outlined" 
                            />
                            <Chip 
                              label="15.8% engagement" 
                              size="small" 
                              icon={<ChartIcon />}
                              color="primary" 
                              variant="outlined" 
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<CampaignIcon />}
                      onClick={handleCreateCampaign}
                    >
                      Create Targeted Campaign
                    </Button>
                  </Box>
                </Paper>
              </Box>
            )}
          </div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}