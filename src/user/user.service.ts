import { Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.user.service";
import { v4 as uuidv4 } from 'uuid';
import { User } from "./user.dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(private readonly redisService: RedisService) {}

    async createUser(username: string, passwordHash: string): Promise<User> {
        const id = uuidv4()

        const user: User = { id, username, passwordHash };

        await this.redisService.saveUser({
            id: user.id,
            username: user.username,
            passwordHash: user.passwordHash,
        });

        return user;
    }

    async findUser(username: string): Promise<User | null> {
        return await this.redisService.getUserByUsername(username);
    }

    async setTemporaryUserDataIntoCache(username: string, passwordHash: string): Promise<void> {
        return this.redisService.setTemporaryUserDataIntoCache(username, passwordHash);
    }

    async validateCredentials(username: string, password: string): Promise<User | null> {
        const user = await this.findUser(username);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.passwordHash);
        return match ? user : null;
    }
    
}
