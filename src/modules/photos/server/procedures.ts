import { z } from "zod";
import { db } from "@/db/drizzle";
import { citySets, photos, photosUpdateSchema } from "@/db/schema";
import { and, eq, lt, or, desc } from "drizzle-orm";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const photosRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      if (!id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [deletedPhoto] = await db
        .delete(photos)
        .where(eq(photos.id, id))
        .returning();

      if (!deletedPhoto) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Photo not found",
        });
      }

      return deletedPhoto;
    }),
  update: protectedProcedure
    .input(photosUpdateSchema)
    .mutation(async ({ input }) => {
      const { id } = input;

      if (!id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [updatedPhoto] = await db
        .update(photos)
        .set({
          ...input,
        })
        .where(eq(photos.id, id))
        .returning();

      if (!updatedPhoto) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updatedPhoto;
    }),
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const [photo] = await db.select().from(photos).where(eq(photos.id, id));

      return photo;
    }),
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
