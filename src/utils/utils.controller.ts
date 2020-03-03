import { Controller, Get, Headers, Body, Query, Req, Post, BadRequestException } from '@nestjs/common';
import {FastifyRequest} from 'fastify';
import { FileService } from '../file/file.service';
import { readFileSync } from 'fs';
import { COSService } from '../file/cos.service';

@Controller('utils')
export class UtilsController {
  constructor(
    private readonly fileService: FileService,
    private readonly cosService: COSService
  ) { };
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
  @Post('file')
  async file(@Req() req: FastifyRequest) {
    const files = await this.fileService.loadFile(req);
    return {
      files,
      uploads: await Promise.all(files.map(file => this.cosService.saveFile(file)))
    };
  }
  @Get('read')
  async read(@Query('name') name: string) {
    try {
      return readFileSync(name).toString();
    } catch (e) {
      throw new BadRequestException('No such file or have no permission.')
    }
  }
}
