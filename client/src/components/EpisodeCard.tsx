import { type Episode } from "@shared/schema";
import { Play, Video, Music } from "lucide-react";
import { usePlayer } from "@/hooks/use-player";
import clsx from "clsx";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const { play, currentEpisode, isPlaying } = usePlayer();
  const isCurrent = currentEpisode?.id === episode.id;

  return (
    <div 
      onClick={() => play(episode)}
      className={clsx(
        "group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
        isCurrent ? "bg-white/5 border-primary/20" : "hover:bg-white/5 hover:border-white/10"
      )}
    >
      {/* Thumbnail / Icon */}
      <div className="relative w-16 h-16 rounded-lg bg-secondary flex-shrink-0 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
        {episode.thumbnail ? (
          <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
            {episode.type === 'video' ? <Video className="w-6 h-6 text-white/50" /> : <Music className="w-6 h-6 text-white/50" />}
          </div>
        )}
        
        {/* Play Overlay */}
        <div className={clsx(
          "absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity",
          isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {isCurrent && isPlaying ? (
            <div className="flex gap-1 items-end h-4">
              <div className="w-1 bg-primary animate-[bounce_1s_infinite] h-2"></div>
              <div className="w-1 bg-primary animate-[bounce_1.2s_infinite] h-4"></div>
              <div className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-3"></div>
            </div>
          ) : (
            <Play className="w-6 h-6 text-white fill-white" />
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className={clsx(
          "font-semibold truncate text-base",
          isCurrent ? "text-primary" : "text-foreground"
        )}>
          {episode.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {episode.description}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-medium">
           <span className="uppercase tracking-wider">{episode.pubDate}</span>
           {episode.duration && (
             <>
               <span className="w-1 h-1 rounded-full bg-slate-600"></span>
               <span>{episode.duration}</span>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
