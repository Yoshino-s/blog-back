export abstract class Waf<T> {
  abstract check(ele: T): boolean;
  warn(): void {
    //
  }
  abstract escape(ele: T): T;
}