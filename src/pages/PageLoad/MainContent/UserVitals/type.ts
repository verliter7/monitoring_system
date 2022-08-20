export interface IViewData {
  timeStamp: string,
  count: number,
  category: 'PV' | 'UV'
}

export interface IPaintData {
  timeStamp: string,
  duration: number,
}