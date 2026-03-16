import { Link } from 'react-router-dom';
import { Play, X } from 'lucide-react';
import { useContinueWatching } from '@/hooks/useContinueWatching';

export function ContinueWatchingRow() {
  const { items, removeItem } = useContinueWatching();

  if (items.length === 0) return null;

  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-display font-bold mb-4">▶ Continue Watching</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {items.map((item) => (
            <div key={item.movieId} className="relative flex-shrink-0 w-40 sm:w-48 snap-start group">
              <Link to={`/movie/${item.movieId}`}>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-card">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Play className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-10 h-10 text-primary fill-current" />
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div
                      className="h-full bg-primary rounded-r-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
              <button
                onClick={() => removeItem(item.movieId)}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
              <p className="mt-1.5 text-xs font-medium text-foreground truncate">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
