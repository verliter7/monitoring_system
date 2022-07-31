export interface PerformanceEntryHandler {
  (entry: any): void
}

export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export interface MPerformanceNavigationTiming {
  FP?: string;
  TTI?: string;
  DomReady?: string;
  Load?: string;
  FirstByte?: string;
  DNS?: string;
  TCP?: string;
  SSL?: string;
  TTFB?: string;
  Trans?: string;
  DomParse?: string;
  Res?: string;
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