import { Injectable, ExecutionContext, UnauthorizedException,   CanActivate} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { jwtConstants } from "./constants";
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            console.log('Token payload:', payload); // Debugging log
            request['user'] = payload;
            
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        //console.log('Request headers:', request.headers); 
        //console.log('Authorization header:', request.headers.authorization); 
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}
