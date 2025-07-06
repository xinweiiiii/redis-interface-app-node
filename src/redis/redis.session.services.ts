import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { SESSION } from "src/session/session.dto";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    // TODO: Add method to generate metrics on redis response time

    private client: RedisClientType
    private readonly sessionKey = 'session';

    async onModuleInit() {
        this.client = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379', 10),
            },
            password: process.env.REDIS_PASSWORD || undefined,
            });       
        this.client.on('error', (err) => console.error('Redis Client Error', err));
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async saveSession(session: SESSION, ttlSeconds = 3600): Promise<void> {
        await this.client.set(`${this.sessionKey}:${session.sessionid}`, JSON.stringify(session), { EX: ttlSeconds });
    }

    async getSession(sessionid: string): Promise<SESSION | null> {
        const session = await this.client.get(`${this.sessionKey}:${sessionid}`);
        return session ? JSON.parse(session) : null;
    }

    async updateSession(sessionId: string, session: Partial<SESSION>): Promise<SESSION | null> {
        const currentSession = await this.getSession(sessionId);
        if (!currentSession) {
            return null;
        }
        const updatedSession = { ...currentSession, ...session };
        await this.saveSession(updatedSession);
        return updatedSession;
    }

    async deleteeSession(sessionid: string): Promise<void> {
        await this.client.del(`${this.sessionKey}:${sessionid}`);
    }
    
}