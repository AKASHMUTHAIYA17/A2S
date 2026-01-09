import React from 'react';
import { Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '@/types/movie';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export const MovieCard = React.forwardRef<HTMLAnchorElement, MovieCardProps>(
  function MovieCard({ movie, className }, ref) {
    return (
      <Link
        ref={ref}
        to={`/movie/${movie.id}`}
        className={cn(
          'group relative flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden card-glow active:scale-95 transition-transform',
          className
        )}
      >
        {/* Poster Image */}
        <div className="aspect-[2/3] w-full">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button - Hidden on mobile, show on hover for desktop */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50 animate-pulse-glow">
            <Play className="w-5 sm:w-6 h-5 sm:h-6 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md glass">
          <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-primary fill-primary" />
          <span className="text-[10px] sm:text-xs font-semibold">{movie.rating}</span>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-background to-transparent">
          <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <span>{movie.year}</span>
            <span className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-muted-foreground" />
            <span className="capitalize">{movie.category}</span>
          </div>
        </div>
      </Link>
    );
  }
);
