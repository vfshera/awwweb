import { RouterContextProvider } from "react-router";
import { auth } from "~/.server/auth";
import { db } from "~/.server/db";
import { clientEnv, env } from "~/env.server";
import { appContext } from "./context";
import type { AppBindings } from "./types";
import { requestId } from "hono/request-id";
import { createHonoServer } from "react-router-hono-server/node";

export default await createHonoServer<AppBindings>({
  beforeAll(server) {
    server.use(requestId());

    server.use(async (ctx, next) => {
      const session = await auth.api.getSession({
        headers: ctx.req.raw.headers,
      });

      if (!session) {
        ctx.set("user", null);
        ctx.set("session", null);

        return next();
      }

      ctx.set("user", session.user);
      ctx.set("session", session.session);

      return next();
    });
  },
  getLoadContext(ctx, { build }) {
    const context = new RouterContextProvider();

    context.set(appContext, {
      appVersion: env.PROD ? build.assets.version : "dev",
      requestId: ctx.get("requestId"),
      db,
      env,
      clientEnv,
      user: ctx.get("user"),
      session: ctx.get("session"),
    });

    return context;
  },
});
