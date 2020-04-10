import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { Connection } from 'typeorm';
import { FastifyRequest } from 'fastify';
import { COSService } from '../file/cos.service';
import { Paragraph } from '../entity/Paragraph.entity';
import { extractMetadata } from '../utils';
import { readFileSync, writeFileSync } from 'fs';
import { Category } from '../entity/Category.entity';
import { Tag } from '../entity/Tag.entity';
import { SearchDTO, UploadDTO } from './content.dto';
import { merge } from 'lodash';
import { exclude } from '../utils/utils';

@Injectable()
export class ContentService {
  constructor(
    private readonly fileService: FileService,
    private readonly cosService: COSService,
    private readonly connection: Connection
  ) {
  }

  async uploadContent(form: UploadDTO): Promise<Paragraph | Error> {
    console.log(form);
    // check if md_file exist
    const mdFile = form.paragraph;
    if(!mdFile) 
      return new BadRequestException('Missing file field: md_file');
    delete form.paragraph;
    const out = await Paragraph.findOne({ Md5: mdFile.ETag });
    if (out) {
      return new BadRequestException('The paragraph has existed.');
    }

    //prevent tags parse error
    let tags = [];
    try {
      tags = JSON.parse(form.tags);
      if (!Array.isArray(tags)) {
        tags = [];
      }
    } catch (e) {
      //
    }

    //Create paragraph
    const paragraph = new Paragraph();


    let { metadata, md } = extractMetadata(readFileSync(mdFile.tmpFilePath).toString());
    metadata = merge(metadata, {
      title: form.title,
      preview: form.preview,
      category: form.category,
      tags: tags,
    });
    const files = []
    Object.values(form).forEach(v => {
      if (!(typeof v === 'string')) {
        files.push(v);
      }
    });
    (await this.cosService.saveFiles(files)).forEach(file => {
      if (file.field === 'headPicture') {
        paragraph.headPicture = file.url;
      } else {
        md = md.replace(decodeURIComponent(file.field), file.url);
      }
    });
    if (metadata.headPicture) {
      paragraph.headPicture = metadata.headPicture;
    }
    if (metadata.category)
      paragraph.category = await this.getCategory(metadata.category);
    if (metadata.tags && metadata.tags.length) {
      paragraph.tags = await this.getTags(metadata.tags);
    }
    paragraph.title = metadata.title;
    paragraph.description = metadata.description;
    paragraph.preview = metadata.preview;
    paragraph.paragraph = md;
    paragraph.Md5 = mdFile.ETag;
    if (form.uploadToCDN) {
      writeFileSync(mdFile.tmpFilePath, `---\n${JSON.stringify(metadata)}\n---\n${md}`);
      const { url } = await this.cosService.saveFile(mdFile);
      paragraph.paragraphLink = url;
    }
    await paragraph.save();
    return paragraph;
  }

  async showParagraph(id: string) {
    const paragraph = await Paragraph.createQueryBuilder('paragraph')
      .leftJoinAndSelect('paragraph.tags', 'tags')
      .leftJoinAndSelect('paragraph.category', 'category')
      .where('paragraph.id = :id or paragraph.Md5 = :id', { id: id })
      .getOne();
    if (!paragraph)
      throw new NotFoundException('No such paragraph.');
    return paragraph;
  }

  async getCategory(name: string) {
    return (await Category.findOne({ name })) ?? (await Category.create({ name}).save())
  }
  async getTags(tags: string[]) {
    tags = Array.from(new Set(tags));
    let res = await Tag.createQueryBuilder('tag')
      .where('tag.name IN (:tags)', { tags })
      .getMany();
    const u: {name: string}[] = [];
    tags.forEach(v => {
      if (res.findIndex(t => t.name === v) === -1)
        u.push({name: v});
    });
    if (u.length) {
      const res0 = await Tag.createQueryBuilder('tag')
        .insert()
        .values(u)
        .execute();
      res = res.concat(res0.generatedMaps as Tag[]);
    }
    
    return res
  }

  async searchParagraphs(options: {title?: string} & SearchDTO = {}) {
    let result = Paragraph.createQueryBuilder('paragraph');
    result = result.leftJoinAndSelect('paragraph.tags', 'tags')
      .leftJoinAndSelect('paragraph.category', 'category');
    if (options.title)
      result = result.where('paragraph.title like :title', { title: `%${options.title}%` });
    result = result.skip(options.offset)
      .limit(options.limit);
    return result.getMany();
  }

  async searchByCategory(options: { category: string } & SearchDTO) {
    const result = await Category.createQueryBuilder('category')
      .where('category.name=:category', {category: options.category})
      .leftJoinAndSelect('category.paragraphs', 'paragraph')
      .skip(options.offset)
      .limit(options.limit)
      .getOne();
    if (!result) {
      throw new NotFoundException('Cannot find the category.')
    }
    return result;
  }

  async searchByTag(options: { tag: string } & SearchDTO) {
    const result = await Tag.createQueryBuilder('tag')
      .where('tag.name=:tag', {tag: options.tag})
      .leftJoinAndSelect('tag.paragraphs', 'paragraph')
      .skip(options.offset)
      .limit(options.limit)
      .getOne();
    if (!result) {
      throw new NotFoundException('Cannot find the tag.')
    }
    return result;
  }

  async listTags(options: { tag?: string } & SearchDTO) {
    let query = Tag.createQueryBuilder('tag')
      .skip(options.offset)
      .limit(options.limit)
    if (options.tag) {
      query = query.where('tag.name like :tag', { tag: '%' + options.tag + '%' });
    }
    return query.getMany();
  }

  async listCategories(options: { category?: string } & SearchDTO) {
    let query = Category.createQueryBuilder('category')
      .skip(options.offset)
      .limit(options.limit)
    if (options.category) {
      query = query.where('category.name like :category', { category: '%' + options.category + '%' });
    }
    return query.getMany();
  }
}