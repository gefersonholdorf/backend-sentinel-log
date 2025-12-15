import z from "zod";

export const createApiSchema = z.object({
    name: z.string(),
    description: z.string(),
    clientId: z.number(),
    token: z.string(),
    urlCallbackStatus: z.url(),
    isActive: z.boolean()
})

export const updateApiSchema = z.object({
    name: z.string(),
    description: z.string(),
    urlCallbackStatus: z.url(),
    isActive: z.boolean()
})

export const apisPaginationParams = z.object({
    page: z.coerce.number().optional(),
    perPage: z.coerce.number().optional(),
    orderBy: z.enum(['desc', 'asc']).optional(),
    clientId: z.number(),
    filter: z.string().optional()
})

export type CreateApiSchema = z.infer<typeof createApiSchema>

export type UpdateApiSchema = z.infer<typeof updateApiSchema>

export type ApisPaginationParams = z.infer<typeof apisPaginationParams>




