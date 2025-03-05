import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Skeleton,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
  Campaign as CampaignIcon,
  BarChart as ChartIcon,
  MoreVert as MoreIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

/**
 * DataHeadlines component displays key metrics and insights
 * with visual indication of trends and recommendations
 */
const DataHeadlines = ({ metrics, insights, isLoading, error, onCreateCampaign }) => {
  const [expandedMetric, setExpandedMetric] = useState(null);

  // Toggle the expanded state of a metric
  const toggleMetricInfo = (index) => {
    if (expandedMetric === index) {
      setExpandedMetric(null);
    } else {
      setExpandedMetric(index);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              sx={{ 
                p: 2, 
                position: 'relative',
                transition: 'all 0.2s',
                cursor: 'pointer',
                height: '100%',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => toggleMetricInfo(index)}
            >
              {isLoading ? (
                <Box>
                  <Skeleton variant="text" height={46} width="50%" />
                  <Skeleton variant="text" height={26} width="70%" />
                  <Skeleton variant="text" height={20} width="40%" />
                </Box>
              ) : (
                <>
                  {/* Metric value */}
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 600,
                      color: metric.valueColor || 'text.primary'
                    }}
                  >
                    {metric.value}
                  </Typography>
                  
                  {/* Metric label */}
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    gutterBottom
                  >
                    {metric.label}
                  </Typography>
                  
                  {/* Change indicator */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: metric.isInverse 
                        ? (metric.change < 0 ? 'success.main' : 'error.main')
                        : (metric.change > 0 ? 'success.main' : 'error.main')
                    }}
                  >
                    {metric.isInverse 
                      ? (metric.change < 0 ? <TrendingDownIcon fontSize="small" /> : <TrendingUpIcon fontSize="small" />)
                      : (metric.change > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />)
                    }
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {metric.change > 0 ? '+' : ''}{metric.change}% ({metric.timeframe})
                    </Typography>
                  </Box>
                  
                  {/* Info icon in top-right */}
                  <Tooltip title="Click for more information">
                    <InfoIcon 
                      fontSize="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10,
                        color: 'action.active'
                      }}
                    />
                  </Tooltip>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Expanded Metric Info */}
      {expandedMetric !== null && !isLoading && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">{metrics[expandedMetric].label} Details</Typography>
            <IconButton onClick={() => setExpandedMetric(null)} size="small">
              <MoreIcon />
            </IconButton>
          </Box>
          
          <Typography variant="body1" paragraph>
            {metrics[expandedMetric].explanation}
          </Typography>
          
          {metrics[expandedMetric].recommendation && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
              <LightbulbIcon color="warning" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="body2">
                <strong>Recommendation:</strong> {metrics[expandedMetric].recommendation}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
      
      {/* Insights Section */}
      <Typography variant="h6" gutterBottom>
        Key Insights
      </Typography>
      
      <Grid container spacing={3}>
        {isLoading ? (
          Array(3).fill().map((_, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Paper sx={{ p: 2 }}>
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={60} />
                <Skeleton variant="rectangular" height={36} width="50%" sx={{ mt: 2 }} />
              </Paper>
            </Grid>
          ))
        ) : (
          insights.map((insight, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      gap: 1
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ fontWeight: 500, flexGrow: 1 }}
                    >
                      {insight.title}
                    </Typography>
                    <Chip 
                      label={insight.severity} 
                      size="small"
                      color={
                        insight.severity === 'high' ? 'error' : 
                        insight.severity === 'medium' ? 'warning' : 
                        'default'
                      }
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {insight.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={insight.action.onClick}
                    startIcon={<ChartIcon />}
                  >
                    {insight.action.label}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      
      {/* Call to Action */}
      {!isLoading && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 3
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<CampaignIcon />}
            onClick={onCreateCampaign}
          >
            Create Campaign Based on Insights
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DataHeadlines;