import type { Route } from "./+types/account";

export function meta() {
  return [{ title: "Account" }];
}

export default function Account({ matches }: Route.ComponentProps) {
  const user = matches[0].loaderData.user!;

  return (
    <div className="space-y-5 p-5">
      <h1 className="text-2xl font-semibold">Account</h1>

      <section>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </section>
    </div>
  );
}
