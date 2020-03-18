import { Waf } from './waf';
import { sep } from 'path';
export class FilenameWaf extends Waf<string> {
  check(ele: string) {
    return ele.includes(sep);
  }
  escape(ele: string) {
    return ele.replace(sep, '_');
  }
}