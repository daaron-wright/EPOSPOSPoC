import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Button,
  Tabs,
  Tab,
  Divider,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Grid,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Info as InfoIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as AIIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  LocalOffer as OfferIcon,
  BarChart as ChartIcon,
  Settings as SettingsIcon,
  DataUsage as DataIcon
} from '@mui/icons-material';

/**
 * SegmentExplainer Component
 * 
 * A comprehensive component that explains how customer segmentation works,
 * showing the data, criteria, and methodology used to create customer segments.
 * 
 * Features:
 * - Transparent explanation of segmentation process
 * - Visual representation of segment characteristics
 * - Sample data visualization
 * - Toggle for technical details
 * - User controls for segmentation parameters
 */
const SegmentExplainer = ({ 
  segment, 
  onParameterChange,
  onRefreshSegment,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [customThresholds, setCustomThresholds] = useState({
    spendingThreshold: segment?.thresholds?.spending || 500,
    frequencyThreshold: segment?.thresholds?.frequency || 3,
    recencyThreshold: segment?.thresholds?.recency || 30
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle threshold change
  const handleThresholdChange = (threshold, value) => {
    setCustomThresholds(prev => ({
      ...prev,
      [threshold]: value
    }));
    
    // If the parent component provided an onParameterChange handler, call it
    if (onParameterChange) {
      onParameterChange({
        ...customThresholds,
        [threshold]: value
      });
    }
  };

  // Apply custom thresholds and refresh segment
  const handleApplyThresholds = () => {
    if (onRefreshSegment) {
      onRefreshSegment(customThresholds);
    }
  };

  // Toggle technical details visibility
  const toggleTechnicalDetails = () => {
    setShowTechnicalDetails(!showTechnicalDetails);
  };

  // Toggle sample data visibility
  const toggleSampleData = () => {
    setShowSampleData(!showSampleData);
  };

  // If no segment is provided, show placeholder
  if (!segment) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>No Segment Selected</Typography>
        <Typography variant="body2" color="text.secondary">
          Please select a customer segment to view its details and explanation.
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            {segment.name} Segment Explanation
          </Typography>
        </Box>
        {onClose && (
          <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="segment explainer tabs"
          variant="fullWidth"
        >
          <Tab label="Overview" />
          <Tab label="Segmentation Criteria" />
          <Tab label="Data Sources" />
          <Tab label="Customize" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              What is the {segment.name} segment?
            </Typography>
            <Typography variant="body2" paragraph>
              {segment.description || `The ${segment.name} segment represents ${segment.size.toLocaleString()} 
              customers who share similar purchasing behaviors and preferences. This segment was 
              identified through analysis of your customer transaction data.`}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Characteristics
                  </Typography>
                  <List dense disablePadding>
                    {segment.characteristics.map((char, idx) => (
                      <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={char} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recent Behaviors
                  </Typography>
                  <List dense disablePadding>
                    {segment.recentBehaviors.map((behavior, idx) => (
                      <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <TrendingUpIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={behavior} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>AI-Powered Segmentation</AlertTitle>
              This segment was created using AI analysis of customer purchase patterns.
              The AI identified natural groupings based on spending levels, purchase frequency,
              and product preferences without using personally identifiable information.
            </Alert>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={<AIIcon />}
                  label={`${segment.confidenceScore || 85}% confidence`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                <Tooltip title="Confidence score represents how clearly defined this segment is based on available data">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                <Button 
                  size="small" 
                  startIcon={showSampleData ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  onClick={toggleSampleData}
                >
                  {showSampleData ? 'Hide' : 'Show'} Sample Data
                </Button>
              </Box>
            </Box>
            
            {/* Sample Customer Data */}
            <Collapse in={showSampleData}>
              <Box sx={{ mt: 2 }}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small" aria-label="sample customer data">
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer ID</TableCell>
                        <TableCell>Total Spent</TableCell>
                        <TableCell>Purchase Frequency</TableCell>
                        <TableCell>Last Purchase</TableCell>
                        <TableCell>Top Product Category</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Anonymized sample data */}
                      <TableRow>
                        <TableCell>C****123</TableCell>
                        <TableCell>${segment.metrics.avgOrderValue * 3}</TableCell>
                        <TableCell>{segment.metrics.avgFrequency + 2}</TableCell>
                        <TableCell>5 days ago</TableCell>
                        <TableCell>Electronics</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>C****456</TableCell>
                        <TableCell>${segment.metrics.avgOrderValue * 2.5}</TableCell>
                        <TableCell>{segment.metrics.avgFrequency + 1}</TableCell>
                        <TableCell>12 days ago</TableCell>
                        <TableCell>Home Goods</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>C****789</TableCell>
                        <TableCell>${segment.metrics.avgOrderValue * 3.2}</TableCell>
                        <TableCell>{segment.metrics.avgFrequency}</TableCell>
                        <TableCell>8 days ago</TableCell>
                        <TableCell>Apparel</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Note: Customer IDs are partially masked to protect privacy. This is anonymized representative data.
                </Typography>
              </Box>
            </Collapse>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Marketing Recommendations
            </Typography>
            <Typography variant="body2" paragraph>
              Based on the characteristics of this segment, the following approaches are recommended:
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'white', mb: 2 }}>
              <Typography variant="subtitle2">
                Suggested Approach: {segment.suggestedApproach}
              </Typography>
            </Paper>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Effective Products</Typography>
                  </Box>
                  <Typography variant="body2">
                    {segment.name === 'High-Value Customers' 
                      ? 'Premium products, new arrivals, exclusive items'
                      : 'Value packs, sale items, budget-friendly alternatives'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <OfferIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Effective Offers</Typography>
                  </Box>
                  <Typography variant="body2">
                    {segment.name === 'High-Value Customers' 
                      ? 'Early access, loyalty rewards, exclusive events'
                      : 'Discounts, limited-time sales, free shipping thresholds'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      )}

      {/* Segmentation Criteria Tab */}
      {activeTab === 1 && (
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              How Customers Are Assigned to This Segment
            </Typography>
            <Typography variant="body2" paragraph>
              Customers are assigned to the {segment.name} segment when they meet the following criteria:
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table aria-label="segmentation criteria">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell>Criteria</TableCell>
                    <TableCell>Average Value</TableCell>
                    <TableCell>Threshold</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {segment.segmentationCriteria.map((criteria, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{criteria.name}</TableCell>
                      <TableCell>{criteria.condition}</TableCell>
                      <TableCell>
                        {criteria.name === 'Total Spent' 
                          ? `$${segment.metrics.avgOrderValue * segment.metrics.avgFrequency}` 
                          : criteria.name === 'Purchase Frequency'
                            ? segment.metrics.avgFrequency
                            : 'Varies'
                        }
                      </TableCell>
                      <TableCell>
                        {criteria.name === 'Total Spent' 
                          ? `$${customThresholds.spendingThreshold}` 
                          : criteria.name === 'Purchase Frequency'
                            ? customThresholds.frequencyThreshold
                            : 'Varies'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="subtitle2" gutterBottom>
              Segmentation Methodology
            </Typography>
            <Typography variant="body2" paragraph>
              This segmentation uses a combination of rule-based filtering and machine learning clustering 
              to identify natural customer groupings based on similar behaviors and preferences.
            </Typography>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={showTechnicalDetails} 
                  onChange={toggleTechnicalDetails}
                  size="small"
                />
              }
              label="Show technical details"
            />
            
            {showTechnicalDetails && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Technical Implementation
                </Typography>
                <Typography variant="body2" paragraph>
                  The segmentation process follows these steps:
                </Typography>
                <ol>
                  <li>
                    <Typography variant="body2">
                      Customer transaction data is aggregated to calculate key metrics (total spent, 
                      frequency, recency, etc.)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Initial rule-based filtering separates customers into base segments using 
                      threshold values for spending and frequency
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      K-means clustering algorithm refines segments based on multiple behavioral dimensions
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Segment validation using silhouette score to ensure clear separation between segments
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Calculation of segment profile including characteristics, behaviors, and recommended 
                      marketing approaches
                    </Typography>
                  </li>
                </ol>
                <Typography variant="caption" color="text.secondary">
                  The confidence score ({segment.confidenceScore || 85}%) indicates how clearly this segment is separated 
                  from others, with higher scores reflecting more distinctive customer groups.
                </Typography>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Segment Composition
            </Typography>
            <Typography variant="body2" paragraph>
              This segment contains {segment.size.toLocaleString()} customers, representing 
              {segment.name === 'High-Value Customers' ? ' 30%' : ' 70%'} of your total customer base.
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Customer Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Avg. Order Value
                    </Typography>
                    <Typography variant="h6">
                      ${segment.metrics.avgOrderValue}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Avg. Purchase Frequency
                    </Typography>
                    <Typography variant="h6">
                      {segment.metrics.avgFrequency} orders
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Avg. Customer Value
                    </Typography>
                    <Typography variant="h6">
                      ${segment.metrics.avgOrderValue * segment.metrics.avgFrequency}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      )}

      {/* Data Sources Tab */}
      {activeTab === 2 && (
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Data Sources Used for Segmentation
            </Typography>
            <Typography variant="body2" paragraph>
              This segmentation is based on the following data sources from your systems:
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CartIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Point of Sale Transactions</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Historical purchase records from your point of sale system, including product details,
                  quantities, prices, and timestamps.
                </Typography>
                <Typography variant="subtitle2" gutterBottom>Fields Used:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip size="small" label="Customer ID" />
                  <Chip size="small" label="Product ID/Name" />
                  <Chip size="small" label="Purchase Date" />
                  <Chip size="small" label="Transaction Amount" />
                  <Chip size="small" label="Quantity" />
                  <Chip size="small" label="Payment Method" />
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ChartIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Previous Campaign Interactions</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Customer engagement with previous marketing campaigns, including opens, clicks,
                  and conversions.
                </Typography>
                <Typography variant="subtitle2" gutterBottom>Fields Used:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip size="small" label="Customer ID" />
                  <Chip size="small" label="Campaign ID" />
                  <Chip size="small" label="Interaction Type" />
                  <Chip size="small" label="Interaction Date" />
                  <Chip size="small" label="Channel" />
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <AlertTitle>Privacy Protection</AlertTitle>
              <Typography variant="body2">
                All data used in segmentation is anonymized during analysis. Personal information such as 
                names, addresses, emails, and phone numbers are NOT used in the segmentation process.
              </Typography>
            </Alert>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Data Processing
            </Typography>
            <Typography variant="body2" paragraph>
              Before segmentation, the following data processing steps are applied:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <DataIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Data Cleaning" 
                  secondary="Removal of duplicate transactions, correction of missing values, and normalization of data formats"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DataIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Feature Engineering" 
                  secondary="Creation of derived metrics like total spent, average order value, and purchase frequency"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DataIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Data Aggregation" 
                  secondary="Transactions are grouped by customer to create customer-level profiles"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DataIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Outlier Handling" 
                  secondary="Identification and special handling of extreme values to prevent skewing results"
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Data is refreshed and segmentation is updated daily to ensure segments reflect the most 
                current customer behaviors.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      )}

      {/* Customize Tab */}
      {activeTab === 3 && (
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Customize Segmentation Parameters
            </Typography>
            <Typography variant="body2" paragraph>
              Adjust the threshold values used to define this segment. Changes will be reflected in your
              segment composition and may affect the number of customers included.
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>Customization Impact</AlertTitle>
              Changing these parameters will affect which customers are included in this segment. 
              Significant changes may impact the effectiveness of marketing campaigns targeted at this segment.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Spending Threshold
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Minimum total spending amount required for {segment.name === 'High-Value Customers' ? 'inclusion in' : 'exclusion from'} this segment.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1">$</Typography>
                    <input
                      type="number"
                      min="50"
                      max="2000"
                      step="50"
                      value={customThresholds.spendingThreshold}
                      onChange={(e) => handleThresholdChange('spendingThreshold', parseInt(e.target.value))}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Frequency Threshold
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Minimum number of purchases required for {segment.name === 'High-Value Customers' ? 'inclusion in' : 'exclusion from'} this segment.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      step="1"
                      value={customThresholds.frequencyThreshold}
                      onChange={(e) => handleThresholdChange('frequencyThreshold', parseInt(e.target.value))}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    />
                    <Typography variant="body1">orders</Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recency Threshold
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Maximum days since last purchase for {segment.name === 'High-Value Customers' ? 'inclusion in' : 'exclusion from'} this segment.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      type="number"
                      min="7"
                      max="365"
                      step="1"
                      value={customThresholds.recencyThreshold}
                      onChange={(e) => handleThresholdChange('recencyThreshold', parseInt(e.target.value))}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    />
                    <Typography variant="body1">days</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<SettingsIcon />}
                onClick={handleApplyThresholds}
              >
                Apply Custom Parameters
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Segment Size Impact Preview
            </Typography>
            <Typography variant="body2" paragraph>
              With the current threshold settings, this segment would include approximately:
            </Typography>
            
            <Box sx={{ 
              p: 3, 
              bgcolor: 'primary.light', 
              color: 'white', 
              borderRadius: 1,
              textAlign: 'center'
            }}>
              <Typography variant="h4">
                {calculateEstimatedSize(segment, customThresholds).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                estimated customers
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              This is {getPercentChange(segment.size, calculateEstimatedSize(segment, customThresholds))}% 
              {calculateEstimatedSize(segment, customThresholds) > segment.size ? ' more' : ' fewer'} customers 
              than the current segment size of {segment.size.toLocaleString()}.
            </Typography>
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

// Helper function to calculate estimated segment size based on thresholds
function calculateEstimatedSize(segment, thresholds) {
  // This is a simplified estimation - in a real application, this would query the actual data
  const baseSize = segment.size;
  
  // Estimate impact of spending threshold change
  const baseThreshold = segment.name === 'High-Value Customers' ? 500 : 250;
  const spendingImpact = 1 - ((thresholds.spendingThreshold - baseThreshold) / baseThreshold * 0.5);
  
  // Estimate impact of frequency threshold change
  const baseFrequency = segment.name === 'High-Value Customers' ? 3 : 2;
  const frequencyImpact = 1 - ((thresholds.frequencyThreshold - baseFrequency) / baseFrequency * 0.3);
  
  // Estimate impact of recency threshold change
  const baseRecency = segment.name === 'High-Value Customers' ? 30 : 60;
  const recencyImpact = segment.name === 'High-Value Customers' 
    ? (thresholds.recencyThreshold / baseRecency) * 0.2
    : (baseRecency / thresholds.recencyThreshold) * 0.2;
  
  // Combine impacts and apply to base size
  let estimatedSize = baseSize * spendingImpact * frequencyImpact * (1 + recencyImpact);
  
  return Math.round(Math.max(0, estimatedSize));
}

// Helper function to calculate percent change
function getPercentChange(original, updated) {
  return Math.round(Math.abs((updated - original) / original * 100));
}

export default SegmentExplainer;