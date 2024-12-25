import ContactCard from "../_components/contact-card";
import Footer from "../_components/footer";
import { type Metadata } from "next";
import CardContainer from "@/components/card-container";
import LargePostCard from "./large-post-card";
import PostList from "./post-list";

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog page",
};

const BlogPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <LargePostCard />
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* DESCRIPTION CARD  */}
        <CardContainer>
          <div className="flex flex-col p-12 gap-[128px]">
            <h1 className="text-3xl">Blog</h1>
            <div className="flex flex-col gap-4 font-light">
              <p>
                Welcome to my blog, where I share my thoughts, experiences, and
                insights on a wide range of topics. Whether you&apos;re a
                photographer, a traveler, or simply someone who appreciates the
                beauty of life, my blog is a place to connect with others who
                share my passion for capturing moments and telling stories.
              </p>
            </div>
          </div>
        </CardContainer>

        {/* POST LIST  */}
        <PostList />

        {/* CONTACT CARD  */}
        <div className="w-full grid grid-cols-2 gap-3">
          <ContactCard title="Instagram" />
          <ContactCard title="GitHub" />
          <ContactCard title="X" />
          <ContactCard
            title="Contact me"
            className="bg-primary hover:bg-primary-hover text-white dark:text-black"
          />
        </div>

        {/* FOOTER  */}
        <Footer />
      </div>
    </div>
  );
};

export default BlogPage;
