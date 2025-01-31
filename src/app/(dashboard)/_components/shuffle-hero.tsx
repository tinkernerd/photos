import ShuffleGrid from "./shuffle-grid";

const ShuffleHero = () => {
  return (
    <section className="w-full py-4 md:py-8 grid grid-cols-2 items-center gap-8 mx-auto overflow-x-hidden">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-sky-500 font-medium">
          Better every day
        </span>
        <h3 className="text-4xl md:text-5xl font-semibold">
          Photography is an art that captures moments, emotions, and stories.
        </h3>
        <p className="text-base md:text-lg text-slate-700 my-4 md:my-6">
          Keep exploring and creating!{" "}
        </p>
      </div>
      <ShuffleGrid />
    </section>
  );
};

export default ShuffleHero;
