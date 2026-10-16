import { z } from 'zod';

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Password must be at least 8 characters and include an uppercase letter, a lowercase letter and a number.';

export const signInSchema = z.object({
  email: z.string().email('The email address is invalid.'),
  password: z.string().min(6, 'The password must be at least 6 characters.'),
});

export const signUpStep1Schema = z.object({
  fullName: z.string().min(2, 'The name must be more than two characters'),
  email: z.string().email('The email address is incorrect.'),
  password: z
    .string()
    .min(8, PASSWORD_REQUIREMENTS_MESSAGE)
    .regex(PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('The email address is incorrect.'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'The password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'The code must be 6 digits.'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpStep1Input = z.infer<typeof signUpStep1Schema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;