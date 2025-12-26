import { Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '@/types/movie';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className={cn(
        'group relative flex-shrink-0 rounded-xl overflow-hidden card-glow',
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

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50 animate-pulse-glow">
          <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
        </div>
      </div>

      {/* Rating Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md glass">
        <Star className="w-3 h-3 text-primary fill-primary" />
        <span className="text-xs font-semibold">{movie.rating}</span>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{movie.year}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="capitalize">{movie.category}</span>
        </div>
      </div>
    </Link>
  );
}
