import { useRoute } from "wouter";
import { useFeed } from "@/hooks/use-feed";
import { PageTransition } from "@/components/PageTransition";
import { Header } from "@/components/Header";
import { EpisodeCard } from "@/components/EpisodeCard";

export default function EpisodeList() {
  const [match, params] = useRoute("/:type/:year/:month");
  const type = params?.type as "audio" | "video";
  const year = params?.year || "";
  const month = params?.month || "";
  
  const { data: catalog } = useFeed();

  if (!catalog || !catalog[type] || !catalog[type][year] || !catalog[type][year].months[month]) {
    return null;
  }

  const monthData = catalog[type][year].months[month];
  const episodes = monthData.episodes;

  return (
    <div className="min-h-screen pb-32">
      <Header title={`${monthData.monthName} ${year}`} showBack />
      
      <PageTransition className="p-4 flex flex-col gap-2 max-w-3xl mx-auto">
        <div className="px-2 pb-2 text-sm text-muted-foreground font-medium uppercase tracking-wider">
           {episodes.length} Episodes
        </div>
        
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </PageTransition>
    </div>
  );
}
