import { File } from '../file/file.interface';
export class SearchDTO {
  offset?: number;
  limit?: number;
}

export class UploadDTO {
  title: string;
  preview: string;
  category: string;
  tags: string;
  uploadToCDN: string;
  paragraph: File;
  headPicture: File;

  [key: string]: File | string;
}