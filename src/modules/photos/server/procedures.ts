import { z } from "zod";
import { db } from "@/db/drizzle";
import {
  citySets,
  photos,
  photosUpdateSchema,
  photosInsertSchema,
} from "@/db/schema/photos";
import { and, eq, lt, or, desc, sql } from "drizzle-orm";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const photosRouter = createTRPCRouter({
  create: protectedProcedure
    .input(photosInsertSchema)
    .mutation(async ({ input }) => {
      const values = input;

      try {
        const [insertedPhoto] = await db
          .insert(photos)
          .values(values)
          .returning();

        const cityName =
          values.countryCode === "JP" || values.countryCode === "TW"
            ? values.region
            : values.city;

        if (insertedPhoto.country && cityName) {
          await db
            .insert(citySets)
            .values({
              country: insertedPhoto.country,
              countryCode: insertedPhoto.countryCode,
              city: cityName,
              photoCount: 1,
              coverPhotoId: insertedPhoto.id,
            })
            .onConflictDoUpdate({
              target: [citySets.country, citySets.city],
              set: {
                countryCode: insertedPhoto.countryCode,
                photoCount: sql`${citySets.photoCount} + 1`,
                coverPhotoId: sql`COALESCE(${citySets.coverPhotoId}, ${insertedPhoto.id})`,
                updatedAt: new Date(),
              },
            });

          const updatedCitySet = await db
            .select()
            .from(citySets)
            .where(
              sql`${citySets.country} = ${insertedPhoto.country} AND ${citySets.city} = ${insertedPhoto.city}`
            );

          console.log("Updated city set:", updatedCitySet);
        } else {
          console.log(
            "No geo information available for photo:",
            insertedPhoto.id
          );
        }

        return insertedPhoto;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create photo",
        });
      }
    }),
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
