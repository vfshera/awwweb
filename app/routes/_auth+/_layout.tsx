import type { Route } from "./+types/_layout";
import { Outlet, redirect } from "react-router";
import { AUTHENTICATED_REDIRECT } from "~/constants";

export async function loader({ context }: Route.LoaderArgs) {
  if (context.isAuthenticated) {
    return redirect(AUTHENTICATED_REDIRECT);
  }

  return {};
}

export default function AuthLayout() {
  return (
    <div className="grid h-screen items-center p-8 text-center">
      <Outlet />
    </div>
  );
}
