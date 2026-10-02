import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('The email address is invalid.'),
  password: z.string().min(6, 'The password must be at least 6 characters.'),
});

export const signUpStep1Schema = z.object({
  fullName: z.string().min(2, 'The name must be more than two characters'),
  email: z.string().email('The email address is incorrect.'),
  password: z.string().min(8, 'The password must be at least 8 characters.'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpStep1Input = z.infer<typeof signUpStep1Schema>;