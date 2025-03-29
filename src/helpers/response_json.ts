const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");
import { Response } from 'express';

function success(res: Response, status_code: number, message: string, data: any) {
  res.status(status_code).json({
    status_code,
    timestamp: `${moment().format("YYYY-MM-DD HH:mm:ss")} (Asia/Jakarta)`,
    success: true,
    message,
    data,
    error: null,
  });
}

function createError(res: Response, status_code: number, message: string, error: any) {
  res.status(status_code).json({
    status_code,
    timestamp: `${moment().format("YYYY-MM-DD HH:mm:ss")} (Asia/Jakarta)`,
    success: false,
    message,
    data: null,
    error,
  });
}

export {
  success,
  createError,
};