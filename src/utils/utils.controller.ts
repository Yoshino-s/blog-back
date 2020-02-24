import { Controller, Get, Headers, Body, Query } from '@nestjs/common';

@Controller('utils')
export class UtilsController {
  @Get('headers')
  headers(@Headers() headers: object): object {
    return headers;
  }
  @Get('body')
  body(@Body() body: object): object {
    return body;
  }
  @Get('query')
  query(@Query() query: object): object {
    return query;
  }
}
