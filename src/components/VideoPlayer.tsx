import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, X, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface VideoPlayerProps {
  videoUrl: string;
  poster: string;
  title: string;
  onClose?: () => void;
  isFullScreen?: boolean;
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    // YouTube
    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
      // Accept /watch?v=, /embed/, /shorts/
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }

    // Vimeo
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      const id = parts.find(p => /^\d+$/.test(p));
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }

    return null;
  } catch {
    return null;
  }
}

export const VideoPlayer = ({ videoUrl, poster, title, onClose, isFullScreen = false }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play like Netflix
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(isFullScreen);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact
        setIsPlaying(false);
      });
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'Escape':
          if (onClose) onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const bufferedPercent = (bufferedEnd / videoRef.current.duration) * 100;
      setBuffered(bufferedPercent);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const embedUrl = toEmbedUrl(videoUrl);

  // Netflix-style fullscreen modal
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Dark backdrop overlay */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Video container - centered with proper aspect ratio */}
        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {embedUrl ? (
            <div className="relative w-full h-full max-w-[100vw] max-h-[100vh]">
              <iframe
                src={embedUrl}
                title={title}
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              poster={poster}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onProgress={handleProgress}
              onWaiting={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onEnded={() => setIsPlaying(false)}
              onError={() => setIsLoading(false)}
              onClick={togglePlay}
              playsInline
            />
          )}

          {/* Play overlay when paused (only for direct video URLs) */}
          {!embedUrl && !isPlaying && !isLoading && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity"
              onClick={togglePlay}
            >
              <div className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center shadow-glow transition-transform hover:scale-110">
                <Play className="w-12 h-12 text-primary-foreground fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Close button - Netflix style top right */}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-6 right-6 z-30 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full h-12 w-12 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}
              onClick={onClose}
            >
              <X className="w-7 h-7 text-white" />
            </Button>
          )}

          {/* Title - Netflix style top left */}
          <div className={`absolute top-0 left-0 right-20 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl md:text-2xl font-display font-bold text-white drop-shadow-lg">{title}</h3>
          </div>

          {/* Controls (only for direct video URLs) */}
          {!embedUrl && (
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-6 pt-20 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Progress bar */}
              <div
                className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group relative"
                onClick={handleProgressClick}
              >
                {/* Buffered */}
                <div
                  className="absolute h-full bg-white/30 rounded-full"
                  style={{ width: `${buffered}%` }}
                />
                {/* Progress */}
                <div
                  className="absolute h-full bg-primary rounded-full transition-all group-hover:h-2"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-primary hover:bg-white/10 h-12 w-12"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                  </Button>
                  
                  {/* Skip Back */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-primary hover:bg-white/10 h-12 w-12 hidden sm:flex"
                    onClick={() => skip(-10)}
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>

                  {/* Skip Forward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-primary hover:bg-white/10 h-12 w-12 hidden sm:flex"
                    onClick={() => skip(10)}
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-primary hover:bg-white/10 h-12 w-12"
                      onClick={toggleMute}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </Button>
                    <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-24"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <span className="text-sm text-white/80 font-mono hidden sm:block">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary hover:bg-white/10 h-12 w-12"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          )}

          {/* Fullscreen button for embedded videos - Netflix style bottom right */}
          {embedUrl && (
            <div className={`absolute bottom-6 right-6 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary bg-black/70 hover:bg-black/90 h-12 w-12 rounded-full"
                onClick={toggleFullscreen}
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Non-fullscreen inline player
  return (
    <div
      ref={containerRef}
      className="relative bg-black w-full aspect-video rounded-xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          style={{ border: 'none' }}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          className="w-full h-full object-contain cursor-pointer"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onProgress={handleProgress}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsLoading(false)}
          onClick={togglePlay}
          playsInline
        />
      )}

      {/* Play overlay when paused */}
      {!embedUrl && !isPlaying && !isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110">
            <Play className="w-8 h-8 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>
      )}

      {/* Controls for inline player */}
      {!embedUrl && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <span className="text-xs text-white/80">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={toggleFullscreen}>
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};