import VectorCombined from "@/components/vector-combined";
import MapWithPhotos from "./map-with-photos";
import PhotosGrid from "./photos-grid";

export const metadata = {
  title: "Discover",
  description:
    "Capturing memories across the globe - A visual journey through time and space",
};

const MapPage = () => {
  return (
    <div className="flex w-full h-full">
      {/* Left side - Fixed Map */}
      <div className="w-1/2 h-[calc(100%-24px)] fixed left-3 top-3 bottom-3 rounded-xl overflow-hidden">
        <div className="w-full h-full rounded-l-[18px] overflow-hidden relative">
          <MapWithPhotos />
          <div className="absolute right-0 bottom-0 z-10">
            <VectorCombined title="Discover" position="bottom-right" />
          </div>
        </div>
      </div>

      {/* Right side - Photo Grid */}
      <div className="w-1/2 h-full ml-[50%] pl-6">
        <PhotosGrid />
      </div>
    </div>
  );
};

export default MapPage;
