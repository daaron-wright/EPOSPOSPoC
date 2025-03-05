import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ChannelContentGenerator = ({ 
  selectedChannel, 
  segmentData, 
  onContentGenerated,
  className 
}) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateChannelContent = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      // Construct channel-specific prompt
      const channelPrompt = `Create marketing content for ${selectedChannel} channel targeting this customer segment:
      
Segment: ${segmentData.name}
Size: ${segmentData.size} customers
Characteristics: ${segmentData.characteristics.join(', ')}
Recent Behaviors: ${segmentData.recentBehaviors.join(', ')}

Channel requirements for ${selectedChannel}:
${getChannelRequirements(selectedChannel)}

Please provide:
1. Headline (attention-grabbing, channel-appropriate length)
2. Main message (formatted for ${selectedChannel})
3. Call-to-action
4. Best time to send
5. Expected engagement metrics`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a marketing expert specialized in creating channel-specific content. Format your responses in a clear, structured way."
            },
            {
              role: "user",
              content: channelPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content;

      // Parse the AI response into structured content
      const contentLines = aiContent.split('\n').filter(line => line.trim());
      const content = {
        headline: extractContent(contentLines, 'Headline:') || `Special ${selectedChannel} Offer`,
        message: extractContent(contentLines, 'Main message:') || `Exclusive deal for ${segmentData.name}`,
        cta: extractContent(contentLines, 'Call-to-action:') || "Shop Now",
        bestTime: extractContent(contentLines, 'Best time:') || "2pm local time",
        engagement: extractContent(contentLines, 'Expected engagement:') || "25%"
      };

      // Send successful response to parent
      onContentGenerated({
        channel: selectedChannel,
        content: mockResponse
      });

    } catch (err) {
      setError(`Failed to generate content: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const getChannelRequirements = (channel) => {
    const requirements = {
      'Email': '- Professional tone\n- Detailed content\n- Clear sections\n- HTML formatting allowed',
      'SMS': '- Maximum 160 characters\n- Urgent tone\n- Clear offer\n- Single call-to-action',
      'Social Media': '- Casual tone\n- Engaging content\n- Shareable message\n- Hashtag suggestions',
      'Push Notification': '- Maximum 50 characters for title\n- Compelling reason to click\n- Time-sensitive message',
      'In-App Message': '- Friendly tone\n- Personalized content\n- Clear value proposition\n- Non-intrusive timing'
    };
    return requirements[channel] || '';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Generate {selectedChannel} Content</h3>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate optimized content for {selectedChannel} targeting {segmentData.size.toLocaleString()} customers
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Channel Requirements:</h4>
            <pre className="text-sm whitespace-pre-wrap">
              {getChannelRequirements(selectedChannel)}
            </pre>
          </div>

          <Button 
            onClick={generateChannelContent}
            disabled={generating}
            className="w-full"
          >
            {generating ? 'Generating...' : 'Generate Content'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelContentGenerator;