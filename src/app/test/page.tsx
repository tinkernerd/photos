import { HydrateClient, trpc } from "@/trpc/server";
import { PhotosSection } from "@/modules/photos/ui/sections/photos-section";

export const dynamic = "force-dynamic";

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
