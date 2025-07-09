import { Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.user.serviice";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UserService {
    constructor(private readonly redisService: RedisService) {}

    async createUser(username: string, password: string): Promise<User> {
        const id = uuidv4()
        const passwordHash = await bcrypt.hash(password, 10);

        const user: User = { id, username, passwordHash };

        await this.redisService.saveUser(this.userKey(username), {
        id: user.id,
        username: user.username,
        passwordHash: user.passwordHash,
        });

        return user;
    }

    async findUser(username: string): Promise<User | null> {
        const data = await this.redis.hgetall(this.userKey(username));
        return Object.keys(data).length ? (data as unknown as User) : null;
    }

    async validateCredentials(username: string, password: string): Promise<User | null> {
        const user = await this.findUser(username);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.passwordHash);
        return match ? user : null;
    }
    
}
