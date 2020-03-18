import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { Connection, Repository } from 'typeorm';
import { FastifyRequest } from 'fastify';
import { COSService } from '../file/cos.service';
import { Content } from 'src/entity/Content.entity';
import { AsyncUtils } from '../utils/utils';
import { Paragraph } from '../entity/Paragraph.entity';
import { extractMetadata } from '../utils';
import { readFileSync, writeFileSync } from 'fs';
import { preProcessMarkdown } from '../utils/markdownUtils';
import { File } from 'src/file/file.interface';
import { FileTypeChecker } from '../utils/fileTypeCheck';

@Injectable()
export class ContentService {
  contentRepository: Repository<Content>;
  constructor(
    private readonly fileService: FileService,
    private readonly cosService: COSService,
    private readonly connection: Connection
  ) {
    this.contentRepository = this.connection.getRepository(Content);
  }

  async uploadContent(req: FastifyRequest): Promise<Paragraph> {
    const uploadFiles = await this.fileService.loadFile(req);

    // check if md_file exist
    const mdFile = uploadFiles.find(f => f.field == 'md_file');
    if (!mdFile)
      throw new BadRequestException('Missing file field: md_file');
    
    const res = new Map<string, Content>();
    const files = await AsyncUtils.filter(uploadFiles, async file => {
      const out = await this.contentRepository.findOne({ ETag: file.ETag });
      if (out) {
        if (file.field === 'md_file')
          throw new BadRequestException('Exist same paragraph.');
        res.set(file.field, out);
        return false;
      }
      for (const c of res) {
        if (c[1].ETag === file.ETag) {
          res.set(file.field, c[1])
          return false;
        }
      }
      if (!FileTypeChecker.isImage(file.mimeType)) {
        throw new BadRequestException('You can\'t upload a none image attachment.');
      }
      const content = new Content();
      content.ETag = file.ETag;
      content.name = file.filename;
      content.mimeType = file.mimeType;
      content.postBy = (req as any).user;
      res.set(file.field, content);
      return true;
    });

    const result = extractMetadata(readFileSync(mdFile.tmpFilePath).toString());
    const markdown = preProcessMarkdown(result.result, res, mdFile.ETag);
    writeFileSync(mdFile.tmpFilePath, markdown);

    await AsyncUtils.forEach(await this.cosService.saveFiles(files), async file => {
      const content = res.get(file.field);
      content.key = file.key;
      content.remoteAddress = file.url;
      await content.save();
    });

    const paragraph = new Paragraph();
    paragraph.metadata = result.metadata;
    if (res.has('head_file'))
      paragraph.headPicture = res.get('head_file'); res.delete('head_file');
    paragraph.paragraph = res.get('md_file'); res.delete('md_file');
    paragraph.Md5 = paragraph.paragraph.ETag;
    paragraph.media = Array.from(res.values());
    await paragraph.save();
    return paragraph;
  }

  async showParagraph(id: string) {
    const paragraph = await Paragraph.findOne({
      Md5: id
    }, {
      relations: ['paragraph', 'headPicture', 'media']
    });
    if (!paragraph)
      throw new NotFoundException('No such paragraph.');
    return JSON.stringify(paragraph);
  }
}