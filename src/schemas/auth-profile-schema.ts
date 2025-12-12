import z from "zod";

export const authProfileSchema = z.object({
    id: z.number(),
    role: z.enum(['super_admin', 'admin', 'member'])
})

export type AuthProfileSchema = z.infer<typeof authProfileSchema>



