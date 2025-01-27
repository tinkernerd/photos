import Photo from "./photo";

type Props = {
  params: Promise<{ id: string }>;
};

const getPhoto = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/photos/${id}`
  );

  return res.json();
};

export const generateMetadata = async ({ params }: Props) => {
  const id = (await params).id;
  const photo = await getPhoto(id);

  return {
    title: `${photo.data.title}`,
    description: `${photo.data.description}`,
  };
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
