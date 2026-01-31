import { Form, Link, useNavigate, useSearchParams } from "react-router";
import { GithubIcon, GoogleIcon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { AUTHENTICATED_REDIRECT, REDIRECT_PATH_PARAM } from "~/constants";
import { generateLinkWithRedirectTo } from "~/utils";
import { authClient } from "~/utils/auth-client";
import { type LoginSchemaType, loginSchema } from "~/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function meta() {
  return [{ title: "Sign In" }];
}

export default function SignIn() {
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get(REDIRECT_PATH_PARAM);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const signIn = async (credentials: LoginSchemaType) => {
    await authClient.signIn.email(credentials, {
      onSuccess: () => {
        navigate(redirectTo || AUTHENTICATED_REDIRECT);
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
      },
    });
  };

  const handleSignInWithSocial = async (provider: "github" | "google") => {
    await authClient.signIn.social({
      provider,
      callbackURL: redirectTo || AUTHENTICATED_REDIRECT,
      fetchOptions: {
        onSuccess: () => {
          navigate(redirectTo || AUTHENTICATED_REDIRECT);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold text-gray-900">Sign In</h1>
      <p className="mb-16 text-lg font-normal text-gray-600">
        Enter your email and password to sign in
      </p>
      <Form
        onSubmit={handleSubmit(signIn)}
        className="mx-auto max-w-[24rem] text-left"
      >
        <div className="mb-6">
          <label htmlFor="email">
            <span className="mb-2 block font-medium text-gray-900">
              Your Email
            </span>
          </label>
          <Input
            type="email"
            placeholder="name@mail.com"
            className="py-3 text-base"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="password">
            <span className="mb-2 block font-medium text-gray-900">
              Password
            </span>
          </label>
          <Input
            placeholder="********"
            className="py-3 text-base"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <Button
          disabled={isSubmitting}
          className="mt-6 w-full bg-black py-5 uppercase"
        >
          sign in
        </Button>
        <div className="mt-4 flex justify-end">
          <Link to="#" className="font-medium">
            Forgot password
          </Link>
        </div>
        <Button
          disabled={isSubmitting}
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 bg-black py-5 uppercase"
          onClick={() => handleSignInWithSocial("github")}
        >
          <GithubIcon className="size-8" />
          sign in with github
        </Button>
        <Button
          disabled={isSubmitting}
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 bg-black py-5 uppercase"
          onClick={() => handleSignInWithSocial("google")}
        >
          <GoogleIcon className="size-8 text-white" />
          sign in with google
        </Button>
        <p className="mt-4 text-center font-normal text-gray-600">
          Not registered?{" "}
          <Link
            to={generateLinkWithRedirectTo("/signup", redirectTo)}
            className="font-medium text-gray-900"
          >
            Create account
          </Link>
        </p>
      </Form>
    </div>
  );
}
