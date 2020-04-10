import { merge } from 'lodash';

export interface Metadata {
  title?: string;
  tags?: string[];
  category?: string;
  description?: string;
  preview?: string;
  author?: string;
  headPicture?: string;
}

type MetadataAdapter = (metadata: string) => Metadata | null;

function has<K extends string|number|symbol, V>(o: object, k: K, v?: V | {new(): V}): o is {[P in K]: V}  {
  return o.hasOwnProperty(k) && v === undefined || (v instanceof Function ? (o as any)[k] instanceof v : Object.getPrototypeOf((o as any)[k]) === Object.getPrototypeOf(v))
}

const parseJSON: MetadataAdapter = (metadata: string) => {
  try {
    return JSON.parse(metadata);
  } catch {
    return null;
  }
}
export const adapters: MetadataAdapter[] = [parseJSON];
const parseMetadata: MetadataAdapter = (metadata: string) => {
  const res = adapters.reduce((p, a) => p ? p : a(metadata), null) || {};

  return null;
}

const metadataRegexp = /^---\s+([^]*)---/g;

export function extractMetadata(md: string): { metadata: Metadata, md: string } {
  const m = metadataRegexp.exec(md);
  let metadata: Metadata = {};
  if (m) {
    metadata = parseMetadata(m[1]);
    md = md.replace(metadataRegexp, '');
  }
  return {
    metadata,
    md
  }
}