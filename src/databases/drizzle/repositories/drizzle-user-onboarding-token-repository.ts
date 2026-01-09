import type { MySql2Database } from "drizzle-orm/mysql2";
import type { UserOnBoardingToken, UserOnBoardingTokenInsert, UserOnboardingTokenRepository } from "../../repositories/user-onboarding-token";
import { userOnboardingTokens, usersTable } from "../schemas/schema";
import { and, eq, isNull } from "drizzle-orm";

export class DrizzleUserOnboardingTokenRepository implements UserOnboardingTokenRepository {
    constructor(private readonly db: MySql2Database) {}
    
    async create(data: UserOnBoardingTokenInsert): Promise<{ id: number; }> {
        const result = await this.db.insert(userOnboardingTokens).values(data)

        return {
            id: result[0].insertId
        }
    }

    async findByUserId(userId: number): Promise<{ userOnBoardingToken: UserOnBoardingToken | null; }> {
        const userOnBoardingToken = await this.db.select()
                                                .from(userOnboardingTokens)
                                                .where(and(
                                                    eq(userOnboardingTokens.id, userId),
                                                    isNull(userOnboardingTokens.usedAt)
                                                ))
                                                .limit(1)
        
        if(userOnBoardingToken.length < 1) {
            return {
                userOnBoardingToken: null
            }
        }

        return {
            userOnBoardingToken: userOnBoardingToken[0]
        }
    }
}