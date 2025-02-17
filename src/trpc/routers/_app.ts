import { createTRPCRouter } from "../init";
import { photosRouter } from "@/modules/photos/server/procedures";
import { mapRouter } from "@/modules/discover/server/procedures";
import { cloudflareR2Router } from "@/modules/cloudflare/server/procedures";

export const appRouter = createTRPCRouter({
  map: mapRouter,
  photos: photosRouter,
  cloudflare: cloudflareR2Router,
});
// export type definition of API
export type AppRouter = typeof appRouter;
