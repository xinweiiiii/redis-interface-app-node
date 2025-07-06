import { Body, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { SessionService } from "./session.service";
import { nanoid } from "nanoid";
import { SESSION } from "./session.dto";

export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Post()
    async create(
        @Body() body: Partial<SESSION>
    ) {
        const session: SESSION = {
            sessionId: nanoid(),
            ...body
        }
        return this.sessionService.createSession(session);
    }

    @Get(':sessionId')
    async get(@Param('sessionId') sessionId: string) {
        return this.sessionService.getSession(sessionId);
    }

    @Patch(':sessionId')
    async update(
        @Param('id') sessionId: string,
        @Body() body: Record<string, any>
    ) {
        return this.sessionService.updateSession(sessionId, body);
    }

    @Delete(':id')
    async remove(@Param('id') sessionId: string) {
        return this.sessionService.deleteSession(sessionId);
    }
}