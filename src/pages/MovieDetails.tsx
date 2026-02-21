import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Share2, ArrowLeft, Star, Clock, Calendar, Loader2, Check, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MovieRow } from '@/components/MovieRow';
import { VideoPlayer } from '@/components/VideoPlayer';
import { MovieJsonLd } from '@/components/MovieJsonLd';
import { AuthModal } from '@/components/AuthModal';
import { useMovies } from '@/hooks/useMovies';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const MovieDetails = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: movies = [], isLoading } = useMovies();
  const { user } = useAuth();
  const { isLiked, isInList, toggleLike, toggleMyList } = useFavorites();
  
  const movie = movies.find(m => m.id === id);
  const similarMovies = movies.filter(m => m.category === movie?.category && m.id !== id);
  const playbackUrl = movie?.videoUrl || movie?.trailerUrl;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie?.title,
          text: movie?.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <Link to="/">
            <Button variant="hero">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{movie.title} - Watch on A2S OTT</title>
        <meta name="description" content={movie.description || `Watch ${movie.title} on A2S OTT streaming platform`} />
        <meta property="og:title" content={`${movie.title} - A2S OTT`} />
        <meta property="og:description" content={movie.description || ''} />
        <meta property="og:image" content={movie.poster} />
        <meta property="og:type" content="video.movie" />
      </Helmet>
      
      {/* JSON-LD Structured Data */}
      <MovieJsonLd movie={movie} />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px]">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        {/* Back Button */}
        <Link 
          to="/" 
          className="absolute top-24 left-4 md:left-8 z-10 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-end pb-16">
          <div className="flex gap-8 items-end">
            {/* Poster */}
            <div className="hidden md:block w-64 rounded-xl overflow-hidden shadow-2xl shadow-black/50 flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>

            {/* Info */}
            <div className="max-w-2xl">
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                {movie.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-semibold text-foreground">{movie.rating}</span>
                  <span>/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-secondary rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-lg mb-8 max-w-xl">
                {movie.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  variant="hero" 
                  size="xl" 
                  className="gap-2"
                  onClick={() => user ? setIsPlaying(true) : handleAuthRequired()}
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Button>
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="gap-2"
                  onClick={() => user ? toggleMyList(movie.id) : handleAuthRequired()}
                >
                  {isInList(movie.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isInList(movie.id) ? 'In List' : 'My List'}
                </Button>
                <Button 
                  variant="glass" 
                  size="icon" 
                  className={`h-12 w-12 ${isLiked(movie.id) ? 'text-primary' : ''}`}
                  onClick={() => user ? toggleLike(movie.id) : handleAuthRequired()}
                >
                  {isLiked(movie.id) ? <Heart className="w-5 h-5 fill-current" /> : <ThumbsUp className="w-5 h-5" />}
                </Button>
                <Button 
                  variant="glass" 
                  size="icon" 
                  className="h-12 w-12"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {isPlaying && playbackUrl && (
        <VideoPlayer
          videoUrl={playbackUrl}
          poster={movie.poster}
          title={movie.title}
          onClose={() => setIsPlaying(false)}
          isFullScreen
        />
      )}
      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <MovieRow title="Similar Movies" movies={similarMovies} className="pt-12" />
      )}

      <Footer />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default MovieDetails;
