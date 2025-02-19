"use client";

// External dependencies
import Image from "next/image";
import Link from "next/link";

// Internal dependencies - UI Components
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Hooks

const PostList = () => {
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3">
      <AspectRatio ratio={3 / 4}>
        <Link
          href={`/blog`}
          className="block w-full h-full relative rounded-xl overflow-hidden group cursor-pointer"
        >
          <Image
            src="/placeholder.svg"
            alt="Image"
            fill
            quality={30}
            className="object-cover group-hover:blur-sm transition-[filter] duration-300 ease-out"
          />

          <div className="absolute w-full bottom-0 p-3">
            <div className="bg-background backdrop-blur-sm p-4 rounded-lg flex items-center justify-between gap-8">
              <h2 className="font-light line-clamp-2">Title</h2>

              <div className="relative mr-2">
                <span className="text-sm font-light">Read</span>
                <div className="absolute bottom-[2px] left-0 w-full h-[1px] bg-black dark:bg-white transition-all duration-300 transform ease-in-out group-hover:w-1/3"></div>
              </div>
            </div>
          </div>
        </Link>
      </AspectRatio>
    </div>
  );
};

export default PostList;
