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