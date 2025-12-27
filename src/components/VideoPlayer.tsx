import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoUrl: string;
  poster: string;
  title: string;
  onClose?: () => void;
  isFullScreen?: boolean;
}

export const VideoPlayer = ({ videoUrl, poster, title, onClose, isFullScreen = false }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isFullScreen);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  let hideControlsTimeout: NodeJS.Timeout;

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
    clearTimeout(hideControlsTimeout);
    hideControlsTimeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black ${isFullScreen ? 'fixed inset-0 z-50' : 'w-full aspect-video rounded-xl overflow-hidden'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Play overlay when paused */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow transition-transform hover:scale-110">
            <Play className="w-10 h-10 text-primary-foreground fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
      )}

      {/* Title */}
      {showControls && (
        <div className="absolute top-4 left-4 right-16 z-10">
          <h3 className="text-xl font-semibold text-white drop-shadow-lg truncate">{title}</h3>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div
          className="w-full h-1 bg-muted/30 rounded-full mb-4 cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary rounded-full relative transition-all group-hover:h-1.5"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-primary hover:bg-white/10"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-primary hover:bg-white/10"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>

            <span className="text-sm text-white/80">
              {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'} / {videoRef.current ? formatTime(videoRef.current.duration || 0) : '0:00'}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-primary hover:bg-white/10"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
