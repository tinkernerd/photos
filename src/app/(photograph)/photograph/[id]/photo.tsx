"use client";

import BlurImage from "@/components/blur-image";
import { useGetPhoto } from "@/features/photos/api/use-get-photo";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Photo = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data } = useGetPhoto(id);

  if (!data) {
    return null;
  }

  return (
    <div className="relative size-full">
      {/* Back button */}
      <button
        className="absolute top-4 left-4 z-10 p-1 rounded-md bg-black/50"
        onClick={() => router.back()}
      >
        <ArrowLeft size={22} className="text-white" />
      </button>
      {/* Blurhash background layer */}
      <div className="absolute inset-0 -z-10">
        <BlurImage
          src={data.url}
          alt={data.title}
          fill
          blurhash={data.blurData}
          className="object-cover blur-lg"
        />
      </div>

      {/* Content layer */}
      <div className="max-w-7xl mx-auto px-4 space-y-10 h-full flex flex-col justify-center">
        <div className="w-full text-center space-y-2">
          <h1 className="text-3xl lg:text-6xl font-bold text-white">
            {data.title}
          </h1>
          <h2 className="text-xl lg:text-3xl text-gray-300">
            {data.city}, {data.country}
          </h2>
        </div>
        <div className="">
          <BlurImage
            src={data.url}
            alt={data.title}
            width={data.width}
            height={data.height}
            quality={75}
            blurhash={data.blurData}
            className="object-contain w-full h-full max-h-[80vh]"
          />
        </div>
      </div>
    </div>
  );
};

export default Photo;
