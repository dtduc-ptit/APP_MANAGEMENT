import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${ip} - ${userAgent}`);
    
    // Đo thời gian xử lý request
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`Request completed in ${duration}ms with status ${res.statusCode}`);
    });

    next();
  }
}
