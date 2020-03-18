import { Controller, UseGuards, Post, Req, UsePipes, ValidationPipe, Get, Query, Param } from '@nestjs/common';
import { ContentService } from './content.service';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { FileService } from '../file/file.service';

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly fileService: FileService
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async upload(@Req() req: FastifyRequest) {
    return (await this.contentService.uploadContent(req)).paragraph.ETag;
  }

  @Get('{id}')
  @UsePipes(new ValidationPipe({ transform: true }))
  async show(@Param('id') id: string) {
    return (await this.contentService.showParagraph(id));
  }
}