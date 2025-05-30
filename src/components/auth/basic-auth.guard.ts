import { CanActivate, Injectable , ExecutionContext, UnauthorizedException} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class BasicAuthGuard implements CanActivate {
    constructor(
        private authService: AuthService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            throw new UnauthorizedException('Authorization header not found');
        }
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        const user = await this.authService.validateUser(username, password);
        request['user'] = user;

        return true;
    }
}