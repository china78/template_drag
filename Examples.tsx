/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import React from 'react';
import './style.less';
import Drag from '../Drag';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

const realData = [
  {
    getType: '文本',
    content: '文本内容',
  },
  {
    getType: '变量',
    elementCode: '要素Code',
    parentElementCode: '父级要素Code',
    specId: '技术组件唯一ID',
    path: '要素定位路径',
    pathDesc: '要素定位路径描述',
    dataSource: '数据来源 0保单 1批单',
    oldNewFlag: '数据来源类型 0原保批单 1新保批单',
    showFormat: '显示格式',
  },
  {
    getType: '组合',
    combinationContent: [
      {
        getType: '文本',
        content: '组合内容1--文本',
      },
      {
        getType: '变量',
        elementCode: '组合内容2--变量',
        parentElementCode: '父级要素Code',
        specId: '技术组件唯一ID',
        path: '要素定位路径',
        pathDesc: '要素定位路径描述',
        dataSource: '数据来源 0保单 1批单',
        oldNewFlag: '数据来源类型 0原保批单 1新保批单',
        showFormat: '显示格式',
      },
      {
        getType: '文本',
        content: '组合内容3--文本',
      },
      {
        getType: '变量',
        elementCode: '组合内容4--变量',
        parentElementCode: '父级要素Code',
        specId: '技术组件唯一ID',
        path: '要素定位路径',
        pathDesc: '要素定位路径描述',
        dataSource: '数据来源 0保单 1批单',
        oldNewFlag: '数据来源类型 0原保批单 1新保批单',
        showFormat: '显示格式',
      },
    ],
  },
];
const Examples = () => {
  // 所有数据集合 from属性: textArea / drag
  const [contentData] = useState([
    { id: uuidv4(), value: '初始文本', type: 0, form: 'textArea' },
    // { id, value: '初始变量', type: 1, form: 'textArea' },
    {
      id: uuidv4(),
      value: [
        { id: uuidv4(), value: '组合值 1', type: 0, form: 'textArea' },
        { id: uuidv4(), value: '组合值 2', type: 1, form: 'textArea' },
      ],
      type: 2,
      form: 'textArea',
    },
  ]);
  const [real] = useState(realData);
  const save1 = (values) => {
    console.log('保存数据1:', values);
  };
  const save2 = (values) => {
    console.log('保存数据:2', values);
  };
  const save3 = (values) => {
    console.log('保存数据3:', values);
  };

  return (
    <div className="dragTestContainer">
      <Drag save={save1} data={real} jurisdiction="read" status="批文展示区" />
      <br />
      <Drag save={save2} jurisdiction="write" status="新增时" />
      <br />
      <Drag save={save3} jurisdiction="read" status="批文展示区" />
      <br />
    </div>
  );
};

export default Examples;
