src/app/(home)/_components/footer.tsx
- Add to Top
`import { DEFAULT_AVATAR } from "@/constants";`
- Line: 10-12
```ts
<AvatarImage src={DEFAULT_AVATAR} alt="Avatar" />
<AvatarFallback>NS</AvatarFallback>
```
- Line: 16
```ts
<div className="flex flex-col items-center lg:items-start gap-[2px]">
  <h1 className="text-2xl">Nick Stull</h1>
  <p className="text-sm opacity-60">Photographer</p>
</div>
```
- Line: 62-60
```ts
<span className="opacity-60">. Updated by </span>
<a
  href="https://github.com/tinkernerd"
  target="_blank"
  rel="noopener noreferrer"
  className="underline underline-offset-2"
>
  Tinkernerd
</a>
```

src/app/(home)/_components/profile-card.tsx
- Add to Top
`import { DEFAULT_AVATAR } from "@/constants";`
- Const ProfileCard
``` ts
const ProfileCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
      <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2">
        <Link
          href="/about"
          className="flex flex-col justify-between gap-6 p-6 lg:p-10 xl:gap-0 bg-muted hover:bg-muted-hover transition-all duration-150 ease-[cubic-bezier(0.22, 1, 0.36, 1)] rounded-xl font-light relative group h-full"
        >
          <div className="flex gap-4 items-center">
            {/* AVATAR  */}
            <Avatar className="size-[60px]">
            <AvatarImage src={DEFAULT_AVATAR} alt="Avatar" />
              <AvatarFallback>NS</AvatarFallback>
            </Avatar>

            {/* NAME  */}
            <div className="flex flex-col gap-[2px]">
              <h1 className="text-lg">Nick Stull</h1>
              <p className="text-sm text-text-muted">Photographer</p>
            </div>
          </div>

          <div className="lg:mt-4 xl:mt-0">
            <p className="text-text-muted text-[15px]">
              I&apos;m Nick, a photographer dedicated to capturing God&apos;s creation
              through a diffrent perspective and capturing moments wherever my journey takes me.
            </p>
          </div>

          <div className="absolute top-8 right-8 opacity-0 group-hover:top-6 group-hover:right-6 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <PiArrowUpRight size={18} />
          </div>
        </Link>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col justify-between gap-3">
        <ContactCard
          title="Instagram"
          href="https://www.instagram.com/therealnicholasstull/"
        />

        <ContactCard title="GitHub" href="https://github.com/tinkernerd" />

        <ContactCard
          title="Website"
          href="https://tinkernerd.dev"
        />

        <ContactCard
          title="Contact me"
          href="https://contact.tinkernerd.dev"
          className="bg-primary hover:bg-primary-hover text-white dark:text-black"
        />
      </div>
    </div>
  );
};
```
src/app/(home)/_components/contact-card.tsx
- Line: 10
`import { CgWebsite } from "react-icons/cg";`
- Line 18
`Website: <CgWebsite size={18} />,`

src/app/(home)/_components/header/mobile-menu.tsx
- Add to Top
`import { DEFAULT_AVATAR } from "@/constants";`
- Line: 71-87
```ts
<div className="flex gap-4 items-center">
  {/* AVATAR  */}
  <Avatar className="size-[60px]">
  <AvatarImage src={DEFAULT_AVATAR} alt="Avatar" />
    <AvatarFallback>NS</AvatarFallback>
  </Avatar>

  {/* NAME  */}
  <div className="flex flex-col">
    <h1 className="text-lg">Nick Stull</h1>
    <p className="text-sm text-text-muted">Photographer</p>
  </div>
</div>
</div>
```
src/modules/home/ui/components/header/mobile-menu.tsx
- Add to Top
`import { DEFAULT_AVATAR } from "@/constants";`
- Line: 71-87
```ts
<div className="flex gap-4 items-center">
  {/* AVATAR  */}
  <Avatar className="size-[60px]">
  <AvatarImage src={DEFAULT_AVATAR} alt="Avatar" />
    <AvatarFallback>NS</AvatarFallback>
  </Avatar>

  {/* NAME  */}
  <div className="flex flex-col">
    <h1 className="text-lg">Nick Stull</h1>
    <p className="text-sm text-text-muted">Photographer</p>
  </div>
</div>
</div>
```
src/app/(home)/_components/about-card.tsx
- const AboutCard
```ts
const AboutCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-12 gap-[128px]">
        <h1 className="text-3xl">About</h1>
        <div className="flex flex-col gap-4 font-light">
        <p>
            Starting out flying drones as a hobby, I quickly became captivated by
            the art of photography and videography. I decided to sell my drone and get a camera,
            which gives me the ability to capture more than just what is seen in the
            sky. I am completely self-taught, and I am always looking to learn and see
            what new things I can find, create, and do. </p>

          <p>
            Whether I&apos;m exploring urban environments or venturing into
            nature, my goal is to highlight the extraordinary in the ordinary.
            Through my lens, I invite you to join me on this visual journey of
            discovery and inspiration. I enjoy finding everything that God has created
            through a diffrent lense.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default AboutCard;
```

src/components/map.tsx
- Line: 46-49
```ts
const MAP_STYLES = {
  light: "mapbox://styles/tinkernerd/cm7ewyz2o000901qx4qrq23na",
  dark: "mapbox://styles/tinkernerd/cm7ewvpet00ed01qoeoie08th",
} as const;
```
- Line: 55-56
```ts
    longitude: -84.63549803244882,
    latitude: 45.86518667524172,
```
src/modules/discover/ui/sections/map-section.tsx
- Line: 91-92
```ts
    longitude: -84.63549803244882,
    latitude: 45.86518667524172,
```
src/modules/cloudflare/components/photo-form.tsx
- Line: 59-60
```ts
    lat: exif?.latitude ?? 45.86518667524172,
    lng: exif?.longitude ?? -84.63549803244882,
```
src/lib/cloudflare-r2.ts
- Line: 31-37
```ts
  private generateUniqueFilename(originalFilename: string): string {
    //const timestamp = Date.now();
    const extension = originalFilename.split(".").pop() || "";
    const baseName = originalFilename.replace(`.${extension}`, "");
    return `${baseName}.${extension}`;
    //return `${baseName}-${timestamp}.${extension}`;
  }
```
src/modules/cloudflare/components/photo-uploader.tsx
- Line: 15 | Remove `folder = "test",`
- Line: 20 | Remove `folder,`
When Testing add for Test folder

src/constants.ts
- Line | End of File:
```ts
export const DEFAULT_AVATAR = `https://avatars.githubusercontent.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`;
```