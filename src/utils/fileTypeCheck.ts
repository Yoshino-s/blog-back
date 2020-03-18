import { MimeType } from 'file-type';

export type TypeChecker = (type: MimeType | string) => boolean;

export const FileTypeChecker: {
  [key: string]: TypeChecker
} = {
  isImage: type=> type.startsWith('image/'),
};
