import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import VectorTopLeftAnimation from "./vector-top-left-animation";

export const CityCardLoadingSkeleton = () => {
  return (
    <div className="w-full relative group cursor-pointer">
      <AspectRatio
        ratio={0.75 / 1}
        className="overflow-hidden rounded-lg relative"
      >
        <Skeleton className="w-full h-full" />
      </AspectRatio>

      <div className="absolute top-0 left-0 z-20">
        <VectorTopLeftAnimation title="Loading..." />
      </div>
    </div>
  );
};
