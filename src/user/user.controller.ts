import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { LoginDto, SignupDto, User, VerifySignupDto } from "./user.dto";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt';
import { Verify } from "crypto";
import { OtpService } from "src/otp/otp.service";
import { MailService } from "src/otp/mail.service";
import { userInfo } from "os";
import { AuthService } from "src/auth/auth.service";


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly otpService: OtpService,
        private readonly mailService: MailService,
        private readonly authService: AuthService,
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
        await this.userService.setTemporaryUserDataIntoCache(body.username, passwordHash);           
        
        // 4. Generate and send OTP
        const otp = await this.otpService.generateOtp(body.username);
        await this.mailService.sendOtpEmail(body.username, otp);
        return { message: 'OTP sent. Verify to complete signup.' };
    }   

    @Post('verify')
    async verifySignup(@Body() body: VerifySignupDto): Promise<{ message: string; userId: string }> {
        const { username, otp, password } = body;

        // 1. Retrieve temporary hashed password from Redis
        const cachedPasswordHash = await this.userService.getTemporaryUserDataFromCache(username);
        if (!cachedPasswordHash) {
            throw new BadRequestException('Temporary user data not found');
        }

        // 2. Validate Password
        const isPasswordValid = await bcrypt.compare(password, cachedPasswordHash);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        // 3. Validate OTP
        const isValidOtp = await this.otpService.verifyOtp(username, otp);
        if (!isValidOtp) {
            throw new BadRequestException('Invalid OTP');
        }

        // 4. Create user
        const user = await this.userService.createUser(username, cachedPasswordHash);

        // 5. Clear temporary data
        await this.userService.clearTemporaryUserDataFromCache(username);

        return { message: 'User created successfully', userId: user.id };
    } 

    @Post('login')
    async login(@Body() body: LoginDto): Promise<{ access_token: string }> {
        const { username, password } = body;

        // 1. Validate user credentials
        const user = await this.userService.validateCredentials(username, password);
        if (!user) {
            throw new BadRequestException('Invalid username or password');
        }

        return this.authService.login(user.username, user.id);
    }
}