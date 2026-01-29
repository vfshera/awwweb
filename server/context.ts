import { RouterContextProvider, createContext } from "react-router";
import { db } from "~/.server/db";
import { clientEnv, env } from "~/env.server";
import type { BaseContext, GetLoadContextFunction } from "./types";

export const appContext = createContext<BaseContext>();

export const getLoadContext: GetLoadContextFunction = async (ctx, { build }) => {
  const context = new RouterContextProvider();

  context.set(appContext, {
    appVersion: env.PROD ? build.assets.version : "dev",
    db,
    env,
    clientEnv,
    user: ctx.get("user"),
    session: ctx.get("session"),
  });

  return context;
};
