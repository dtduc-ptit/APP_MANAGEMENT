import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../common/entities/user.entities';

@Injectable()
export class AuthService {
    constructor(    
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async signInWithJwt(username: string, pass: string): Promise<{ access_token: string , refresh_token: string }> {
        const user = await this.usersService.findUser(username);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (user.password !== pass) {
            throw new UnauthorizedException('Invalid password');
        }
        const payload = {sub: user.id, username: user.username};

        const access_token = await this.jwtService.signAsync(payload, { expiresIn: '5m' });
        const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '10m' });

        return { access_token, refresh_token };
    }

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.usersService.findUser(username);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.password !== password) {
            throw new UnauthorizedException('Invalid password');
        }
        return user;
    }

    async refreshToken(refresh_token: string): Promise<{access_token: string}>{
        try {
            const payload = await this.jwtService.verifyAsync(refresh_token);
            const newAccessToken = await this.jwtService.signAsync({ sub: payload.sub, username: payload.username }, { expiresIn: '5m' });
        
            return { access_token: newAccessToken };
          } catch (err) {
            throw new UnauthorizedException('Invalid refresh token');
          }
    }

    
}
