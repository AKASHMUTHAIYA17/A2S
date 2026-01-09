import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMovies } from '@/hooks/useMovies';
import { Link } from 'react-router-dom';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const { data: movies = [], isLoading } = useMovies();
  
  const filteredMovies = query.length > 1
    ? movies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description?.toLowerCase().includes(query.toLowerCase()) ||
        movie.category?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Search Movies</DialogTitle>
          <DialogDescription>Search for movies by title, description, or category</DialogDescription>
        </VisuallyHidden>
        <div className="flex items-center border-b border-border px-4">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-lg"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-secondary rounded">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          
          {query.length > 1 && filteredMovies.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              No movies found for "{query}"
            </div>
          )}
          
          {filteredMovies.length > 0 && (
            <div className="p-2">
              {filteredMovies.map(movie => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {movie.year} • {movie.category}
                    </p>
                  </div>
                  <div className="text-sm text-primary font-medium">
                    ★ {movie.rating}
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {query.length <= 1 && (
            <div className="text-center py-8 text-muted-foreground">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
