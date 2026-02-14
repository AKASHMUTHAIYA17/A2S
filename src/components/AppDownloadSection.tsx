import { Smartphone, Zap, Download, Wifi, Film } from 'lucide-react';
import { AppDownloadBadges } from './AppDownloadBadges';

export function AppDownloadSection() {
  const features = [
    { icon: Zap, text: 'Instant streaming' },
    { icon: Film, text: 'All movies from the site' },
    { icon: Wifi, text: 'Watch anywhere' },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Phone Mockup */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-48 sm:w-56 md:w-64 h-96 sm:h-[28rem] md:h-[32rem] bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2.5rem] border-4 border-border shadow-2xl flex items-center justify-center">
                <div className="w-[90%] h-[95%] bg-card rounded-[2rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-muted flex items-center justify-center">
                    <div className="w-16 h-4 bg-background rounded-full" />
                  </div>
                  <div className="flex-1 p-3 space-y-3">
                    <div className="h-32 bg-primary/20 rounded-xl animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted/50 rounded w-1/2" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-muted/30 rounded-lg" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-3xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Install from Website</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              Install the <span className="text-gradient">A2S OTT</span> App
            </h2>
            
            <p className="text-muted-foreground text-base sm:text-lg mb-6 max-w-lg mx-auto lg:mx-0">
              No app store needed! Install directly from this website and get access to all the movies available on the site — right on your phone.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Install Button */}
            <AppDownloadBadges size="lg" className="justify-center lg:justify-start" />
          </div>
        </div>
      </div>
    </section>
  );
}
