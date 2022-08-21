export type waterFallType = {
  [Key in 'dnsLookup' | 'initialConnect' | 'ssl' | 'contentDownload']: string;
}
export type DataType = {
  timeStamp: number;
  name: string;
  duration: string;
  initiatorType: string;
  transferSize: number;
  waterfall?: Record<string, any>[];
}