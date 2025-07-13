import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { SignupDto, User, VerifySignupDto } from "./user.dto";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt';
import { Verify } from "crypto";


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
        private readonly otpService: OtpService
    ) {}

    @Post('signup')
    async signup(@Body() body: SignupDto): Promise<{ message: string }> {
        // 1. Check if username already exists
        const existing = await this.userService.findUser(body.username);
        if (existing) {
            throw new BadRequestException('Username already exists');
        }
    
        // 2. Validate password strength
        // TODO: Add more password validation logic here
        const passwordHash = await bcrypt.hash(body.password, 10);

        // 3. Create temporary user session and save to Redis
        await this.userService.setTemporaryUserDataIntoCache(body.username, passwordHash;           
        
        // 4. Generate and send OTP
        await this.otpService.generateOtp(body.username);

        return { message: 'OTP sent. Verify to complete signup.' };
    }   

    @Post('verify-signup')
    async verifySignUp(@Body() body: VerifySignupDto): Promise<{ message: string, userId: string }> {
        // 1. Validate OTP
        const isValidOtp = await this.otpService.verifyOtp(body.username, body.otp);
        if (!isValidOtp) {
            throw new BadRequestException('Invalid OTP');
        }

        // 2. Retrieve temporary user data from Redis
        const passwordHash = await this.userService.getTemporaryUserDataFromCache(body.username);
        if (!passwordHash) {
            throw new BadRequestException('Temporary user data not found');
        }

        // 3. Create user in the database
        const user: User = await this.userService.createUser(body.username, passwordHash);

        // 4. Clear temporary data from Redis
        await this.userService.clearTemporaryUserDataFromCache(body.username);

        return { message: 'Signup successful', userId: user.id };
    }
}