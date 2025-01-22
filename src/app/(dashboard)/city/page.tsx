import CitySets from "./city-sets";

export const metadata = {
  title: "City Sets",
  description: "City Sets",
};

const CityPage = () => {
  return (
    <div className="size-full">
      <CitySets />
    </div>
  );
};

export default CityPage;
