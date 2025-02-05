"use client";

// External dependencies
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Internal dependencies - UI Components
import Footer from "../_components/footer";
import { PiArrowRight } from "react-icons/pi";
import BlurImage from "@/components/blur-image";
import TextScroll from "@/components/text-scroll";
import CameraLoader from "@/components/camera-loader";
import CardContainer from "@/components/card-container";
import VectorCombined from "@/components/vector-combined";
import {
  PageTransitionContainer,
  PageTransitionItem,
} from "@/components/page-transition";

// Hooks & Types
import { useGetCitySets } from "@/features/city/api/use-get-city-sets";
import { type CitySetWithRelations } from "@/app/api/[[...route]]/city";

// Components
const CoverPhoto = ({
  city,
  citySets,
}: {
  city: CitySetWithRelations | null;
  citySets: CitySetWithRelations[] | undefined;
}) => {
  return (
    <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
      <div className="w-full h-full relative rounded-xl overflow-hidden">
        {/* 所有城市的封面图片 */}
        <div className="relative w-full h-full">
          {citySets?.map((citySet) => (
            <div
              key={citySet.id}
              className={`absolute inset-0 transition-opacity duration-300 ${city?.id === citySet.id ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <BlurImage
                src={citySet.coverPhoto.url}
                alt={citySet.city}
                fill
                priority
                blurhash={citySet.coverPhoto.blurData}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="absolute right-0 bottom-0">
          <VectorCombined title={city?.city || ""} position="bottom-right" />
        </div>
      </div>
    </div>
  );
};

const Introduction = () => (
  <CardContainer>
    <div className="flex flex-col p-12 gap-[128px]">
      <h1 className="text-4xl">Travel</h1>
      <div className="flex flex-col gap-4 font-light">
        <p>
          Exploring the world one step at a time, capturing life through street
          photography and city walks. From bustling urban corners to hidden
          alleyways, every journey tells a unique story through the lens.
        </p>
      </div>
    </div>
  </CardContainer>
);

interface CityItemProps {
  city: CitySetWithRelations;
  onMouseEnter: (city: CitySetWithRelations) => void;
}

const CityItem = ({ city, onMouseEnter }: CityItemProps) => {
  const router = useRouter();

  return (
    <div
      key={city.id}
      className="w-full py-5 px-3 bg-muted hover:bg-muted-hover rounded-xl grid grid-cols-2 items-center cursor-pointer group transition-all duration-150 ease-[cubic-bezier(0.22, 1, 0.36, 1)] flex-1 overflow-hidden"
      onMouseEnter={() => onMouseEnter(city)}
      onClick={() => router.push(`/travel/${city.city}`)}
    >
      <p className="text-xs lg:text-sm line-clamp-1">{city.city}</p>

      <div className="relative overflow-hidden flex justify-end">
        <div className="flex items-center gap-2 transform transition-transform duration-200 ease-in-out group-hover:-translate-x-7">
          <span className="font-light text-xs lg:text-sm whitespace-nowrap text-right">
            <TextScroll className="w-28 lg:w-full">{city.country}</TextScroll>
          </span>
        </div>
        <div className="absolute right-0 transform translate-x-full transition-transform duration-200 ease-in-out group-hover:translate-x-0 flex items-center">
          <PiArrowRight size={18} />
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function TravelClientPage() {
  const [activeCity, setActiveCity] = useState<CitySetWithRelations | null>(
    null
  );
  const { data: citySetsData, isLoading: isCitySetsLoading } = useGetCitySets();

  useEffect(() => {
    if (!activeCity && citySetsData && citySetsData.length > 0) {
      setActiveCity(citySetsData[0]);
    }
  }, [activeCity, citySetsData]);

  if (isCitySetsLoading) {
    return (
      <div className="h-full w-full rounded-xl flex items-center justify-center bg-muted">
        <CameraLoader />
      </div>
    );
  }

  return (
    <PageTransitionContainer className="flex flex-col lg:flex-row min-h-screen w-full">
      <CoverPhoto city={activeCity} citySets={citySetsData} />

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <PageTransitionContainer className="w-full mt-3 lg:mt-0 lg:w-1/2 space-y-3 pb-3">
        <PageTransitionItem>
          <Introduction />
        </PageTransitionItem>

        <div className="space-y-3">
          {citySetsData?.map((city) => (
            <PageTransitionItem key={city.id}>
              <CityItem city={city} onMouseEnter={setActiveCity} />
            </PageTransitionItem>
          ))}
        </div>

        <PageTransitionItem>
          <Footer />
        </PageTransitionItem>
      </PageTransitionContainer>
    </PageTransitionContainer>
  );
}
