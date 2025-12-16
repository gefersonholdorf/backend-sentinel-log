import z from "zod";

export const createLogSchema = z.object({
    message: z.string(),
    clientId: z.number(),
    apiId: z.number(),
    ip: z.string(),
    component: z.string(),
    action: z.string(),
    affectedRecordID: z.string(),
    user: z.string(),
})

export type CreateLogSchema = z.infer<typeof createLogSchema>



