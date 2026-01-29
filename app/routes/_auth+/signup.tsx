import { Form, Link, useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { AUTHENTICATED_REDIRECT, REDIRECT_PATH_PARAM } from "~/constants";
import { generateLinkWithRedirectTo } from "~/utils";
import { authClient } from "~/utils/auth-client";
import { type SignupSchemaType, signupSchema } from "~/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function meta() {
  return [{ title: "Sign Up" }];
}

export default function SignUp() {
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get(REDIRECT_PATH_PARAM);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  const signUp = async ({ confirmPassword: _, ...data }: SignupSchemaType) => {
    await authClient.signUp.email(data, {
      onSuccess: () => {
        navigate(redirectTo || AUTHENTICATED_REDIRECT);
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
      },
    });
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold text-gray-900">Sign Up</h1>

      <Form
        onSubmit={handleSubmit(signUp)}
        className="mx-auto max-w-[24rem] text-left"
      >
        <div className="mb-6">
          <label htmlFor="name">
            <span className="mb-2 block font-medium text-gray-900">
              Your Name
            </span>
          </label>
          <Input
            type="text"
            placeholder="John Doe"
            className="py-3 text-base"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
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
        <div className="mb-6">
          <label htmlFor="password">
            <span className="mb-2 block font-medium text-gray-900">
              Confirm Password
            </span>
          </label>
          <Input
            placeholder="********"
            className="py-3 text-base"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button
          disabled={isSubmitting}
          className="mt-6 w-full bg-black py-5 uppercase"
        >
          sign up
        </Button>

        <p className="mt-4 text-center font-normal text-gray-600">
          Already registered?{" "}
          <Link
            to={generateLinkWithRedirectTo("/signin", redirectTo)}
            className="font-medium text-gray-900"
          >
            Sign in
          </Link>
        </p>
      </Form>
    </div>
  );
}
