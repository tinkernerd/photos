"use client";

import { useGetCitySet } from "@/features/city/api/use-get-city-set";
import Image from "next/image";
import { use } from "react";

type Params = Promise<{ id: string }>;

const CityIdPage = ({ params }: { params: Params }) => {
  const { id } = use(params);

  const { data } = useGetCitySet(id);

  return (
    <div className="p-4 space-y-4">
      <Image
        src={data?.coverPhoto.url || "/placeholder-image.jpg"}
        alt={`${data?.city} cover`}
        width={500}
        height={300}
        className=""
      />
      <h1 className="text-3xl font-bold">{data?.city}</h1>
      <p>{data?.description}</p>

      {data?.photos.map((photo) => (
        <Image
          key={photo.id}
          src={photo.url}
          alt={photo.title}
          width={200}
          height={200}
          className=""
        />
      ))}
    </div>
  );
};

export default CityIdPage;
