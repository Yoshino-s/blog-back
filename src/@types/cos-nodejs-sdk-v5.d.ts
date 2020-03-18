declare module 'cos-nodejs-sdk-v5' {
  namespace COS {
    type PublicRegion = 'ap-beijing-1' | 'ap-beijing' | 'ap-nanjing' | 'ap-shanghai' | 'ap-guangzhou' | 'ap-chengdu' | 'ap-chongqing';
    type FSIRegion = 'ap-shenzhen-fsi' | 'ap-shanghai-fsi' | 'ap-beijing-fsi';
    type Region = PublicRegion | FSIRegion;

    type StorageClass = 'STANDARD' | 'STANDARD_IA' | 'ARCHIVE';

    type Owner = {
      ID: string;
      DisplayName: string;
    }
    type COSConfig = {
      SecretId: string; SecretKey: string;
      FileParallelLimit?: number;
      ChunkParallelLimit?: number;
      ChunkRetryTimes?: number;
      ChunkSize?: number;
      SliceSize?: number;
      CopyChunkParallelLimit?: number;
      CopyChunkSize?: number;
      CopySliceSize?: number;
      ProgressInterval?: number;
      Protocol?: number;
      ServiceDomain?: string;
      Domain?: string;
      UploadQueueSize?: number;
      ForcePathStyle?: boolean;
      UploadCheckContentMd5?: number;
      getAuthorization?: Function;
      Timeout?: number;
      Proxy?: string;
    }
    type Err = undefined | {
      statusCode: number; headers: object;
      error: {
        Code: string; Message: string; RequestId: string;
      }
    }
    type Data<T = void> = {
      statusCode: number; headers: object;
    } & T;
    type Callback<T = void> = (err: Err, data: Data<T>) => void;

    type TaskCallback = (taskId: number) => void;
    type ProgressCallback = (progressData: {
      loaded: number;
      total: number;
      speed: number;
      percent: number;
    }) => void;

    type BucketOptions = {
      Bucket: string; Region: Region;
    }
    type ObjectOptions = BucketOptions & {
      Key: string;
    }

    type BucketGrant = {
      ACL: 'private' | 'public-read' | 'public-read-write' | 'authenticated-read';
      GrantRead: string; GrantWrite: string; GrantReadAcp: string; GrantWriteAcp: string; GrantFullControl: string;
    }
    type ObjectGrant = {
      ACL: 'default' | 'private' | 'public-read' | 'authenticated-read' | 'bucket-owner-read' | 'bucket-owner-full-control';
      GrantRead: string; GrantWrite: string;  GrantFullControl: string;
    }
    type AccessControlPolicy = {
      Owner: Owner;
      Grants: {
        Permission: 'READ' | 'WRITE' | 'READ_ACP' | 'WRITE_ACP' | 'FULL_CONTROL';
        Grantee: Owner & {
          URI: string;
        };
      }[]
    }
  }
  class COS {
    constructor(config: COS.COSConfig);
    getService(callback: COS.Callback<{
      Owner: COS.Owner;
      Buckets: {
        Name: string;
        Location: string;
        CreationDate: string;
      }[]
    }>): void;
    getService(options: {
      Region: COS.Region;
    }, callback: COS.Callback<{
        Owner: COS.Owner;
        Buckets: {
          Name: string;
          Location: string;
          CreationDate: string;
        }[]
      }>): void;
    
    putBucket(options: COS.BucketOptions & COS.BucketGrant, callback: COS.Callback): void;
    headBucket(options: COS.BucketOptions, callback: COS.Callback): void;
    deleteBucket(options: COS.BucketOptions, callback: COS.Callback): void;
    putBucketAcl(options: COS.BucketOptions & Partial<COS.BucketGrant> & {
      AccessControlPolicy?: Partial<COS.AccessControlPolicy>
    }, callback: COS.Callback): void;
    getBucketAcl(options: COS.BucketOptions, callback: COS.Callback<COS.BucketGrant & COS.AccessControlPolicy>): void;
    
    getBucket(options: COS.BucketOptions & {
      Prefix?: string;
      Delimiter?: string;
      Marker?: string;
      MaxKeys?: number;
      EncodingType?: string;
    }, callback: COS.Callback<{
        Name: string;
        Prefix: string;
        Delimiter: string;
        Marker: string;
        MaxKeys: number;
        EncodingType: string;
        IsTruncated: string;
        NextMarker: string;
        CommonPrefixes: {
          Prefix: string;
        }[];
        Contents: {
          Key: string;
          ETag: string;
          Size: string;
          LastModified: string;
          Owner: COS.Owner;
          StorageClass: COS.StorageClass;
        }[]
      }>): void;
    
    putObject(options: COS.ObjectOptions & Partial<COS.ObjectGrant> & {
      Body: ReadableStream | Buffer | string;
      CacheControl?: string;
      ContentDisposition?: string;
      ContentEncoding?: string;
      ContentLength?: number;
      ContentType?: string;
      Expires?: number;
      Expect?: '100-continue';
      StorageClass?: COS.StorageClass;
      onTaskReady: COS.TaskCallback;
      onProgress: COS.ProgressCallback;
    } & {
      [key: string]: string;
    }, callback?: COS.Callback<{
        ETag: string;
        Location: string;
        VersionId?: string;
      }>): void;
    
    headObject(options: COS.ObjectOptions & {
      IfModifiedSince?: string;
    }, callback: COS.Callback<{
        'x-cos-object-type': string;
        'x-cos-storage-class': string;
        NotModified: boolean;
        ETag: string;
        VersionId: string;
      } & {
        [key: string]: string;
      }>): void;
    getObject(options: COS.ObjectOptions & {
      Output: string | WritableStream;
      ResponseContentType?: string;
      ResponseContentLanguage?: string;
      ResponseExpires?: string;
      ResponseCacheControl?: string;
      ResponseContentDisposition?: string;
      ResponseContentEncoding?: string;
      Range?: string;
      IfModifiedSince?: string;
      IfUnmodifiedSince?: string;
      IfMatch?: string;
      IfNoneMatch?: string;
      VersionId?: string;
      onProgress?: COS.ProgressCallback;
    }, callback: COS.Callback<{
        CacheControl: string;
        ContentDisposition: string;
        ContentEncoding: string;
        Expires: string;
        'x-cos-storage-class'?: COS.StorageClass;
        NotModified: boolean;
        ETag: string;
        VersionId: string;
        Body: Buffer;
      } & {
        [key: string]: string;
      }>): void;
    
    optionsObject(options: COS.ObjectOptions & {
      Origin: string;
      AccessControlRequestMethod: string;
      AccessControlRequestHeaders?: string;
    }, callback: COS.Callback<{
        AccessControlAllowOrigin: string;
        AccessControlAllowMethods: string;
        AccessControlAllowHeaders: string;
        AccessControlExposeHeaders: string;
        AccessControlMaxAge: string;
        OptionsForbidden: boolean;
      }>): void;
    
    putObjectCopy(options: COS.ObjectOptions & Partial<COS.ObjectGrant> & {
      CopySource: string;
      MetadataDirective?: 'Replaced' | 'Copy';
      CopySourceIfModifiedSince?: string;
      CopySourceIfUnmodifiedSince?: string;
      CopySourceIfMatch?: string;
      CopySourceIfNoneMatch?: string;
      StorageClass?: COS.StorageClass;
    } & {
      [key: string]: string;
    }, callback?: COS.Callback<{
        ETag: string;
        LastModified: string;
        VersionId?: string;
      }>): void;
    
    deleteObject(options: COS.ObjectOptions & {
      VersionId?: string;
    }, callback: COS.Callback): void;
    deleteMultipleObject(options: COS.BucketOptions & {
      Quiet?: boolean;
      Objects: {
        Key: string;
        VersionId?: string;
      }[]
    }, callback: COS.Callback<{
        Deleted: {
          Key: string;
          VersionId: string;
          DeleteMarker: 'true' | 'false';
          DeleteMarkerVersionId?: string;
        }[];
        Error: {
          Key: string;
          Code: string;
          Message: string;
        }[];
      }>): void;
    
    restoreObject(options: COS.ObjectOptions & {
      RestoreRequest: {
        Days: number;
        CASJobParameters: {
          Tire: 'Standard' | 'Expedited' | 'Bulk';
        }
      }
    }, callback: COS.Callback): void;

    putObjectAcl(options: COS.ObjectOptions & Partial<COS.ObjectGrant> & {
      AccessControlPolicy: COS.AccessControlPolicy;
    }, callback: COS.Callback): void;
    getObjectAcl(options: COS.ObjectOptions, callback: COS.Callback<COS.AccessControlPolicy & {
      ACL: COS.ObjectGrant['ACL'];
    }>): void;
    sliceUploadFile(options: COS.ObjectOptions & {
      FilePath: string;
      SliceSize?: number;
      AsyncLimit?: number;
      StorageClass?: COS.StorageClass;
      onTaskReady?: COS.TaskCallback;
      onHashProgress?: COS.ProgressCallback;
      onProgress?: COS.ProgressCallback;
    }, callback: COS.Callback<{
        Location: string;
        Bucket: string;
        Key: string;
        ETag: string;
        VersionId?: string;
      }>): void;

    sliceCopyFile(options: COS.ObjectOptions & {
      CopySource: string;
      ChunkSize?: number;
      SliceSize?: number;
      onProgress?: COS.ProgressCallback;
    }, callback: COS.Callback<{
        Location: string;
        Bucket: string;
        Key: string;
        ETag: string;
        VersionId?: string;
      }>): void;
    
    uploadFiles(options: {
      files: (COS.ObjectOptions & {
        FilePath: string
      })[];
      SliceSize: number;
      onProgress?: COS.ProgressCallback;
      onFileFinish?: (err: COS.Err, data: {
        ETag: string;
        Location: string;
        VersionId?: string;
      }, options: COS.ObjectOptions & {
          FilePath: string
        }) => void;
    }, callback: COS.Callback<{
        files: {
          err?: COS.Err;
          data: {
            ETag: string;
            Location: string;
            VersionId?: string;
          };
          options: COS.ObjectOptions & {
            FilePath: string
          }
        }[]
      }>): void;
    
    cancelTask: COS.TaskCallback;
    pauseTask: COS.TaskCallback;
    restartTask: COS.TaskCallback;
    
    getObjectUrl(options: COS.ObjectOptions & {
      Sign?: boolean;
      Method?: string;
      Query?: object;
      Headers?: object;
      Expires?: number;
    }, callback: COS.Callback<{
        Url: string;
      }>): void;
  }

  export = COS;
}