export type Ret<RS extends Record<number, any>> = {
  code: keyof RS & number,
  data?: RS[keyof RS & number]
}