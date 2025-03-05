import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Button
} from '@mui/material';

/**
 * Props:
 *  - channelsContent: object containing channel keys (e.g. "Email", "SMS") 
 *    and their corresponding generated content, like:
 *    {
 *      Email: {
 *        headline: "Email Headline",
 *        message: "Email body copy...",
 *        cta: "Click Here",
 *        bestTime: "10 AM",
 *        engagement: "25%"
 *      },
 *      SMS: {
 *        headline: "SMS Headline",
 *        message: "SMS body copy...",
 *        cta: "Reply YES",
 *        bestTime: "9 AM",
 *        engagement: "15%"
 *      },
 *      ...etc.
 *    }
 *  - onLaunch: function to call when user clicks "Launch Campaign"
 */
function ReviewAndLaunch({ channelsContent, onLaunch }) {
  const [selectedChannels, setSelectedChannels] = useState([]);

  // Extract channel names from the object keys (e.g. ["Email", "SMS", ...])
  const availableChannels = Object.keys(channelsContent || {});

  // Toggle channel selection on checkbox change
  const handleToggleChannel = (channel) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter((ch) => ch !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  // Final launch action
  const handleLaunch = () => {
    // You can pass the selected channels to your API, store, etc.
    onLaunch(selectedChannels);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Review & Launch
      </Typography>

      <Typography variant="body1" gutterBottom>
        Select which channels you want to include in your campaign:
      </Typography>

      {/* Channel checkboxes */}
      <Box sx={{ mb: 3 }}>
        {availableChannels.map((channel) => (
          <FormControlLabel
            key={channel}
            control={
              <Checkbox
                checked={selectedChannels.includes(channel)}
                onChange={() => handleToggleChannel(channel)}
              />
            }
            label={channel}
          />
        ))}
      </Box>

      {/* Previews for each selected channel */}
      {selectedChannels.map((channel) => {
        const content = channelsContent[channel];
        return (
          <Card key={channel} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {channel} Preview
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Headline:</strong> {content.headline}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Message:</strong> {content.message}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>CTA:</strong> {content.cta}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Best Time:</strong> {content.bestTime}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Expected Engagement:</strong> {content.engagement}
              </Typography>
            </CardContent>
          </Card>
        );
      })}

      {/* Launch button */}
      <Box sx={{ textAlign: 'right', mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleLaunch}
          disabled={selectedChannels.length === 0}
        >
          Launch Campaign
        </Button>
      </Box>
    </Box>
  );
}

export default ReviewAndLaunch;
