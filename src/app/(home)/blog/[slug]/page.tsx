import { Metadata } from "next";
import PostContent from "./post-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const title = slug.split("-").join(" ");

  return {
    title,
  };
}

const BlogSlugPage = async ({ params }: Props) => {
  const slug = (await params).slug;

  return (
    <div className="w-full h-full">
      <PostContent slug={slug} />
    </div>
  );
};

export default BlogSlugPage;
