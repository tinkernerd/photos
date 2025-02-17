"use client";

import BlurImage from "@/components/blur-image";
import { Separator } from "@/components/ui/separator";
import { cn, formatExposureTime } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SiSony } from "react-icons/si";

interface Props {
  id: string;
}

export const PhotographSection = ({ id }: Props) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <PhotographSectionSuspense id={id} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PhotographSectionSuspense = ({ id }: Props) => {
  const router = useRouter();
  const [data] = trpc.photos.getOne.useSuspenseQuery({ id });

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
          className="object-cover blur"
        />
      </div>

      {/* Content layer */}
      <div className="flex flex-col items-center justify-center h-screen gap-10 px-4">
        {/* Title  */}
        <div className="w-full text-center space-y-2">
          <h1 className="text-3xl lg:text-6xl font-bold text-white">
            {data.title}
          </h1>
          <h2 className="text-xl lg:text-3xl text-gray-300">
            {data.city}, {data.country}
          </h2>
        </div>

        {/* Image  */}
        <div className="p-4 pb-0 bg-white relative w-auto max-h-[70dvh]">
          <BlurImage
            src={data.url}
            alt={data.title}
            width={data.width}
            height={data.height}
            blurhash={data.blurData}
            className="w-auto max-h-[70dvh]"
          />

          <div className="absolute -bottom-10 left-0 px-6 py-2 w-full bg-white flex justify-between items-center select-none text-black">
            <div className="flex flex-col text-center">
              <h1
                className={cn(
                  "font-semibold text-xs sm:text-sm lg:text-lg",
                  data.aspectRatio < 1 ? "lg:text-sm" : "lg:text-lg"
                )}
              >
                {data.make} {data.model}
              </h1>
              <p className="text-xs">{data.lensModel}</p>
            </div>
            <div className="flex items-center gap-2">
              <SiSony size={50} />
              <Separator
                orientation="vertical"
                className="hidden sm:block h-10"
              />
              <div className="hidden sm:flex flex-col gap-[2px]">
                <div className="space-x-[6px] text-xs lg:text-sm">
                  <span>{data.focalLength35mm + "mm"}</span>
                  <span>{"ƒ/" + data.fNumber}</span>
                  <span>
                    {data.exposureTime && formatExposureTime(data.exposureTime)}
                  </span>
                  <span>{"ISO" + data.iso}</span>
                </div>
                <div>
                  <p className="text-xs">
                    {data.dateTimeOriginal &&
                      new Date(data.dateTimeOriginal).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
