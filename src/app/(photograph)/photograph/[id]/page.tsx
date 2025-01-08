import ParallelModal from "@/components/parallel-modal";

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const id = (await params).id;

  return (
    <ParallelModal>
      <div>
        <p className="text-3xl">{id}</p>
      </div>
    </ParallelModal>
  );
};

export default page;
