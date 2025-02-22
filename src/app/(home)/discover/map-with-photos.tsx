"use client";

// Internal dependencies - UI Components
import Mapbox from "@/components/map";
import { Blurhash } from "react-blurhash";
import BlurImage from "@/components/blur-image";
import { Skeleton } from "@/components/ui/skeleton";

// Hooks & Types
import type { MapboxProps } from "@/components/map";
import { useGetPhotos } from "@/features/photos/api/use-get-photos";
import { useRouter } from "next/navigation";

const MapWithPhotos = () => {
  const router = useRouter();
  const { data: photos, isLoading } = useGetPhotos();

  const markers: MapboxProps["markers"] =
    photos
      ?.filter(
        (
          photo
        ): photo is typeof photo & { longitude: number; latitude: number } =>
          photo.longitude !== null && photo.latitude !== null
      )
      .map((photo) => ({
        id: photo.id,
        longitude: photo.longitude,
        latitude: photo.latitude,
        element: (
          <div className="relative group cursor-pointer -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full overflow-hidden bg-background/20 ring-1 ring-white/20">
              <div
                className="w-full h-full"
                style={{ transform: "scale(1.2)" }}
              >
                <Blurhash
                  hash={photo.blurData}
                  width={12}
                  height={12}
                  punch={1}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        ),
        popupContent: (
          <div className="group/popup">
            <div className="relative">
              <BlurImage
                src={photo.url}
                alt={photo.title}
                width={500}
                height={500}
                quality={75}
                priority
                blurhash={photo.blurData}
                onClick={() => router.push(`/photograph/${photo.id}`)}
                className="cursor-pointer"
              />
            </div>
          </div>
        ),
      })) || [];

  if (isLoading) {
    return (
      <div className="w-full h-full overflow-hidden flex items-center justify-center bg-muted">
        <Skeleton className="size-full" />
      </div>
    );
  }

  return (
    <Mapbox
      id="discoverMap"
      initialViewState={{
        longitude: -84.63549803244882,
        latitude: 45.86518667524172,
        zoom: 3,
      }}
      markers={markers}
    />
  );
};

export default MapWithPhotos;
