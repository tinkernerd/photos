import FooterNav from "./footer-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Footer = () => {
  return (
    <div className="flex flex-col items-center lg:items-start p-16 pb-12 gap-8 lg:gap-16 rounded-xl font-light relative flex-1 bg-primary text-white dark:text-black">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* AVATAR  */}
        <Avatar className="size-[60px]">
          <AvatarImage src="https://avatars.githubusercontent.com/u/29255317?v=4" />
          <AvatarFallback>NS</AvatarFallback>
        </Avatar>

        {/* NAME  */}
        <div className="flex flex-col items-center lg:items-start gap-[2px]">
          <h1 className="text-2xl">Nick Stull</h1>
          <p className="text-sm opacity-60">Photographer</p>
        </div>
      </div>
      <div className="grid lg:w-full grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-14">
        <FooterNav
          title="Pages"
          links={[
            { title: "Home", href: "/" },
            { title: "Travel", href: "/travel" },
            { title: "Discover", href: "/discover" },
            { title: "About", href: "/about" },
          ]}
        />
        <FooterNav
          title="CMS"
          links={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Photos", href: "/photos" },
            { title: "Documents", href: "/documents" },
          ]}
        />
        <FooterNav
          title="Utility"
          links={[
            { title: "404", href: "/404" },
            { title: "Login", href: "/sign-in" },
          ]}
        />
      </div>

      {/* Attribution */}
      <div className="text-sm">
        <p>
          <span className="opacity-60">© Design by </span>
          <a
            href="https://templates.gola.io/template/hanssen"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Pawel Gola
          </a>
          <span className="opacity-60">. Powered by </span>
          <a
            href="https://github.com/ecarry"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            ECarry
          </a>
          <span className="opacity-60">. Updated by </span>
          <a
            href="https://github.com/tinkernerd"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Tinkernerd
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
