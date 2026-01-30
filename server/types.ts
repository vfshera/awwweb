import type { AuthSession } from "~/.server/auth";
import type { DB } from "~/.server/db";
import type { Env, PublicEnv } from "~/env.server";
import type { RequestIdVariables } from "hono/request-id";

export type SessionVariables = {
  user: AuthSession["user"] | null;
  session: AuthSession["session"] | null;
};

export type AppBindings = {
  Variables: SessionVariables & RequestIdVariables;
};

export type WebSocketContextType = object;

export type BaseContext = SessionVariables & {
  appVersion: string;
  requestId: string;
  clientEnv: PublicEnv;
  env: Env;
  db: DB;
};

declare module "react-router" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouterContextProvider extends BaseContext {}
}
