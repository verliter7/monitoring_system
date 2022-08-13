const getComponentPath = (name: string) => `/src/pages/${name}/index.tsx`;

const meunConfig = [
  {
    pathname: '/jsError',
    icon: 'icon-iconfontsocialjavascriptoutline',
    label: 'JS错误',
    componentPath: getComponentPath('JsError'),
  },
  {
    pathname: '/httpError',
    icon: 'icon-cloud-times',
    label: '请求错误',
    componentPath: getComponentPath('HttpError'),
  },
  {
    pathname: '/resourcesError',
    icon: 'icon-ziyuan-xianxing',
    label: '静态资源错误',
    componentPath: getComponentPath('ResourcesError'),
  },
  {
    pathname: '/pageLoad',
    icon: 'icon-yemian',
    label: '页面加载',
    componentPath: getComponentPath('PageLoad'),
  },
  {
    pathname: '/httpMonitor',
    icon: 'icon-ic_http',
    label: '请求监控',
    componentPath: getComponentPath('HttpMonitor'),
  },
  {
    pathname: '/test',
    icon: 'icon-APIceshi',
    label: '测试页面',
    componentPath: getComponentPath('Test'),
  },
];

export default meunConfig;
