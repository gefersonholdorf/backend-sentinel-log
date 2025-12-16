import z from "zod";

export const authProfileSchema = z.object({
    id: z.number(),
    role: z.enum(['super_admin', 'admin', 'member']),
    clientId: z.number().nullable()
})

export const authApiSchema = z.object({
    clientId: z.number(),
    apiId: z.number()
})

export type AuthProfileSchema = z.infer<typeof authProfileSchema>

export type AuthApiSchema = z.infer<typeof authApiSchema>



