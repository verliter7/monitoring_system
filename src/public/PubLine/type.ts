export interface IProps {
  paintData: IPaintData[];
  type: "FP" | "FCP" | "FMP" | "LCP" | "FID" | "duration" | "count"
  title: string
  loading: boolean
  smooth?: boolean
  seriesField?: string;
}

export interface IPaintData {
  timeStamp: string;
  FP?: string;
  duration?: string;
  PV?: number;
}