"use client";

import Image from "next/image";
import { useGetPost } from "@/features/posts/api/use-get-post";
import Footer from "../../_components/footer";
import ContactCard from "../../_components/contact-card";
import VectorCombined from "@/components/vector-combined";
import Editor from "@/app/(dashboard)/documents/[slug]/editor";
import { ArrowDownIcon } from "lucide-react";

const PostContent = ({ slug }: { slug: string }) => {
  const { data } = useGetPost(slug);

  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <div className="block w-full h-full relative rounded-xl overflow-hidden">
          {data?.coverImage ? (
            <Image
              src={data.coverImage}
              alt={data.title}
              fill
              quality={75}
              className="object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/placeholder.svg"
              alt="Image"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          )}

          <div className="absolute right-0 bottom-0">
            <VectorCombined title="Tag" position="bottom-right" />
          </div>
        </div>
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* CONTENT  */}
        <div className="bg-muted rounded-xl p-10 md:p-12 md:h-[calc(100vh-24px)] flex flex-col">
          <div className="mb-10">
            <span className="bg-muted-hover rounded-sm py-1 px-2 text-xs text-text-muted font-light">
              {data?.createAt &&
                new Date(data.createAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <h1 className="text-4xl">{data?.title}</h1>
            <h2 className="font-light">{data?.description}</h2>

            <div className="mt-8">
              <button
                onClick={handleClick}
                className="bg-background hover:bg-muted duration-150 transition-all flex items-center gap-1 py-[10px] pr-3 pl-[14px] rounded-lg"
              >
                <span className="text-sm font-light">Read Article</span>{" "}
                <ArrowDownIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="bg-muted rounded-xl p-5 w-full flex justify-between">
            <p className="text-text-muted">Category</p>
            <p>Travel</p>
          </div>

          <div className="bg-muted rounded-xl p-5 w-full flex justify-between">
            <p className="text-text-muted">Reading Time</p>
            <p>8 Min</p>
          </div>

          <div className="bg-muted rounded-xl p-5 w-full flex justify-between">
            <p className="text-text-muted">Date</p>
            <p>
              {data?.createAt &&
                new Date(data.createAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
          </div>
        </div>

        <Editor content={data?.content || ""} enabledEditor={false} />

        {/* CONTACT CARD  */}
        <ContactCard
          title="Contact me"
          className="bg-primary hover:bg-primary-hover text-white dark:text-black h-16 font-light"
        />

        {/* FOOTER  */}
        <Footer />
      </div>
    </div>
  );
};

export default PostContent;
