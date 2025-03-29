import rateLimit from 'express-rate-limit';
import { limiter as limiterConfig } from '../constants/limiter';

export const limiter = rateLimit({
    windowMs: limiterConfig.windowMs,
    limit: limiterConfig.limit,
    message: limiterConfig.message
});
