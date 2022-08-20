import { PerformanceTimingModel, PerformancePaintModel, PerformanceCLSModel } from '@/model/performance.model';
import UserModel from '@/model/user.model';
import type { Optional } from 'sequelize/types';

const timingType = [
  'DNS',
  'TCP',
  'SSL',
  'FirstByte',
  'TTFB',
  'Trans',
  'DomParse',
  'Res',
  'FP',
  'TTI',
  'DomReady',
  'Load',
];
const typeDescribe: Record<string, string> = {
  DNS: 'DNS查询',
  TCP: 'TCP连接',
  SSL: '数据安全连接耗时',
  FirstByte: '首字节网络请求',
  TTFB: '网络请求耗时',
  Trans: '响应数据传输耗时',
  DomParse: 'DOM解析',
  Res: '资源加载耗时',
  FP: '白屏时间',
  TTI: '首次可交互时间',
  DomReady: 'DOM阶段渲染耗时',
  Load: '页面完全加载耗时',
};

export async function createPerformance_s(aid: string, performanceInfo: Optional<any, string>) {
  const isCreate = await findAid(aid);

  if (!isCreate) return null;

  let result;
  if (performanceInfo.type === 'timing') {
    const {
      kind,
      type,
      aid,
      timeStamp,
      originUrl,
      userMonitorId,
      osName,
      osVersion,
      egName,
      egVersion,
      bsName,
      bsVersion,
      ua,
      ip,
    } = performanceInfo;
    let data: Record<string, any> = {
      kind,
      type,
      aid,
      timeStamp,
      originUrl,
      userMonitorId,
      osName,
      osVersion,
      egName,
      egVersion,
      bsName,
      bsVersion,
      ua,
      ip,
    };
    for (let type of timingType) {
      data.timingType = type;
      data.describe = typeDescribe[type];
      let [end, start] = performanceInfo[type].split('-');
      data.during = Number(end) - Number(start);
      data.start = Number(start);
      data.end = Number(end);
      await PerformanceTimingModel.create(data);
    }
  }
  if (performanceInfo.type === 'paint') {
    result = await PerformancePaintModel.create(performanceInfo);
  }
  if (performanceInfo.type === 'CLS') {
    result = await PerformanceCLSModel.create(performanceInfo);
  }
  return result;
}

/**
 * @description: 查找用户表是否存在该aid
 * @param aid 应用id
 */
export async function findAid(aid: string) {
  const count = await UserModel.count({
    where: {
      aid,
    },
  });

  return Boolean(count);
}

export async function getPerformanceData_s(aid: string, type: string) {
  let data;
  switch (type) {
    case 'timing':
      data = PerformanceTimingModel.findAll();
      break;
    case 'paint':
      data = PerformancePaintModel.findAll();
      break;
    case 'CLS':
      data = PerformanceCLSModel.findAll();
      break;
    default:
      data = PerformanceTimingModel.findAll({
        where: {
          aid,
        },
        limit: 20,
      });
  }
  return data;
}
