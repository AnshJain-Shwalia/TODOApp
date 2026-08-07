import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  iceCreamStatus(@Req() request: Request, @Res() response: Response) {
    response
      .status(HttpStatus.OK)
      .json({ body: this.appService.iceCreamStatus() });
  }
}
