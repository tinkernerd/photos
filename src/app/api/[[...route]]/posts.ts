import { z } from "zod";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { zValidator } from "@hono/zod-validator";
import { auth } from "@/modules/auth/lib/auth";
import { posts, postsInsertSchema, postsUpdateSchema } from "@/db/schema/posts";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .get("/", async (c) => {
    const data = await db.select().from(posts);

    return c.json({ data });
  })
  .get("/check-slug/:slug", async (c) => {
    const slug = c.req.param("slug");
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug));

    return c.json({ exists: existingPost.length > 0 });
  })
  .get(
    "/:slug",
    zValidator("param", z.object({ slug: z.string() })),
    async (c) => {
      const { slug } = c.req.valid("param");
      const data = await db.select().from(posts).where(eq(posts.slug, slug));

      if (data.length === 0) {
        return c.json({ success: false, error: "Post not found" }, 404);
      }

      return c.json({ data: data[0] });
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      postsInsertSchema.pick({
        title: true,
        slug: true,
        description: true,
        coverImage: true,
      })
    ),
    async (c) => {
      const values = c.req.valid("json");
      const user = c.get("user");

      if (!user) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
      }

      const exitingPost = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, values.slug));

      if (exitingPost.length > 0) {
        return c.json({ success: false, error: "Post already exists" }, 400);
      }

      const data = await db.insert(posts).values(values).returning();

      if (data.length === 0) {
        return c.json({ success: false, error: "Failed to create post" }, 500);
      }

      return c.json({ data: data[0] });
    }
  )
  .patch(
    "/:slug",
    zValidator("param", z.object({ slug: z.string() })),
    zValidator("json", postsUpdateSchema),
    async (c) => {
      const { slug } = c.req.valid("param");
      const values = c.req.valid("json");
      const user = c.get("user");

      if (!user) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
      }

      const data = await db
        .update(posts)
        .set(values)
        .where(eq(posts.slug, slug))
        .returning();

      if (data.length === 0) {
        return c.json({ success: false, error: "Not found" }, 404);
      }

      return c.json({ success: true, data: data[0] });
    }
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");

      if (!user) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
      }

      const data = await db.delete(posts).where(eq(posts.id, id)).returning();

      if (data.length === 0) {
        return c.json({ success: false, error: "Not found" }, 404);
      }

      return c.json({ success: true, data: { id } });
    }
  );

export default app;
