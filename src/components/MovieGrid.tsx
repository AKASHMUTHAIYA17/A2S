import { useEffect, useRef, useCallback } from 'react';
import { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieGridProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  className?: string;
}

export function MovieGrid({
  title,
  movies,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  className,
}: MovieGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        No movies available yet. Check back soon!
      </div>
    );
  }

  return (
    <section className={cn('py-4 sm:py-6 md:py-8', className)}>
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold mb-4 sm:mb-6">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-6">
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          )}
        </div>
      </div>
    </section>
  );
}
