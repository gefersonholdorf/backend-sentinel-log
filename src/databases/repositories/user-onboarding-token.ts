import { type userOnboardingTokens } from "../drizzle/schemas/schema";

export type UserOnBoardingTokenInsert = typeof userOnboardingTokens.$inferInsert;
export type UserOnBoardingToken = typeof userOnboardingTokens.$inferSelect;

export interface UserOnboardingTokenRepository {
    create(data: UserOnBoardingTokenInsert): Promise<{ id: number }>;
    findByUserId(userId: number): Promise<{userOnBoardingToken: UserOnBoardingToken | null}>
}
