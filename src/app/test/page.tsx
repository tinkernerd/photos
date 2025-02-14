import { HydrateClient, trpc } from "@/trpc/server";
import { PhotosSection } from "@/modules/photos/ui/sections/photos-section";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // fetch data
  const data = await trpc.photos.getMany({
    limit: 1,
  });

  return {
    title: data.items[0].title,
  };
}

const page = () => {
  void trpc.photos.getMany.prefetchInfinite({
    limit: 10,
  });

  return (
    <div className="size-full">
      <HydrateClient>
        <PhotosSection />
      </HydrateClient>
    </div>
  );
};

export default page;
