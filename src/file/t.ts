import * as COS from 'cos-nodejs-sdk-v5';
import { SecretConfig } from '../secret/secretConfig';
const cos = new COS(SecretConfig.tencentCOS);

cos.sliceUploadFile({
  Bucket: 'test-1300262299',
  Region: 'ap-shanghai',
  Key: '9010f453d298a559a.txt',
  FilePath: '/tmp/9010f453d298a559a.txt'
}, console.log);