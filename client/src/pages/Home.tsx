import { Link } from "wouter";
import { Headphones, Video, Loader2 } from "lucide-react";
import { useFeed } from "@/hooks/use-feed";
import { PageTransition } from "@/components/PageTransition";
import { useTelegram } from "@/hooks/use-telegram";

export default function Home() {
  const { data: catalog, isLoading, error } = useFeed();
  const { user } = useTelegram();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading Catalog...</p>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <h2 className="text-xl font-bold text-destructive mb-2">Unavailable</h2>
        <p className="text-muted-foreground">Could not load the media feed. Please try again later.</p>
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen p-6 flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="text-center mb-10 space-y-2">
         {user && <p className="text-primary font-medium">Welcome, {user.first_name}</p>}
         <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
           Media Library
         </h1>
         <p className="text-muted-foreground">Select your preferred format</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Audio Card */}
        <Link 
          href="/audio" 
          className="group relative h-48 md:h-64 rounded-3xl bg-gradient-to-br from-blue-900/40 to-slate-900 border border-white/5 hover:border-primary/50 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Headphones className="w-40 h-40 text-primary transform -rotate-12" />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform duration-300">
               <Headphones className="w-8 h-8 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-wide">AUDIO</span>
          </div>
        </Link>

        {/* Video Card */}
        <Link 
          href="/video" 
          className="group relative h-48 md:h-64 rounded-3xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-white/5 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Video className="w-40 h-40 text-purple-500 transform -rotate-12" />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform duration-300">
               <Video className="w-8 h-8 text-purple-400" />
            </div>
            <span className="text-2xl font-bold tracking-wide">VIDEO</span>
          </div>
        </Link>
      </div>
    </PageTransition>
  );
}
