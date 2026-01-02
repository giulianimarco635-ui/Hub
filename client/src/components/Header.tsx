import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useTelegram } from "@/hooks/use-telegram";
import { useEffect } from "react";

export function Header({ title, showBack = false }: { title?: string; showBack?: boolean }) {
  const [location, setLocation] = useLocation();
  const { tg } = useTelegram();

  // Handle Telegram Back Button
  useEffect(() => {
    if (!tg) return;

    if (showBack) {
      tg.BackButton.show();
      const handleBack = () => {
        // Simple back logic or specific routing
        window.history.back(); 
      };
      tg.BackButton.onClick(handleBack);
      return () => {
        tg.BackButton.offClick(handleBack);
      };
    } else {
      tg.BackButton.hide();
    }
  }, [tg, showBack]);

  return (
    <div className="flex items-center gap-4 py-6 px-4 sticky top-0 bg-background/80 backdrop-blur-lg z-10 border-b border-white/5">
      {showBack && (
        <button 
          onClick={() => window.history.back()}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors md:hidden" // Only show custom back if TG back button not available (e.g. web dev)
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
      )}
      <h1 className="text-xl md:text-2xl font-display font-bold text-foreground truncate">
        {title || "Catalog"}
      </h1>
    </div>
  );
}
