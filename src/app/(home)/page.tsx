"use client";

import Footer from "./_components/footer";
import CityList from "./_components/city-list";
import ProfileCard from "./_components/profile-card";
import { ImageSlider } from "@/components/image-slider";
import LatestWorkCard from "./_components/latest-work-card";
import VectorCombined from "@/components/vector-combined";
import { PageTransitionContainer, PageTransitionItem } from "@/components/page-transition";

export default function Home() {
  return (
    <PageTransitionContainer className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* LEFT CONTENT - Fixed */}
      <PageTransitionItem className="w-full lg:w-1/2 h-[70vh] lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3 rounded-xl">
        <div className="w-full h-full relative">
          <ImageSlider />

          <div className="absolute right-0 bottom-0">
            <VectorCombined title="Photography" position="bottom-right" />
          </div>
        </div>
      </PageTransitionItem>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <PageTransitionContainer className="w-full mt-3 lg:mt-0 lg:w-1/2 space-y-3 pb-3">
        {/* PROFILE CARD  */}
        <PageTransitionItem>
          <ProfileCard />
        </PageTransitionItem>

        {/* LAST TRAVEL CARD  */}
        <PageTransitionItem>
          <div className="mt-3">
            <LatestWorkCard />
          </div>
        </PageTransitionItem>

        {/* CITY CARD  */}
        <PageTransitionItem>
          <CityList />
        </PageTransitionItem>

        <PageTransitionItem>
          <Footer />
        </PageTransitionItem>
      </PageTransitionContainer>
    </PageTransitionContainer>
  );
}
