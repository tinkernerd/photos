"use client";

import Image from "next/image";
import { useGetCitySets } from "@/features/city/api/use-get-city-sets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const CitySets = () => {
  const router = useRouter();
  const { data: citySets, isLoading } = useGetCitySets();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">City Sets</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {citySets?.map((citySet) => (
          <Card
            key={citySet.id}
            className="overflow-hidden hover:bg-accent/50 transition-colors"
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={citySet.coverPhoto.url || "/placeholder-image.jpg"}
                alt={`${citySet.city} cover`}
                fill
                className="object-cover cursor-pointer"
                onClick={() => router.push(`/city/${citySet.id}`)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg">{citySet.city}</p>
                  <p className="text-xs text-muted-foreground">
                    {citySet.country}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>{citySet.description}</p>
                <p className="mt-2">Photos: {citySet.photoCount || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CitySets;
