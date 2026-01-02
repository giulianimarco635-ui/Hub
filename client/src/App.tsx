import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { PlayerProvider } from "@/hooks/use-player";
import { Player } from "@/components/Player";

import Home from "@/pages/Home";
import YearList from "@/pages/YearList";
import MonthList from "@/pages/MonthList";
import EpisodeList from "@/pages/EpisodeList";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/:type" component={YearList} />
      <Route path="/:type/:year" component={MonthList} />
      <Route path="/:type/:year/:month" component={EpisodeList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <div className="bg-background min-h-screen text-foreground selection:bg-primary/30">
          <Router />
          <Player />
          <Toaster />
        </div>
      </PlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
