import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { SignupDto, User, VerifySignupDto } from "./user.dto";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt';
import { Verify } from "crypto";
import { OtpService } from "src/otp/otp.service";
import { MailService } from "src/otp/mail.service";
import { userInfo } from "os";


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly otpService: OtpService,
        private readonly mailService: MailService
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
        const otp = await this.otpService.generateOtp(body.username);
        await this.mailService.sendOtpEmail(body.username, otp);
        return { message: 'OTP sent. Verify to complete signup.' };
    }   

    @Post('verify-password')
    async verifyPassword(@Body() body: VerifySignupDto): Promise<{ message: string, userId: string }> {
        // 1. Retrieve temporary user data from Redis
        const passwordHash = await this.userService.getTemporaryUserDataFromCache(body.username);
        if (!passwordHash) {
            throw new BadRequestException('Temporary user data not found');
        }

        // 2. Validate Password
        const user = await this.userService.validateCredentials(body.username, passwordHash);

        if (!user) {
            throw new BadRequestException('Invalid password');
        }   

        return { message: 'Succesful password verification', userId: user.id };
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: VerifySignupDto): Promise<{ message: string }> {
        // 1. Validate OTP
        const isValidOtp = await this.otpService.verifyOtp(body.username, body.otp);
        if (!isValidOtp) {
            throw new BadRequestException('Invalid OTP');
        }

        // 2. Create user in the database
        const passwordHash = await this.userService.getTemporaryUserDataFromCache(body.username);
        if (!passwordHash) {
            throw new BadRequestException('Temporary user data not found');
        }
        await this.userService.createUser(body.username, passwordHash);

        // 3. Clear temporary data from Redis
        await this.userService.clearTemporaryUserDataFromCache(body.username);

        return { message: 'OTP verified and user created successfully' };
    }   
}