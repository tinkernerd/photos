"use client";

// External dependencies
import { memo } from "react";

// UI Components
import { Skeleton } from "./ui/skeleton";
import Carousel from "./Carousel";
import BlurImage from "./blur-image";

// HOOKS
import { useGetPhotos } from "@/features/photos/api/use-get-photos";

const ImageSlider = memo(function ImageSlider() {
  const { data: photos, isLoading } = useGetPhotos();

  if (!photos) {
    return (
      <div className="size-full overflow-hidden rounded-xl">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="size-full" />;
  }

  const favoritePhoto =
    photos.filter((photo) => photo.isFavorite === true) || photos.slice(0, 5);

  return (
    <Carousel
      className="absolute top-0 left-0 w-full h-full rounded-xl"
      containerClassName="h-full"
    >
      {favoritePhoto.map((photo, index) => {
        const shouldPreload = index < 1;

        return (
          <div key={photo.id} className="flex-[0_0_100%] h-full relative">
            <BlurImage
              src={photo.url}
              alt={photo.title}
              fill
              priority={shouldPreload}
              loading={shouldPreload ? "eager" : "lazy"}
              blurhash={photo.blurData}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </Carousel>
  );
});

export { ImageSlider };
