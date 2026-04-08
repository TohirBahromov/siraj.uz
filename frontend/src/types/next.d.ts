export {};

declare global {
  type PageProps<P extends string = string> = {
    params: Promise<ExtractParams<P>>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  };

  type ExtractParams<T extends string> = T extends `${string}[${infer Param}]${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : {};
}
