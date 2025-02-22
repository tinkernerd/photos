import CardContainer from "@/components/card-container";

const AboutCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-12 gap-[128px]">
        <h1 className="text-3xl">About</h1>
        <div className="flex flex-col gap-4 font-light">
        <p>
            Starting out flying drones as a hobby, I quickly became captivated by
            the art of photography and videography. I decided to sell my drone and get a camera,
            which gives me the ability to capture more than just what is seen in the
            sky. I am completely self-taught, and I am always looking to learn and see
            what new things I can find, create, and do. </p>

          <p>
            Whether I&apos;m exploring urban environments or venturing into
            nature, my goal is to highlight the extraordinary in the ordinary.
            Through my lens, I invite you to join me on this visual journey of
            discovery and inspiration. I enjoy finding everything that God has created
            through a diffrent lense.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default AboutCard;
