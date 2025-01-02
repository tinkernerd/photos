"use client";

// External dependencies
import { motion } from "motion/react";

// Internal dependencies - UI Components
import BlurImage from "@/components/blur-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import VectorTopLeftAnimation from "@/components/vector-top-left-animation";

// Hooks
import { useGetPhotos } from "@/features/photos/api/use-get-photos";

const PhotosGrid = () => {
  const { data } = useGetPhotos();

  const photos = data || [];

  return (
    <div className="size-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3 pb-3">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <AspectRatio
              ratio={0.75 / 1}
              className="overflow-hidden rounded-lg relative"
            >
              <BlurImage
                src={photo.url}
                alt={photo.title}
                fill
                quality={20}
                priority
                className="object-cover group-hover:blur-sm transition-[filter] duration-300 ease-out"
                blurhash={photo.blurData}
                sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
              />
            </AspectRatio>

            <div className="absolute top-0 left-0 z-20">
              <VectorTopLeftAnimation title="title" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhotosGrid;
