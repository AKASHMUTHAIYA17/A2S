import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { SearchDialog } from './SearchDialog';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Heart, label: 'Watchlist', path: '/watchlist' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNavBar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (path === '/search') {
      e.preventDefault();
      setIsSearchOpen(true);
    }
    if (path === '/profile' && !user) {
      e.preventDefault();
      window.location.href = '/auth';
    }
    if (path === '/watchlist' && !user) {
      e.preventDefault();
      window.location.href = '/auth';
    }
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(path);
            
            return (
              <Link
                key={path}
                to={path === '/search' || (path === '/profile' && !user) || (path === '/watchlist' && !user) ? '#' : path}
                onClick={(e) => handleNavClick(path, e)}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 min-w-[64px]',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground active:scale-95'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]')} />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && (
                  <div className="absolute bottom-1 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
