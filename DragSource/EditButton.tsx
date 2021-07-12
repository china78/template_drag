/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { Button } from 'antd';
import type { DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';
import { v4 as uuidv4 } from 'uuid';
import './style.less';

type CardProps = {
  name: string;
  type: any;
  editAreaKey: number;
  connectDragSource: any;
  isDragging: any;
  contentData: any;
  setContentData: any;
  setType: any;
  setEditCurrent: any;
  form: any;
  setCombList: any;
  setCombCurrentStatus: any;
};
type ImperativeProps = {
  getContentData: any;
  getParams: any;
};

const EditButton = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      name,
      type = undefined,
      editAreaKey,
      connectDragSource,
      isDragging,
      contentData,
      setContentData,
      setType,
      setEditCurrent,
      form,
      setCombList,
      setCombCurrentStatus,
    },
    ref,
  ) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);

    const actionCombine = (key: any) => {
      setType(key);
    };

    useImperativeHandle<any, ImperativeProps>(ref, () => ({
      getContentData: () => contentData,
      getParams: () => ({
        editAreaKey,
        setContentData,
        actionCombine,
        setEditCurrent,
        form,
        setCombList,
        setCombCurrentStatus,
      }),
    }));

    const opacity = isDragging ? 0.4 : 1;
    // eslint-disable-next-line no-nested-ternary
    const btnTypefa = (tf: string) => (tf === 'primary' ? 'text' : tf === 'dashed' ? 'var' : 'comb');
    return (
      <Button style={{ marginLeft: 10, opacity }} ref={elementRef} className={btnTypefa(type)}>
        {name}
      </Button>
    );
  },
);

export default DragSource(
  ItemTypes.BOX,
  {
    beginDrag: (props: any) => {
      return { name: props.name };
    },
    endDrag(props, monitor, component) {
      const dropResult = monitor.getDropResult();
      const contentData = component.getContentData();
      const {
        editAreaKey,
        setContentData,
        actionCombine,
        setEditCurrent,
        form,
        setCombList,
        setCombCurrentStatus,
      } = component.getParams();

      if (dropResult) {
        // 当拖进来【变量模式下】把所有下拉的值全清空(数据来源, 要素大类, 要素名称)
        form.resetFields();
        // ----
        const currentClickCard = {
          id: uuidv4(),
          value: props.name,
          type: editAreaKey,
          form: 'drag',
        };
        const combine = contentData.concat(currentClickCard);

        setContentData(combine);
        // 设置当前选中, 最后拖进去的按钮，可在右边面板直接编辑，不用特意点击
        setEditCurrent(currentClickCard);
        // 切换右边编辑面板
        actionCombine(editAreaKey);
        // 如果是组合模式把右边数据清空(combList) 并设置组合当前模式为新增
        if (editAreaKey === 2) {
          setCombList([{ id: uuidv4(), type: null, value: '', form: 'textArea' }]);
          setCombCurrentStatus(0);
        }
      }
    },
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  },
)(EditButton);
