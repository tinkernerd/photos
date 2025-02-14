import { createTRPCRouter } from "../init";
import { photosRouter } from "@/modules/photos/server/procedures";

export const appRouter = createTRPCRouter({
  photos: photosRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
