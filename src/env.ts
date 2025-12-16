import z from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    PORT: z.coerce.number(),
    JWT_API_KEY: z.string(),
    DATABASE_URL: z.url(),
    MONGO_URL: z.url()
})

export const env = envSchema.parse(process.env)