import z from "zod";

export const inviteUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    clientId: z.number().nullable(),
    role: z.enum(['super_admin', 'admin', 'member'])
})

export type inviteUserSchema = z.infer<typeof inviteUserSchema>

export const loginSchema = z.object({
    email: z.email(),
    password: z.string()
})

export type LoginSchema = z.infer<typeof loginSchema>

export const validateUserSchema = z.object({
    token: z.string().optional(),
})

export type ValidateUserSchema = z.infer<typeof validateUserSchema>

export const completeUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    cpf: z.string(),
    password: z.string()
})

export type CompleteUserSchema = z.infer<typeof completeUserSchema>