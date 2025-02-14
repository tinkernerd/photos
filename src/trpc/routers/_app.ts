import { createTRPCRouter } from "../init";
import { photosRouter } from "@/modules/photos/server/procedures";
import { mapRouter } from "@/modules/discover/server/procedures";

export const appRouter = createTRPCRouter({
  map: mapRouter,
  photos: photosRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
