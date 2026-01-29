import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="grid h-screen items-center p-8 text-center">
      <Outlet />
    </div>
  );
}
