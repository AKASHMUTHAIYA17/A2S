import { Apple, Smartphone } from 'lucide-react';

interface AppDownloadBadgesProps {
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AppDownloadBadges({ 
  variant = 'horizontal', 
  size = 'md',
  className = '' 
}: AppDownloadBadgesProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} gap-3 ${className}`}>
      {/* Google Play Store */}
      <a
        href="https://play.google.com/store/apps/details?id=app.lovable.889ffb0fced4489086d391287e863f5b"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center ${sizeClasses[size]} bg-secondary hover:bg-secondary/80 rounded-lg transition-all duration-200 hover:scale-105 border border-border`}
      >
        <Smartphone className={iconSizes[size]} />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] text-muted-foreground">GET IT ON</span>
          <span className="font-semibold">Google Play</span>
        </div>
      </a>

      {/* Apple App Store */}
      <a
        href="https://apps.apple.com/app/a2sott/id123456789"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center ${sizeClasses[size]} bg-secondary hover:bg-secondary/80 rounded-lg transition-all duration-200 hover:scale-105 border border-border`}
      >
        <Apple className={iconSizes[size]} />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] text-muted-foreground">Download on the</span>
          <span className="font-semibold">App Store</span>
        </div>
      </a>
    </div>
  );
}
