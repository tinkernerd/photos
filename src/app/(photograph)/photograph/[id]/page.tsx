import Photo from "./photo";

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const id = (await params).id;

  return (
    <div className="w-full h-full">
      <Photo id={id} />
    </div>
  );
};

export default page;
