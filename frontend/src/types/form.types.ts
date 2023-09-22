import { z } from 'zod'


export const registerSchema = z.object({
    other: z.string().nullish(),
    name: z.string({ required_error: "field_required" }),
    email: z.string({ required_error: "field_required" }).email({ message: "invalid_email" }),
    password: z.string({ required_error: "field_required" }).min(8, { message: "invalid_password" }),
})


export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    other: z.string().nullish(),
    email: z.string({ required_error: "field_required" }).email({ message: "invalid_email" }),
    password: z.string({ required_error: "field_required" }),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const createNewPasswordSchema = z.object({
    other: z.string().nullish(),
    password: z.string({ required_error: "field_required" }).min(8, { message: "invalid_password" }),
    confirmPassword: z.string({ required_error: "field_required" }).min(8, { message: "invalid_password" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "password_not_match",
    path: ["confirmPassword"]
})

export type CreateNewPasswordSchema = z.infer<typeof createNewPasswordSchema>

export const resetPasswordSchema = z.object({
    other: z.string().nullish(),
    email: z.string({ required_error: "field_required" }).email({ message: "invalid_email" }),
})


export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>