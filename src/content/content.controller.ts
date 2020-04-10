import { Controller, UseGuards, Post, Req, UsePipes, ValidationPipe, Get, Query, Param, Body } from '@nestjs/common';
import { ContentService } from './content.service';
import { AuthGuard } from '@nestjs/passport';
import { FileService } from '../file/file.service';
import { SearchDTO, UploadDTO } from './content.dto';
import { Form } from 'src/utils/FormDataDecorator';

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly fileService: FileService
  ) { }

  @Post()
  async upload(@Form() form: UploadDTO) {
    const res = await this.contentService.uploadContent(form);
    if (res instanceof Error) {
      throw res;
    } else {
      return {
        link: `/paragraph/${res.id}`
      }
    }
  }
  @Get(':id')
  async get(@Param('id') id: string) {
    return { paragraph: await this.contentService.showParagraph(id) };
  }

  @Get('search/category/:category')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchByCategory(@Param('category') category: string, @Query() options: SearchDTO) {
    return (await this.contentService.searchByCategory({ category, ...options}));
  }

  @Get('search/tag/:tag')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchByTag(@Param('tag') tag: string, @Query() options: SearchDTO) {
    return (await this.contentService.searchByTag({ tag, ...options}));
  }

  @Get('list/category')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listCategory(@Query() options: SearchDTO) {
    const res = { categories: (await this.contentService.listCategories(options)) };
    return res;
  }

  @Get('list/category/:category')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listByCategory(@Param('category') category: string, @Query() options: SearchDTO) {
    const res = { categories: (await this.contentService.listCategories({ category, ...options })) };
    return res;
  }

  @Get('list/tag')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listTag(@Query() options: SearchDTO) {
    const res = { tags: (await this.contentService.listTags(options)) };
    return res;
  }

  @Get('list/tag/:tag')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listByTag(@Param('tag') tag: string, @Query() options: SearchDTO) {
    const res = { tags: (await this.contentService.listTags({ tag, ...options })) };
    return res;
  }

  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() options: {title?: string} & SearchDTO) {
    const res = { paragraphs: (await this.contentService.searchParagraphs(options)) };
    return res;
  }
}