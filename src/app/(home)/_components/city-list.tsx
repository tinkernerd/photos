"use client";

import { useGetCitySets } from "@/features/city/api/use-get-city-sets";
import CityCard from "./city-card";
import { CityCardLoadingSkeleton } from "@/components/loading-skeleton";

const CityList = () => {
  const { data: cityList, isLoading } = useGetCitySets();

  if (isLoading) {
    return (
      <div className="mt-3 w-full h-1/2 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CityCardLoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
      {cityList?.map((city) => (
        <CityCard
          key={city.id}
          title={city.city}
          coverPhoto={city.coverPhoto}
        />
      ))}
    </div>
  );
};

export default CityList;
