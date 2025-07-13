import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { SignupDto, User } from "./user.dto";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
        private readonly otpService: OtpService
    ) {}

    @Post('signup')
    async signup(@Body() body: SignupDto): Promise<{ message: string }> {
        const existing = await this.userService.findUser(body.username);
        if (existing) {
            throw new BadRequestException('Username already exists');
        }
        const passwordHash = await bcrypt.hash(body.password, 10);

        const user = await this.userService.setTemporaryUserDataIntoCache(body.username, body.password);           
        const otp = await this.otpService.generateOtp(body.username);

        return { message: 'OTP sent. Verify to complete signup.' };
    }   

    @Post('verify-signup')
    async verifySignUp(@Body)
}