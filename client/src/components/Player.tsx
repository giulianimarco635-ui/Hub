import { usePlayer } from "@/hooks/use-player";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, X, ChevronDown, SkipBack, SkipForward, 
  Maximize2, Minimize2, Video as VideoIcon, Music 
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function Player() {
  const { 
    currentEpisode, isPlaying, togglePlayPause, 
    progress, currentTime, duration, seek, skip,
    close, isExpanded, setIsExpanded 
  } = usePlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync external video element if playing video
  useEffect(() => {
    if (currentEpisode?.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = currentTime;
      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isPlaying, currentEpisode]); 

  // We rely on the context to drive state, but the actual video element in the expanded view 
  // needs to be synced or we can let the context handle the audio and this handle the visuals.
  // Ideally, context owns the media element. 
  // For simplicity here: If video, we render a video tag in full screen. 
  // The context's audio ref is unused for video type.

  if (!currentEpisode) return null;

  return (
    <AnimatePresence>
      {/* Expanded Player Overlay */}
      {isExpanded && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setIsExpanded(false)} className="p-2 rounded-full hover:bg-white/10">
              <ChevronDown className="w-8 h-8 text-muted-foreground" />
            </button>
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Now Playing</span>
            <button onClick={close} className="p-2 rounded-full hover:bg-white/10">
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
            {currentEpisode.type === 'video' ? (
               <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
                 <video 
                   src={currentEpisode.url}
                   className="w-full h-full object-cover"
                   ref={el => {
                     // This video element needs to drive the context state if visible
                     // A complex app would hoist this ref to context.
                     // For this "mini app", we'll let the native controls handle some bits or just duplicate for visual
                     // Actually, best to let the context logic drive the audio, but for video we need the element here.
                     // HACK: For this implementation, we will use the context's state to sync this video
                     if(el && Math.abs(el.currentTime - currentTime) > 0.5 && !isDragging) {
                        el.currentTime = currentTime;
                     }
                     if(el) {
                       if(isPlaying && el.paused) el.play();
                       if(!isPlaying && !el.paused) el.pause();
                     }
                   }}
                   muted={false} // Audio should come from here for video
                   playsInline
                   onTimeUpdate={(e) => !isDragging && seek(e.currentTarget.currentTime)}
                   onEnded={() => togglePlayPause()}
                 />
               </div>
            ) : (
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-gray-800 to-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center ring-1 ring-white/10">
                 {currentEpisode.thumbnail ? (
                   <img src={currentEpisode.thumbnail} alt="Album Art" className="w-full h-full object-cover rounded-3xl" />
                 ) : (
                   <Music className="w-32 h-32 text-white/20" />
                 )}
              </div>
            )}

            <div className="text-center w-full max-w-md space-y-2">
              <h2 className="text-2xl font-display font-bold leading-tight text-white">{currentEpisode.title}</h2>
              <p className="text-muted-foreground font-medium">{currentEpisode.monthName} {currentEpisode.year}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="p-8 pb-12 bg-gradient-to-t from-black/50 to-transparent space-y-6 w-full max-w-2xl mx-auto">
            {/* Scrubber */}
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={isDragging ? dragTime : currentTime}
                onChange={(e) => {
                  setIsDragging(true);
                  setDragTime(Number(e.target.value));
                }}
                onMouseUp={() => {
                  seek(dragTime);
                  setIsDragging(false);
                }}
                onTouchEnd={() => {
                  seek(dragTime);
                  setIsDragging(false);
                }}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>{formatTime(isDragging ? dragTime : currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={() => skip(-10)}
                className="p-3 text-white hover:text-primary transition-colors"
              >
                <SkipBack className="w-8 h-8" />
              </button>
              
              <button 
                onClick={togglePlayPause}
                className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_30px_-5px_var(--primary)] hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>

              <button 
                onClick={() => skip(10)}
                className="p-3 text-white hover:text-primary transition-colors"
              >
                <SkipForward className="w-8 h-8" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mini Player */}
      {!isExpanded && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-2 md:p-4"
        >
          <div 
            onClick={() => setIsExpanded(true)}
            className="bg-card/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-4 shadow-2xl cursor-pointer hover:bg-card transition-colors max-w-4xl mx-auto"
          >
             <div className="w-12 h-12 rounded-lg bg-secondary flex-shrink-0 overflow-hidden relative">
               {currentEpisode.type === 'video' ? (
                 <VideoIcon className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
               ) : currentEpisode.thumbnail ? (
                  <img src={currentEpisode.thumbnail} alt="" className="w-full h-full object-cover" />
               ) : (
                  <Music className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
               )}
             </div>
             
             <div className="flex-1 min-w-0">
               <h4 className="font-bold text-sm truncate pr-2">{currentEpisode.title}</h4>
               <p className="text-xs text-muted-foreground truncate">{currentEpisode.monthName} {currentEpisode.year}</p>
             </div>

             <div className="flex items-center gap-1 md:gap-3" onClick={e => e.stopPropagation()}>
               <button 
                 onClick={() => skip(-10)} 
                 className="p-2 text-muted-foreground hover:text-white hidden sm:block"
               >
                 <SkipBack className="w-5 h-5" />
               </button>
               <button 
                 onClick={togglePlayPause}
                 className="p-2 bg-white text-black rounded-full hover:scale-105 transition-transform"
               >
                 {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
               </button>
               <button 
                 onClick={close} 
                 className="p-2 text-muted-foreground hover:text-destructive"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
          </div>
          {/* Mini progress bar at bottom of miniplayer card */}
          <div className="absolute bottom-2 left-6 right-6 h-0.5 bg-transparent overflow-hidden rounded-full max-w-4xl mx-auto">
             <div 
               className="h-full bg-primary/50" 
               style={{ width: `${progress}%` }}
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
