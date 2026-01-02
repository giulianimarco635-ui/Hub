import { Link, useRoute } from "wouter";
import { useFeed } from "@/hooks/use-feed";
import { PageTransition } from "@/components/PageTransition";
import { Header } from "@/components/Header";
import { Calendar, ChevronRight } from "lucide-react";

export default function YearList() {
  const [match, params] = useRoute("/:type");
  const type = params?.type as "audio" | "video";
  const { data: catalog } = useFeed();

  if (!catalog || !catalog[type]) return null;

  const years = Object.keys(catalog[type]).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen pb-24">
      <Header title={`${type === 'audio' ? 'Audio' : 'Video'} Archive`} showBack />
      
      <PageTransition className="p-4 grid gap-3 max-w-3xl mx-auto">
        {years.map((year) => (
          <Link key={year} href={`/${type}/${year}`} className="block">
            <div className="group bg-card hover:bg-white/5 border border-white/5 hover:border-primary/20 rounded-xl p-5 flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-xl font-bold font-display">{year}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </PageTransition>
    </div>
  );
}
