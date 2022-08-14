interface defaultData {
  aid: string;
  createdAt: string;
  id: number
  ip: string;
  kind: string;
  originUrl: string;
  osName: string;
  osVersion: string;
  timeStamp: number;
  type: string;
  ua: string;
  updatedAt: string;
  userMonitorId: string;
}

export interface IPaintData extends defaultData {
  FP: string;
  FCP: string;
  FID: string;
  FMP: string;
  LCP: string;
}

export interface ICLSData extends defaultData {
  CLS: string
}

export interface HPaintData {
  FP: number;
  FCP: number;
  FID: number;
  FMP: number;
  LCP: number;
  timeStamp: string;
}