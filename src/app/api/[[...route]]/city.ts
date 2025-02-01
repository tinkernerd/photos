import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { type InferSelectModel } from "drizzle-orm";
import { citySets, type photos } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";

export type CitySet = InferSelectModel<typeof citySets>;
export type Photo = InferSelectModel<typeof photos>;

export interface CitySetWithRelations extends CitySet {
  coverPhoto: Photo;
  photos: Photo[];
}

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.query.citySets.findMany({
      with: {
        coverPhoto: true,
        photos: true,
      },
      orderBy: (citySets, { desc }) => [desc(citySets.updateAt)],
    });

    return c.json({ data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");

    const data = await db.query.citySets.findFirst({
      with: {
        coverPhoto: true,
        photos: true,
      },
      where: eq(citySets.id, id),
    });

    if (!data) {
      return c.json({ success: false, error: "City not found" }, 404);
    }

    return c.json({ data });
  });

export type ApiResponse = {
  data: CitySetWithRelations[];
};

export type CitySetWithPhotos = {
  data: CitySetWithRelations;
};

export default app;
