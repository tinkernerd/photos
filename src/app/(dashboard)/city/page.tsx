"use client";

import { useGetCitySets } from "@/features/city/api/use-get-city-sets";

const CityPage = () => {
  const { data } = useGetCitySets();

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default CityPage;
