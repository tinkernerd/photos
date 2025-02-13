import { z } from "zod";
import { db } from "@/db/drizzle";
import { citySets, photos } from "@/db/schema";
import { and, eq, lt, or, desc } from "drizzle-orm";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const photosRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit } = input;

      const data = await db
        .select()
        .from(photos)
        .where(
          and(
            cursor
              ? or(
                  lt(photos.updatedAt, cursor.updatedAt),
                  and(
                    eq(photos.updatedAt, cursor.updatedAt),
                    lt(photos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(photos.updatedAt))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      // Remove the last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // Set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return { items, nextCursor };
    }),
  getLikedPhotos: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { limit } = input;

      const data = await db
        .select()
        .from(photos)
        .where(eq(photos.isFavorite, true))
        .orderBy(desc(photos.updatedAt))
        .limit(limit);

      return data;
    }),
  getCitySets: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit } = input;

      const data = await db
        .select()
        .from(citySets)
        .where(
          and(
            cursor
              ? or(
                  lt(citySets.updatedAt, cursor.updatedAt),
                  and(
                    eq(citySets.updatedAt, cursor.updatedAt),
                    lt(photos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .leftJoin(photos, eq(photos.id, citySets.coverPhotoId))
        .orderBy(desc(citySets.updatedAt))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      // Remove the last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // Set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.city_sets.id,
            updatedAt: lastItem.city_sets.updatedAt,
          }
        : null;

      return { items, nextCursor };
    }),
});
