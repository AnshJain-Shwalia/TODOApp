import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('user')
export class UserController {
  @Get('')
  getUser(@Req() request: Request, @Res() response: Response) {
    response.status(HttpStatus.OK).json({
      user1: 'user1',
      user2: 'user2',
    });
  }
}
