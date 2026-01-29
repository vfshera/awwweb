import { z } from "zod";

const getPasswordSchema = (name = "password") => {
  return z.string().min(8, `${name} must be at least 8 characters long`);
};

export const loginSchema = z.object({
  email: z.email(),
  password: getPasswordSchema(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(3, "name must be at least 3 characters long"),
    email: z.email(),
    password: getPasswordSchema(),
    confirmPassword: getPasswordSchema("confirmPassword"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;
