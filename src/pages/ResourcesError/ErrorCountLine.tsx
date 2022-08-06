import { Spin } from 'antd';
import { Area } from '@ant-design/charts';
import { G2 } from '@ant-design/plots';
import { each, findIndex } from '@antv/util';
import type { FC, ReactElement } from 'react';
import type { IErrorCountData } from './type';

interface IProps {
  backErrorCountData: IErrorCountData[];
  loading: boolean;
}

const ErrorCountLine: FC<IProps> = ({ backErrorCountData, loading }): ReactElement => {
  const { InteractionAction, registerInteraction, registerAction } = G2;

  G2.registerShape('point', 'custom-point', {
    draw(cfg, container) {
      const point = {
        x: cfg.x,
        y: cfg.y,
      };
      const group = container.addGroup();
      group.addShape('circle', {
        name: 'outer-point',
        attrs: {
          x: point.x as number,
          y: point.y as number,
          fill: cfg.color || 'red',
          opacity: 0.5,
          r: 6,
        },
      });
      group.addShape('circle', {
        name: 'inner-point',
        attrs: {
          x: point.x as number,
          y: point.y as number,
          fill: cfg.color || 'red',
          opacity: 1,
          r: 2,
        },
      });
      return group;
    },
  });

  class CustomMarkerAction extends InteractionAction {
    active() {
      const view = this.getView();
      const evt = this.context.event;

      if (evt.data) {
        // items: 数组对象，当前 tooltip 显示的每条内容
        const { items } = evt.data;
        const pointGeometries = view.geometries.filter((geom) => geom.type === 'point');
        each(pointGeometries, (pointGeometry) => {
          each(pointGeometry.elements, (pointElement, idx) => {
            const active = findIndex(items, (item: any) => item.data === pointElement.data) !== -1;
            const [point0, point1] = pointElement.shape.getChildren();

            if (active) {
              // outer-circle
              point0.animate(
                {
                  r: 10,
                  opacity: 0.2,
                },
                {
                  duration: 1800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              ); // inner-circle

              point1.animate(
                {
                  r: 6,
                  opacity: 0.4,
                },
                {
                  duration: 800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              );
            } else {
              this.resetElementState(pointElement);
            }
          });
        });
      }
    }

    reset() {
      const view = this.getView();
      const points = view.geometries.filter((geom) => geom.type === 'point');
      each(points, (point) => {
        each(point.elements, (pointElement) => {
          this.resetElementState(pointElement);
        });
      });
    }

    resetElementState(element: { shape: { getChildren: () => [any, any] } }) {
      const [point0, point1] = element.shape.getChildren();
      point0.stopAnimate();
      point1.stopAnimate();
      const { r, opacity } = point0.get('attrs');
      point0.attr({
        r,
        opacity,
      });
      const { r: r1, opacity: opacity1 } = point1.get('attrs');
      point1.attr({
        r: r1,
        opacity: opacity1,
      });
    }

    getView() {
      return this.context.view;
    }
  }

  registerAction('custom-marker-action', CustomMarkerAction);
  registerInteraction('custom-marker-interaction', {
    start: [
      {
        trigger: 'tooltip:show',
        action: 'custom-marker-action:active',
      },
    ],
    end: [
      {
        trigger: 'tooltip:hide',
        action: 'custom-marker-action:reset',
      },
    ],
  });

  const config: any = {
    theme: 'dark',
    data: backErrorCountData,
    padding: 'auto' as 'auto',
    xField: 'time',
    yField: 'errorCount',
    yAxis: {
      tickInterval: 1,
      top: true,
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
    label: {},
    legend: {
      layout: 'horizontal',
      position: 'top',
    },
    point: {
      size: 5,
      shape: 'custom-point',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
      formatter: (erorCountData: IErrorCountData) => {
        return { name: '错误数量', value: erorCountData.errorCount + '个' };
      },
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'custom-marker-interaction',
      },
    ],
  };

  return (
    <Spin tip="图表加载中..." spinning={loading} size="large">
      <Area {...config} />
    </Spin>
  );
};

export default ErrorCountLine;
