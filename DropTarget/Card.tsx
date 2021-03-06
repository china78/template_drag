/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Tag } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import type {
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DragSourceMonitor,
  DropTargetConnector,
  DragSourceConnector,
} from 'react-dnd';
import { DragSource, DropTarget } from 'react-dnd';
import type { XYCoord } from 'dnd-core';
import { ItemTypes } from '../ItemTypes';
import './style.less';

export type CardProps = {
  text: any;
  from: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  type: number;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  contentData: any;
  setContentData: any;
  setEditCurrent: any;
  form: any;
  setType: any;
  id: any;
  setCombList: any;
  setCombCurrentStatus: any;
  auth: string;
  originCurrent: any;
  setIsOrigin: any;
};

type CardInstance = {
  getNode: () => HTMLDivElement | null;
  getContentData: any;
  getAuth: any;
};
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      text,
      type,
      from,
      isDragging,
      connectDragSource,
      connectDropTarget,
      contentData,
      setContentData,
      setEditCurrent,
      form,
      setType,
      id,
      setCombList,
      setCombCurrentStatus,
      auth,
      originCurrent,
      setIsOrigin,
    },
    ref,
  ) => {
    const elementRef = useRef(null);

    connectDragSource(elementRef);
    connectDropTarget(elementRef);

    const deleteItem = (itemId: any) => {
      const filtedData = contentData.filter((item: any) => item.id !== itemId);
      setContentData(filtedData);
    };
    const opacity = isDragging ? 0 : 1;

    useImperativeHandle<any, CardInstance>(ref, () => ({
      getNode: () => elementRef.current,
      getContentData: () => contentData,
      getAuth: () => auth,
    }));

    const editCurrentEvent = (_id: number, value: any, _type: any, _from: any) => {
      const currentClickCard: any = { id: _id, value, type: _type, from: _from };
      // ??????, ???????????????????????????????????????
      setType(type);
      // ??????????????????????????????
      setEditCurrent(currentClickCard);
      console.log('?????? : ', currentClickCard);
      // ???????????????????????????
      if (type === 0) {
        form.setFieldsValue({ content: value });
      }
      // ???????????????????????????????????????????????????????????????(????????????, ????????????, ????????????)
      if (type === 1) {
        // ???id??????list???????????????
        const fetchCurrent = contentData.filter((item: any) => item.id === id)[0];
        console.log('fetchCurrent: ', fetchCurrent);
        if (fetchCurrent.dataSource === 'endorseApplyOrder') {
          setIsOrigin(false);
        } else {
          setIsOrigin(true);
        }
        const whichOrigin = (o: number, ds: string) => {
          if (o === 0 && ds === 'policy') {
            return '?????????';
          }
          if (o === 1 && ds === 'policy') {
            return '?????????';
          }
          return '??????';
        };
        // form.resetFields();
        form.setFieldsValue({
          dataSource:
            originCurrent.dataSource ||
            whichOrigin(fetchCurrent.oldNewFlag, fetchCurrent.dataSource),
          type: originCurrent.elementCode || fetchCurrent.elementName.split('.')[0],
          name: originCurrent.elementName || fetchCurrent.elementName,
          new: originCurrent.elementCode || fetchCurrent.elementName,
          format: originCurrent.showFormat || fetchCurrent.showFormat,
        });
      }
      // ?????????????????? ????????????????????????
      if (type === 2 && Object.prototype.toString.call(value) === '[object Array]') {
        console.log('????????????: ', value);
        console.log('????????????: ', contentData);
        setCombList(value);
        // ???????????????????????????????????????
        setCombCurrentStatus(1);
      }
      // ????????????????????????????????????,??????+???Icon,???????????????+Icon
      contentData.forEach((item: any) => {
        const obj = item;
        if (item.id === currentClickCard.id) {
          obj.form = 'drag';
        } else {
          obj.form = 'textArea';
        }
      });
      const result = [...contentData];
      setContentData(result);
    };

    // eslint-disable-next-line no-nested-ternary
    // const btnType = (t: number) => (t === 0 ? '#108ee9' : t === 1 ? '' : '');
    // eslint-disable-next-line no-nested-ternary
    const btnTypefa = (tf: number) => (tf === 0 ? 'text' : tf === 1 ? 'var' : 'comb');
    const icon = from === 'drag' ? <PlusOutlined /> : null;

    const renderButtonContent = () => {
      if (type === 2 && typeof text !== 'string') {
        return (
          <Button
            className={btnTypefa(type)}
            icon={icon}
            ref={elementRef}
            style={{ height: 'auto', margin: 2, opacity, display: 'flex', alignItems: 'center' }}
          >
            <span
              style={{ display: 'flex', flexWrap: 'wrap' }}
              onClick={() => editCurrentEvent(id, text, type, 'drag')}
            >
              {text.map(
                (item: {
                  id: string | number | null | undefined;
                  type: number;
                  value: React.ReactNode;
                }) => {
                  return (
                    <Tag key={item.id} style={{ marginRight: 5 }} className={btnTypefa(item.type)}>
                      {item.value}
                    </Tag>
                  );
                },
              )}
            </span>
            {auth === 'write' ? <CloseOutlined onClick={() => deleteItem(id)} /> : ''}
          </Button>
        );
      }
      return (
        <Button
          className={btnTypefa(type)}
          icon={icon}
          ref={elementRef}
          style={{ margin: 2, opacity }}
        >
          <span onClick={() => editCurrentEvent(id, text, type, 'drag')}>{text}</span>
          {auth === 'write' ? <CloseOutlined onClick={() => deleteItem(id)} /> : ''}
        </Button>
      );
    };

    return renderButtonContent();
  },
);

export default DropTarget(
  ItemTypes.CARD,
  {
    // eslint-disable-next-line consistent-return
    hover(props: CardProps, monitor: DropTargetMonitor, component: CardInstance) {
      if (component.getAuth() === 'read') {
        return;
      }
      if (!component) {
        return;
      }
      const node = component.getNode();
      if (!node) {
        return;
      }
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = node.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      props.moveCard(dragIndex, hoverIndex);
      // eslint-disable-next-line no-param-reassign
      monitor.getItem().index = hoverIndex;
    },
  },
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    ItemTypes.CARD,
    {
      beginDrag: (props: CardProps) => ({
        id: props.id,
        index: props.index,
      }),
      endDrag: (props, monitor, component) => {
        // eslint-disable-next-line no-console
        console.log('????????????store????????????: ', component.getContentData());
      },
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(Card),
);
