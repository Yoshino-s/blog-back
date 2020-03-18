export type Ret<RS extends Record<number, any>> = {
  code: keyof RS & number,
  data?: RS[keyof RS & number]
}

export const AsyncUtils = {
  map<T, R>(dat: T[], func: (item: T, index: number, array: T[]) => R | Promise<R>) {
    if (dat.length === 0)
      return [];
    return Promise.all(dat.map((v, i, a) => func(v, i, a)));
  },
  forEach<T>(dat: T[], func: (item: T, index: number, array: T[]) => void) {
    if (dat.length === 0)
      return;
    return Promise.all(dat.map((v, i, a) => func(v, i, a)));
  },
  async filter<T>(dat: T[], func: (item: T, index: number, array: T[]) => boolean | Promise<boolean>) {
    if (dat.length === 0)
      return [];
    return (await Promise.all(dat.map(async (v, i, a) => (await func(v, i, a))?v:undefined))).filter(Boolean);
  }
}