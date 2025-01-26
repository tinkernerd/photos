"use client";

// External dependencies
import Image from "next/image";
import Link from "next/link";

// Internal dependencies - UI Components
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Hooks
import { useGetPosts } from "@/features/posts/api/use-get-posts";

const PostList = () => {
  const { data } = useGetPosts();

  if (!data) {
    return null;
  }

  console.log({
    data,
  });

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3">
      {data.slice(1).map((post) => (
        <AspectRatio ratio={3 / 4} key={post.id}>
          <Link
            href={`/blog/${post.slug}`}
            className="block w-full h-full relative rounded-xl overflow-hidden group cursor-pointer"
          >
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                quality={30}
                className="object-cover group-hover:blur-sm transition-[filter] duration-300 ease-out"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/placeholder.svg"
                alt="Image"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            )}

            <div className="absolute w-full bottom-0 p-3">
              <div className="bg-background backdrop-blur-sm p-4 rounded-lg flex items-center justify-between gap-8">
                <h2 className="font-light line-clamp-2">{post.title}</h2>

                <div className="relative mr-2">
                  <span className="text-sm font-light">Read</span>
                  <div className="absolute bottom-[2px] left-0 w-full h-[1px] bg-black dark:bg-white transition-all duration-300 transform ease-in-out group-hover:w-1/3"></div>
                </div>
              </div>
            </div>
          </Link>
        </AspectRatio>
      ))}
    </div>
  );
};

export default PostList;
