import { useState, useEffect } from 'react';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { movies } from '@/data/movies';
import { Movie } from '@/types/movie';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function HeroBanner() {
  const featuredMovies = movies.filter((m) => m.featured);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMovie = featuredMovies[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.banner || currentMovie.poster}
          alt={currentMovie.title}
          className="w-full h-full object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl animate-fade-in">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-xs font-semibold uppercase tracking-wider">
              Featured
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium">{currentMovie.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 leading-tight">
            {currentMovie.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4 text-muted-foreground text-sm">
            <span>{currentMovie.year}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{currentMovie.duration}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="flex gap-2">
              {currentMovie.genres.slice(0, 3).map((genre) => (
                <span key={genre} className="px-2 py-0.5 bg-secondary rounded text-xs">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-8 line-clamp-3 max-w-xl">
            {currentMovie.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to={`/movie/${currentMovie.id}`}>
              <Button variant="hero" size="xl" className="gap-2">
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link to={`/movie/${currentMovie.id}`}>
              <Button variant="glass" size="xl" className="gap-2">
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
        <button
          onClick={goToPrevious}
          className="p-3 rounded-full glass hover:bg-foreground/20 transition-colors pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="p-3 rounded-full glass hover:bg-foreground/20 transition-colors pointer-events-auto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-1.5 bg-foreground/30 hover:bg-foreground/50'
            )}
          />
        ))}
      </div>
    </section>
  );
}
