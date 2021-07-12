/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import type { FC } from 'react';
import React, { useEffect } from 'react';
import update from 'immutability-helper';
import type { DropTargetConnector, DropTargetMonitor } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';
import Card from './Card';
import '../DragSource/style.less';

type Props = {
  canDrop: any;
  isOver: any;
  connectDropTarget: any;
  data: any;
  setData: any;
  cardProps: any;
};
const DropTargetComp: FC<Props> = ({
  canDrop,
  isOver,
  connectDropTarget,
  data,
  setData,
  cardProps,
}) => {
  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = data[dragIndex];
    setData(
      update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      }),
    );
  };

  const renderCotent = (record: any) => {
    let dom;
    return record.map((item: any, i: any) => {
      // 如果是组合数据
      if (item.value === '，' || item.value === ',') {
        dom = (
          <div style={{ display: 'contents' }}>
            <Card
              {...cardProps}
              text={item.value}
              type={item.type}
              key={item.id}
              id={item.id}
              from={item.form}
              index={i}
              moveCard={moveCard}
            />
            <br />
          </div>
        );
      } else {
        dom = (
          <Card
            {...cardProps}
            text={item.value}
            type={item.type}
            key={item.id}
            id={item.id}
            from={item.form}
            index={i}
            moveCard={moveCard}
          />
        );
      }
      return dom;
    });
  };

  useEffect(() => {
    renderCotent(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isAction = isOver && canDrop;
  let backgroundColor = '#fff';
  if (isAction) {
    backgroundColor = '#e6f7ff';
  }

  return (
    <div ref={connectDropTarget} className="leftContainer" style={{ backgroundColor }}>
      {renderCotent(data)}
    </div>
  );
};

export default DropTarget(
  ItemTypes.BOX,
  {
    drop: () => ({ name: '接收者' }),
  },
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
)(DropTargetComp);
