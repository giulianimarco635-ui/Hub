import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { type Episode } from "@shared/schema";

interface PlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  progress: number; // 0-100
  currentTime: number;
  duration: number;
  play: (episode: Episode) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  skip: (seconds: number) => void;
  close: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Helper to get active media element
  const getMediaElement = () => {
    if (!currentEpisode) return null;
    return currentEpisode.type === 'video' ? videoRef.current : audioRef.current;
  };

  useEffect(() => {
    // Reset state when episode changes
    if (currentEpisode) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
      
      // Auto-play logic handled by refs in render
      const media = getMediaElement();
      if (media) {
        media.load();
        media.play().catch(e => console.error("Auto-play failed:", e));
      }
    }
  }, [currentEpisode?.id]);

  const handleTimeUpdate = () => {
    const media = getMediaElement();
    if (media) {
      setCurrentTime(media.currentTime);
      setDuration(media.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const play = (episode: Episode) => {
    if (currentEpisode?.id === episode.id) {
      togglePlayPause();
    } else {
      setCurrentEpisode(episode);
      setIsExpanded(true); // Auto expand on new play
    }
  };

  const togglePlayPause = () => {
    const media = getMediaElement();
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    const media = getMediaElement();
    if (media) {
      media.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    const media = getMediaElement();
    if (media) {
      const newTime = media.currentTime + seconds;
      media.currentTime = Math.max(0, Math.min(newTime, media.duration || 0));
    }
  };

  const close = () => {
    const media = getMediaElement();
    if (media) media.pause();
    setCurrentEpisode(null);
    setIsPlaying(false);
    setIsExpanded(false);
  };

  // Attach event listeners dynamically
  useEffect(() => {
    const media = getMediaElement();
    if (!media) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('ended', handleEnded);
    media.addEventListener('play', onPlay);
    media.addEventListener('pause', onPause);
    media.addEventListener('loadedmetadata', handleTimeUpdate);

    return () => {
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('ended', handleEnded);
      media.removeEventListener('play', onPlay);
      media.removeEventListener('pause', onPause);
      media.removeEventListener('loadedmetadata', handleTimeUpdate);
    };
  }, [currentEpisode, currentEpisode?.type]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        progress,
        currentTime,
        duration,
        play,
        togglePlayPause,
        seek,
        skip,
        close,
        isExpanded,
        setIsExpanded
      }}
    >
      {children}
      {/* Hidden Audio Player */}
      <audio 
        ref={audioRef} 
        src={currentEpisode?.type === 'audio' ? currentEpisode.url : undefined} 
        className="hidden" 
        playsInline
      />
      {/* Hidden Video Player Logic - video element is actually rendered in the UI overlay */}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
