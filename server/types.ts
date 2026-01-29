import type { AuthSession } from "~/.server/auth";
import type { DB } from "~/.server/db";
import type { Env, PublicEnv } from "~/env.server";
import type { HonoServerOptions } from "react-router-hono-server/node";

export type SessionVariables = {
  user: AuthSession["user"] | null;
  session: AuthSession["session"] | null;
};

export type AppBindings = {
  Variables: SessionVariables;
};

export type GetLoadContextFunction = Exclude<
  HonoServerOptions<AppBindings>["getLoadContext"],
  undefined
>;

export type GetLoadContextFunctionOptions = Parameters<GetLoadContextFunction>["1"];

export type HonoContext = Parameters<GetLoadContextFunction>["0"];

export type BaseContext = SessionVariables & {
  appVersion: string;
  clientEnv: PublicEnv;
  env: Env;
  db: DB;
};

declare module "react-router" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouterContextProvider extends BaseContext {}
}
