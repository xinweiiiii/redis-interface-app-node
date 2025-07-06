import { Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.session.services";
import { SESSION } from "./session.dto";

@Injectable()
export class SessionService {
    constructor(private readonly redisService: RedisService) {}

    async createSession(session: SESSION, ttlSeconds = 3600): Promise<void> {
        await this.redisService.saveSession(session, ttlSeconds);
    }

    async getSession(sessionid: string): Promise<SESSION | null> {
        return await this.redisService.getSession(sessionid);
    }

    async updateSession(sessionId: string, session: Partial<SESSION>): Promise<SESSION | null> {
        return await this.redisService.updateSession(sessionId, session);
    }

    async deleteSession(sessionid: string): Promise<void> {
        await this.redisService.deleteSession(sessionid);
    }
}