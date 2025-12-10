import z from "zod";

export const createUserSchema = z.object({
    name: z.string(),
    cpf: z.string(),
    email: z.email(),
    password: z.string(),
    role: z.enum(['super_admin', 'admin', 'member'])
})

export type CreateUserSchema = z.infer<typeof createUserSchema>