import Papa from 'papaparse';
import _ from 'lodash';

export class CampaignDataService {
  constructor() {
    this.segments = [];
  }

  async loadPOSData() {
    try {
      const response = await window.fs.readFile('point_of_sale_dataset.csv', { encoding: 'utf8' });
      
      return new Promise((resolve, reject) => {
        Papa.parse(response, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const segments = this.generateSegments(results.data);
            resolve(segments);
          },
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error('Error loading POS data:', error);
      throw error;
    }
  }

  generateSegments(data) {
    // Group by Customer_ID
    const customerPurchases = _.groupBy(data, 'Customer_ID');
    
    // Calculate customer metrics
    const customerMetrics = _.map(customerPurchases, (purchases, customerId) => {
      const totalSpent = _.sumBy(purchases, 'Total_Price');
      const purchaseFrequency = purchases.length;
      const avgOrderValue = totalSpent / purchaseFrequency;
      const uniqueProducts = _.uniqBy(purchases, 'Product_ID').length;
      const preferredPaymentMethod = _.chain(purchases)
        .countBy('Payment_Method')
        .toPairs()
        .maxBy(1)
        .value()[0];
      
      return {
        customerId,
        totalSpent,
        purchaseFrequency,
        avgOrderValue,
        uniqueProducts,
        preferredPaymentMethod,
        recentPurchases: _.takeRight(_.sortBy(purchases, 'Date'), 3)
      };
    });

    // Calculate segment thresholds
    const spendingThreshold = _.mean(_.map(customerMetrics, 'totalSpent'));
    const frequencyThreshold = _.mean(_.map(customerMetrics, 'purchaseFrequency'));

    // Define segments
    const segments = [
      {
        name: "High-Value Shoppers",
        size: _.filter(customerMetrics, cm => cm.totalSpent > spendingThreshold && cm.purchaseFrequency > frequencyThreshold).length,
        characteristics: [
          "Above average spending",
          "Frequent purchases",
          "High loyalty potential"
        ],
        recentBehaviors: [
          "Multiple purchases per month",
          "High average order value",
          "Diverse product selection"
        ],
        suggestedApproach: "Premium loyalty rewards"
      },
      {
        name: "Occasional Big Spenders",
        size: _.filter(customerMetrics, cm => cm.totalSpent > spendingThreshold && cm.purchaseFrequency <= frequencyThreshold).length,
        characteristics: [
          "High order value",
          "Infrequent purchases",
          "Quality-focused"
        ],
        recentBehaviors: [
          "Large individual purchases",
          "Extended time between purchases",
          "Premium product preference"
        ],
        suggestedApproach: "Exclusive offers"
      },
      {
        name: "Regular Value Seekers",
        size: _.filter(customerMetrics, cm => cm.totalSpent <= spendingThreshold && cm.purchaseFrequency > frequencyThreshold).length,
        characteristics: [
          "Frequent small purchases",
          "Price-sensitive",
          "Consistent engagement"
        ],
        recentBehaviors: [
          "Regular small purchases",
          "Response to promotions",
          "Basic product focus"
        ],
        suggestedApproach: "Value-based promotions"
      }
    ];

    // Add customer count and sample behaviors
    segments.forEach(segment => {
      segment.customerSample = _.chain(customerMetrics)
        .filter(cm => this.matchesSegment(cm, segment.name, spendingThreshold, frequencyThreshold))
        .take(5)
        .value();
    });

    return segments;
  }

  matchesSegment(customerMetrics, segmentName, spendingThreshold, frequencyThreshold) {
    switch (segmentName) {
      case "High-Value Shoppers":
        return customerMetrics.totalSpent > spendingThreshold && customerMetrics.purchaseFrequency > frequencyThreshold;
      case "Occasional Big Spenders":
        return customerMetrics.totalSpent > spendingThreshold && customerMetrics.purchaseFrequency <= frequencyThreshold;
      case "Regular Value Seekers":
        return customerMetrics.totalSpent <= spendingThreshold && customerMetrics.purchaseFrequency > frequencyThreshold;
      default:
        return false;
    }
  }

  async generateContent(segment, apiKey) {
    try {
      const prompt = this.createPromptFromSegment(segment);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a marketing specialist creating personalized campaign content."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      return this.parseOpenAIResponse(data, segment);
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  createPromptFromSegment(segment) {
    return `Create a marketing campaign for the following customer segment:
    
Segment Name: ${segment.name}
Size: ${segment.size} customers
Characteristics: ${segment.characteristics.join(', ')}
Recent Behaviors: ${segment.recentBehaviors.join(', ')}
Suggested Approach: ${segment.suggestedApproach}

Please provide a campaign in the following format:
1. Campaign Title
2. Main Headline
3. Description (2-3 sentences)
4. Call to Action
5. Three key selling points
6. Recommended channels for distribution
7. Suggested campaign duration`;
  }

  parseOpenAIResponse(data, segment) {
    const content = data.choices[0].message.content;
    
    // Parse the response into structured content
    const lines = content.split('\n').filter(line => line.trim());
    
    return {
      title: lines.find(l => l.includes('Title'))?.split(':')[1]?.trim() || `${segment.suggestedApproach} Campaign`,
      headline: lines.find(l => l.includes('Headline'))?.split(':')[1]?.trim() || "Special Offer Inside",
      description: lines.find(l => l.includes('Description'))?.split(':')[1]?.trim() || "",
      cta: lines.find(l => l.includes('Call to Action'))?.split(':')[1]?.trim() || "Shop Now",
      sellingPoints: lines.find(l => l.includes('selling points'))?.split(':')[1]?.split(',').map(p => p.trim()) || [],
      recommendedChannels: lines.find(l => l.includes('channels'))?.split(':')[1]?.split(',').map(c => c.trim()) || [],
      duration: lines.find(l => l.includes('duration'))?.split(':')[1]?.trim() || "30 days",
      predictedEngagement: "85%", // This could be calculated based on historical data
      targetAudience: segment.name,
      segmentSize: segment.size
    };
  }
}