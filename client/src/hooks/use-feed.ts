import { useQuery } from "@tanstack/react-query";
import { api, type CatalogResponse } from "@shared/routes";

export function useFeed() {
  return useQuery({
    queryKey: [api.feed.get.path],
    queryFn: async () => {
      const res = await fetch(api.feed.get.path);
      if (!res.ok) {
        throw new Error('Failed to fetch catalog');
      }
      return api.feed.get.responses[200].parse(await res.json());
    },
  });
}
