
declare type Element = {
  install(vue: any): void
}
declare const element: Element;
export * from './http'
export { element };