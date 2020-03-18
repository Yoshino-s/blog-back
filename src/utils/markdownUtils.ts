import * as MarkdownIt from 'markdown-it';
import { Content } from '../entity/Content.entity';
import { randomBytes } from 'crypto';

type MetadataAdapter = (metadata: string) => object | null;

const parseJSON: MetadataAdapter = (metadata: string) => {
  try {
    return JSON.parse(metadata);
  } catch {
    return null;
  }
}
export const adapters: MetadataAdapter[] = [parseJSON];
const parseMetadata: MetadataAdapter = (metadata: string) => {
  return adapters.reduce((p, a) => p ? p : a(metadata), null) || {};
}

const MDI = new MarkdownIt();

const _normalizeLink = MDI.normalizeLink;

const metadataRegexp = /^---\s+([^]*)---/g;

export function parse(md: string): {metadata: object, result: string} {
  const res = {
    metadata: {},
    result: ''
  }
  const m = metadataRegexp.exec(md);
  if (m) {
    res.metadata = parseMetadata(m[1]);
    md = md.replace(metadataRegexp, '');
  }
  res.result = MDI.render(md);
  return res;
}

export function extractMetadata(md: string): { metadata: object, result: string } {
  const m = metadataRegexp.exec(md);
  let metadata = {};
  if (m) {
    metadata = parseMetadata(m[1]);
    md = md.replace(metadataRegexp, '');
  }
  return {
    metadata,
    result: md
  }
}

export function preProcessMarkdown(md: string, unresolved: Map<string, Content>, id: string) {
  for (const [k, v] of unresolved) {
    md = md.replace(k, `http://${id}.replace/${v.ETag}`);
  }
  return md;
}