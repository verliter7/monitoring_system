export type ITimingData = {
  timeStamp: number;
  id: number;
  [key: string]: string | number;
}

// export interface HTimingData {
//   DNS: number
//   DomParse: number
//   DomReady: number
//   FP: number
//   FirstByte: number
//   Load: number
//   Res: number
//   SSL: number
//   TCP: number
//   TTFB: number
//   TTI: number
//   Trans: number
//   timeStamp: string
// }