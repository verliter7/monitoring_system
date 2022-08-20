import { Link } from 'react-router-dom';
import IconFont from '@/components/Iconfont';

export const meunConfig = [
  {
    key: '/monitor/jsError',
    icon: <IconFont type="icon-iconfontsocialjavascriptoutline" />,
    label: <Link to="/monitor/jsError">JS错误</Link>,
  },
  {
    key: '/monitor/httpError',
    icon: <IconFont type="icon-cloud-times" />,
    label: <Link to="/monitor/httpError">请求错误</Link>,
  },
  {
    key: '/monitor/resourcesError',
    icon: <IconFont type="icon-ziyuan-xianxing" />,
    label: <Link to="/monitor/resourcesError">静态资源错误</Link>,
  },
  {
    key: '/monitor/pageLoad',
    icon: <IconFont type="icon-yemian" />,
    label: <Link to="/monitor/pageLoad">页面加载</Link>,
  },
  {
    key: '/monitor/httpMonitor',
    icon: <IconFont type="icon-ic_http" />,
    label: <Link to="/monitor/httpMonitor">请求监控</Link>,
  },
  {
    key: '/monitor/test',
    icon: <IconFont type="icon-APIceshi" />,
    label: <Link to="/monitor/test">测试页面</Link>,
  },
];

const getComponentPath = (name: string) => `/src/pages/${name}/index.tsx`;
export const routerConfig = [
  {
    pathname: '/jsError',
    componentPath: getComponentPath('JsError'),
  },
  {
    pathname: '/httpError',
    componentPath: getComponentPath('HttpError'),
  },
  {
    pathname: '/resourcesError',
    componentPath: getComponentPath('ResourcesError'),
  },
  {
    pathname: '/pageLoad',
    componentPath: getComponentPath('PageLoad'),
  },
  {
    pathname: '/httpMonitor',
    componentPath: getComponentPath('HttpMonitor'),
  },
  {
    pathname: '/test',
    componentPath: getComponentPath('Test'),
  },
];
