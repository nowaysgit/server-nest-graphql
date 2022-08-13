import { Controller, Get, Post } from '@nestjs/common';

@Controller('')
export class AppController {
  @Post('/')
  indexPost(): string {
    return 'available only /graphql';
  }

  @Get('/')
  indexGet(): string {
    return 'available only /graphql';
  }
}
