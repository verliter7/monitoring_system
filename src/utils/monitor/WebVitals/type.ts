export interface PerformanceEntryHandler {
  (entry: any): void
}

export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export interface MPerformanceNavigationTiming {
  FP?: number;
  TTI?: number;
  DomReady?: number;
  Load?: number;
  FirseByte?: number;
  DNS?: number;
  TCP?: number;
  SSL?: number;
  TTFB?: number;
  Trans?: number;
  DomParse?: number;
  Res?: number;
}

export interface ResourceFlowTiming {
  name: string;
  transferSize: number;
  initiatorType: string;
  startTime: number;
  responseEnd: number;
  dnsLookup: number;
  initialConnect: number;
  ssl: number;
  request: number;
  ttfb: number;
  contentDownload: number;
}