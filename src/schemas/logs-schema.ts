import z from "zod";

export const createLogSchema = z.object({
    message: z.string(),
    ip: z.string(),
    component: z.string(),
    action: z.string(),
    affectedRecordID: z.string(),
    user: z.string(),
})

export const logsPaginationParams = z.object({
    limit: z.coerce.number().min(1).max(100).default(28),
    cursor: z.string().optional(),
    filter: z.string().optional(),
    clientId: z.coerce.number().optional(),
    apiId: z.coerce.number().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
})

export type CreateLogSchema = z.infer<typeof createLogSchema>

export type LogsPaginationParams = z.infer<typeof logsPaginationParams>



