import { Body, Get, UseGuards, Request, Session } from '@nestjs/common';
import { Controller, HttpCode, HttpStatus, Post, Res, Req, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from '../../common/dto/signin-user.dto';
import { JwtAuthGuard } from './auth.guard';
import { BasicAuthGuard } from './basic-auth.guard';
import { Response } from 'express';
import { SessionAuthGuard } from './session-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('/jwt/login')
    async login(
        @Body() signinDto: SignInUserDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { access_token, refresh_token } = await this.authService.signInWithJwt(
            signinDto.username,
            signinDto.password
          );
        
          res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'lax',
            path: '/auth/refresh', 
            maxAge: 5 * 60 * 1000, 
          });
        
          return { access_token };
    }

    @Post('/jwt/logout')
    async jwtLogout(@Res() res: Response) {
        res.cookie('refresh_token', '', { 
            httpOnly: true, 
            secure: false, 
            sameSite: 'lax', 
            maxAge: 0,  
            path: '/', 
        });

        return { message: 'Logged out successfully' };
    }


    @Post('refresh')
    async refresh(@Request() req: any) {
      const refresh_token = req.cookies?.refresh_token;
      if (!refresh_token) throw new UnauthorizedException('No refresh token');
    
      return this.authService.refreshToken(refresh_token);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/jwt/profile')
    async getJwtProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(BasicAuthGuard)
    @Get('basic/profile')
    getBasicAuthProfile(@Request() req) {
      return req.user;
    }

    @Get('session')
    async getSessionInfo(@Session() session: Record<string, any>) {
        console.log(session);
        console.log(session.id);
    }

    @Post('/session/login')
    async signInWithSession(
        @Body() signinDto: SignInUserDto,
        @Req() req: any,
        @Res() res: Response,
    ) {
        const user = await this.authService.validateUser(signinDto.username, signinDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
          }
          
        req.session.user = { id: user.id, username: user.username };
        
        console.log('SESSION CREATED:', req.session);

        return res.status(HttpStatus.OK).json({
        message: 'Login successful, session created',
        sessionId: req.sessionID,
        user: req.session.user,
        });
    }

    @UseGuards(SessionAuthGuard)
    @Get('session/profile')
    async getProfile(@Session() session: Record<string, any>) {
        console.log('SESSION ACCESS:', session);
        return {
        message: 'Session valid',
        user: session.user,
        };
    }
    @Get('session/logout')
    async sessionLogout(@Req() req: any, @Res() res: Response) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out, session destroyed' });
      });
    }
}
