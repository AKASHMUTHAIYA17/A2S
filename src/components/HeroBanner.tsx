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
    <section className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.banner || currentMovie.poster}
          alt={currentMovie.title}
          className="w-full h-full object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 sm:via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 sm:via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-end sm:items-center pb-16 sm:pb-0">
        <div className="max-w-full sm:max-w-xl md:max-w-2xl animate-fade-in">
          {/* Category Badge */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="px-2 sm:px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              Featured
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 sm:w-4 h-3 sm:h-4 text-primary fill-primary" />
              <span className="text-xs sm:text-sm font-medium">{currentMovie.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-2 sm:mb-4 leading-tight">
            {currentMovie.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-muted-foreground text-xs sm:text-sm">
            <span>{currentMovie.year}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{currentMovie.duration}</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="hidden sm:flex gap-2">
              {currentMovie.genres.slice(0, 3).map((genre) => (
                <span key={genre} className="px-2 py-0.5 bg-secondary rounded text-xs">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 line-clamp-2 sm:line-clamp-3 max-w-full sm:max-w-xl">
            {currentMovie.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to={`/movie/${currentMovie.id}`}>
              <Button variant="hero" size="default" className="gap-1 sm:gap-2 text-sm sm:text-base px-4 sm:px-6">
                <Play className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link to={`/movie/${currentMovie.id}`}>
              <Button variant="glass" size="default" className="gap-1 sm:gap-2 text-sm sm:text-base px-4 sm:px-6">
                <Info className="w-4 sm:w-5 h-4 sm:h-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <div className="hidden sm:flex absolute bottom-1/2 translate-y-1/2 left-4 right-4 justify-between pointer-events-none">
        <button
          onClick={goToPrevious}
          className="p-2 sm:p-3 rounded-full glass hover:bg-foreground/20 transition-colors pointer-events-auto"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>
        <button
          onClick={goToNext}
          className="p-2 sm:p-3 rounded-full glass hover:bg-foreground/20 transition-colors pointer-events-auto"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 bg-black/30 px-3 py-2 rounded-full backdrop-blur-sm">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              'transition-all duration-300 rounded-full',
              index === currentIndex
                ? 'w-8 sm:w-10 h-2.5 sm:h-3 bg-primary'
                : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/50 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </section>
  );
}
