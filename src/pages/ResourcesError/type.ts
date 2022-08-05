export interface IData {
  frontErrorConutsByTime: Record<string, number>;
  backErrorConutsByTime: Record<string, number>;
}

export interface IErrorCountData {
  time: string;
  errorCount: number;
}

export interface IErrorSum {
  front: number;
  back: number;
}
