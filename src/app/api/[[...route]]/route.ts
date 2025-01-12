import { Hono } from "hono";
import { handle } from "hono/vercel";
import { auth } from "@/features/auth/lib/auth";

// routes
import r2 from "./r2";
import map from "./map";
import city from "./city";
import posts from "./posts";
import photos from "./photos";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath("/api");

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/photos", photos)
  .route("/r2", r2)
  .route("/map", map)
  .route("/city", city)
  .route("/posts", posts);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
