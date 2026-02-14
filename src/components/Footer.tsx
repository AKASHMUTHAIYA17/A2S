import { Link } from 'react-router-dom';
import { Play, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { AppDownloadBadges } from './AppDownloadBadges';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-8 sm:mt-12 md:mt-16">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-primary flex items-center justify-center">
                <Play className="w-4 sm:w-5 h-4 sm:h-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-lg sm:text-xl font-display font-bold text-gradient">A2S OTT</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Stream unlimited movies and TV shows on any device.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </a>
              <a href="#" className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </a>
              <a href="#" className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </a>
              <a href="#" className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link to="/subscription" className="hover:text-primary transition-colors">Subscription</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Categories</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><Link to="/category/action" className="hover:text-primary transition-colors">Action</Link></li>
              <li><Link to="/category/drama" className="hover:text-primary transition-colors">Drama</Link></li>
              <li><Link to="/category/comedy" className="hover:text-primary transition-colors">Comedy</Link></li>
              <li><Link to="/category/thriller" className="hover:text-primary transition-colors">Thriller</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
            
            {/* App Download */}
            <div className="mt-4 pt-4 border-t border-border">
              <h5 className="font-medium text-xs sm:text-sm mb-2">Install the App</h5>
              <AppDownloadBadges variant="vertical" size="sm" />
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} A2S OTT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
