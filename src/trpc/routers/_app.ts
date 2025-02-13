import { baseProcedure, createTRPCRouter } from "../init";
import { photosRouter } from "@/modules/photos/server/procedures";

export const appRouter = createTRPCRouter({
  photos: photosRouter,
  hello: baseProcedure.query(() => {
    return {
      greeting: `hello tRPC`,
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
