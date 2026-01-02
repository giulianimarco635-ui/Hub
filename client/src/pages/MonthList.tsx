import { Link, useRoute } from "wouter";
import { useFeed } from "@/hooks/use-feed";
import { PageTransition } from "@/components/PageTransition";
import { Header } from "@/components/Header";
import { ChevronRight, Folder } from "lucide-react";

export default function MonthList() {
  const [match, params] = useRoute("/:type/:year");
  const type = params?.type as "audio" | "video";
  const year = params?.year || "";
  const { data: catalog } = useFeed();

  if (!catalog || !catalog[type] || !catalog[type][year]) return null;

  const yearData = catalog[type][year];
  // Sort months 1-12
  const monthKeys = Object.keys(yearData.months).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="min-h-screen pb-24">
      <Header title={`${year} Archive`} showBack />
      
      <PageTransition className="p-4 grid gap-3 max-w-3xl mx-auto">
        {monthKeys.map((monthKey) => {
          const monthData = yearData.months[monthKey];
          return (
            <Link key={monthKey} href={`/${type}/${year}/${monthKey}`} className="block">
              <div className="group bg-card hover:bg-white/5 border border-white/5 hover:border-primary/20 rounded-xl p-5 flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Folder className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold font-display leading-tight">{monthData.monthName}</span>
                    <span className="text-xs text-muted-foreground">{monthData.episodes.length} Episodes</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </PageTransition>
    </div>
  );
}
