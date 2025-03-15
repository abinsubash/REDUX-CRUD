import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

    age: z.string()
        .regex(/^\d+$/, "Age must contain only numbers"),

    email: z.string()
        .email("Invalid email format")
        .min(5, "Email must be at least 5 characters")
        .max(50, "Email cannot exceed 50 characters"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
});

export default signupSchema