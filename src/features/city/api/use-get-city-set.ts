import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { CitySetWithPhotos } from "@/app/api/[[...route]]/city";

export const useGetCitySet = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["city", { id }],
    queryFn: async () => {
      const res = await client.api.city[":id"].$get({ param: { id } });

      if (!res.ok) throw new Error("Failed to fetch city sets");

      const { data } = (await res.json()) as unknown as CitySetWithPhotos;

      return data;
    },
  });

  return query;
};
