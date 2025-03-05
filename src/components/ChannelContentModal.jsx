import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import ChannelContentGenerator from './ChannelContentGenerator';

const ChannelContentModal = ({ 
  isOpen, 
  onClose, 
  segmentData,
  onContentGenerated 
}) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  
  const channels = [
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'sms', name: 'SMS', icon: '📱' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'push', name: 'Push Notification', icon: '🔔' },
    { id: 'inapp', name: 'In-App Message', icon: '💬' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Channel Content</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {!selectedChannel ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Select Communication Channel</h4>
              
              <RadioGroup 
                onValueChange={(value) => setSelectedChannel(value)}
                className="grid grid-cols-1 gap-4"
              >
                {channels.map((channel) => (
                  <div key={channel.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={channel.name} id={channel.id} />
                    <Label htmlFor={channel.id} className="flex items-center">
                      <span className="mr-2">{channel.icon}</span>
                      {channel.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <ChannelContentGenerator
              selectedChannel={selectedChannel}
              segmentData={segmentData}
              onContentGenerated={(content) => {
                onContentGenerated(content);
                onClose();
              }}
            />
          )}

          {!selectedChannel && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelContentModal;