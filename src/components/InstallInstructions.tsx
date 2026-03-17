import { useState } from 'react';
import { X, Share, MoreVertical, Plus, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InstallInstructionsProps {
  platform: 'ios' | 'android' | 'desktop';
  onClose: () => void;
}

export function InstallInstructions({ platform, onClose }: InstallInstructionsProps) {
  const instructions = {
    ios: [
      { step: 1, icon: <Share className="w-5 h-5" />, text: 'Tap the Share button at the bottom of Safari' },
      { step: 2, icon: <Plus className="w-5 h-5" />, text: 'Scroll down and tap "Add to Home Screen"' },
      { step: 3, icon: <ArrowDown className="w-5 h-5" />, text: 'Tap "Add" to install A2S OTT' },
    ],
    android: [
      { step: 1, icon: <MoreVertical className="w-5 h-5" />, text: 'Tap the menu (⋮) in Chrome' },
      { step: 2, icon: <ArrowDown className="w-5 h-5" />, text: 'Tap "Install app" or "Add to Home screen"' },
      { step: 3, icon: <Plus className="w-5 h-5" />, text: 'Tap "Install" to add A2S OTT' },
    ],
    desktop: [
      { step: 1, icon: <ArrowDown className="w-5 h-5" />, text: 'Click the install icon (⊕) in the address bar' },
      { step: 2, icon: <Plus className="w-5 h-5" />, text: 'Click "Install" in the popup dialog' },
    ],
  };

  const steps = instructions[platform];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm mx-4 mb-4 sm:mb-0 bg-card border border-border rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Install A2S OTT</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Steps */}
        <div className="p-4 space-y-4">
          {steps.map(({ step, icon, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                {step}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-primary">{icon}</span>
                <p className="text-sm text-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button onClick={onClose} className="w-full" variant="default">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
