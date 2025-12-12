import z from "zod";

export const createClientSchema = z.object({
    name: z.string(),
    description: z.string(),
    isActive: z.boolean()
})

export const updateClientSchema = z.object({
    name: z.string(),
    description: z.string(),
    isActive: z.boolean()
})

export const clientsPaginationParams = z.object({
    page: z.coerce.number().optional(),
    perPage: z.coerce.number().optional(),
    orderBy: z.enum(['desc', 'asc']).optional(),
    filter: z.string().optional()
})

export type CreateClientSchema = z.infer<typeof createClientSchema>

export type UpdateClientSchema = z.infer<typeof updateClientSchema>

export type ClientsPaginationParams = z.infer<typeof clientsPaginationParams>



