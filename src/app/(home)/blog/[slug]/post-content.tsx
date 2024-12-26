"use client";

import { useGetPost } from "@/features/posts/api/use-get-post";

const PostContent = ({ slug }: { slug: string }) => {
  const { data } = useGetPost(slug);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {data?.title}
    </div>
  );
};

export default PostContent;
