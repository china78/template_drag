/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import React, { useEffect, memo } from 'react';
import { useState } from 'react';
import { Form, message } from 'antd';
import { DndProvider } from 'react-dnd';
import { Button } from 'antd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragSource from './DragSource';
import DropTarget from './DropTarget';
import EditArea from './EditArea';
import Text from './EditArea/Comp/Text';
import Var from './EditArea/Comp/Var';
import Comb from './EditArea/Comp/Comb';
import EditButton from './DragSource/EditButton';
import { v4 as uuidv4 } from 'uuid';
import './style.less';

const whichType = (params: string) => {
  let type;
  switch (params) {
    case 'text':
      type = 0;
      break;
    case 'keyElement':
      type = 1;
      break;
    case 'combinationElement':
      type = 2;
      break;
    default:
  }
  return type;
};
const defaultData: any = [
  // { id: uuidv4(), value: '初始文本', type: 0, form: 'textArea' }
];
// 进来数据净化 外部传入的数据最终以 defaultData的格式传入进去
const intoFn = (data: any) => {
  if (data.length > 0) {
    // eslint-disable-next-line consistent-return
    data.forEach((item: any) => {
      const aitem = item;
      // 判断是否是组合
      const assCommon = () => {
        aitem.id = uuidv4();
        aitem.type = whichType(item.getType);
        aitem.form = 'textArea';
      };
      // debugger;
      if (item.hasOwnProperty('combinationContent')) {
        assCommon();
        intoFn(aitem.combinationContent);
        aitem.value = aitem.combinationContent;
      } else {
        // 判断是否是文本 和 变量 都要设置4个属性
        // eslint-disable-next-line no-lonely-if
        if (item.getType === 'text') {
          assCommon();
          aitem.value = item.content;
        } else if (item.getType === 'keyElement') {
          assCommon();
          aitem.value = item.pathDesc;
        } else {
          return null;
        }
      }
    });
    const newList = JSON.parse(JSON.stringify(data));
    return newList;
  }
  return defaultData;
};
// 出去数据净化
const outFn = (data: any) => {
  const outData: any = [];
  data.forEach((item: any) => {
    if (item.type === 0) {
      outData.push({
        getType: 'text',
        content: item.value,
      });
    } else if (item.type === 1) {
      outData.push({
        getType: 'keyElement',
        elementName: item.elementName,
        elementCode: item.elementCode, // 要素名称
        parentElementCode: item.parentElementCode, // 要素大类
        specId: item.specId,
        comPath: item.path || item.comPath,
        // comPath: item.comPath,
        pathDesc: item.pathDesc,
        dataSource: item.dataSource,
        oldNewFlag: item.oldNewFlag,
        showFormat: item.showFormat,
      });
    } else if (item.type === 2) {
      outData.push({
        getType: 'combinationElement',
        combinationContent: outFn(item.value),
      });
    }
  });
  return JSON.parse(JSON.stringify(outData));
};
const { log } = console;
type Params = {
  save?: any;
  toCopy?: any;
  toReceive?: any;
  jurisdiction?: string;
  data?: any[];
  status?: any;
};
const Drag = (params: Params) => {
  const {
    save = log,
    toCopy = log,
    toReceive = log,
    jurisdiction = 'write',
    data = defaultData,
    status = '新增时',
  } = params;
  /** ---------------- 自 己 的 状 态 机 制 ------------------- */
  // 编辑态的form对象
  const [form] = Form.useForm();
  // 读状态还是写状态
  const [auth, setAuth] = useState<string>(jurisdiction);
  // 头部左边的状态 新增时 编辑时
  const [s] = useState<string>(status);
  // 0-固定文本  1-变量  2-组合
  const [type, setType] = useState<number>(0);
  // 新push的标签的当前最新id
  const [id, setId] = useState<string>(uuidv4());
  // 这里要存一个点击当前编辑的值
  const [editCurrent, setEditCurrent] = useState<any>({
    id: null,
    value: '请输入文本!',
    type: 0,
    form: 'textArea',
    specId: '',
    oldNewFlag: '',
    elementCode: '',
    parentElementCode: '',
    elementName: '',
    path: '',
  });
  // 所有数据集合 from属性: textArea / drag
  const [contentData, setContentData] = useState<any[]>(data);
  // 组合模式下的状态list
  const [combList, setCombList] = useState<any[]>([
    // { id: uuidv4(), type: null, value: '', form: 'textArea' },
    // { id: 1, type: 1, value: '变量选择值' },
  ]);
  // 当前为组合模式的新增状态还是编辑状态 0-新增 1-编辑
  const [combCurrentStatus, setCombCurrentStatus] = useState<number>(0);
  // 元数据-当前-没有被格式化过得
  const [originCurrent, setOriginCurrent] = useState<any>([]);
  // 当前为原保批单展示
  const [isOrigin, setIsOrigin] = useState<boolean>(true);

  /** ---------------- 自 己 的 状 态 机 制 ------------------- */

  /** 完成方法 */
  // 点保存去掉+号Icon，没有什么实质意义
  const onFinish = (st: any, sn: any, sf: any, objs: any) => {
    // 如果是变量模式下，清空要素大类和要素名称
    if (type === 1) {
      const { o, t, n, g } = objs;
      //  拼凑起选中选中变量的对象
      const varObj = { dataSource: o, elementCode: t, elementName: n, showFormat: g };
      // console.log('varObj: ', varObj)
      setOriginCurrent(varObj);
      // 清空要素大类
      st([]);
      // 清空要素名称
      sn([]);
      // 清空显示格式
      sf([]);
    }
    // 变量模式下, 默认当前value 是 ‘变量’， 不选择 要素名称是不让保存的
    if (editCurrent.value === '变量') {
      message.warning('请选择要素名称');
      return;
    }
    // 如果为空就不能保存成功
    if (contentData.length === 0) {
      message.warning('当前为空');
      return;
    }
    contentData.forEach((item: any) => {
      const obj = item;
      obj.form = 'textArea';
    });
    const result = [...contentData];
    setContentData(result);
    save(outFn(contentData));
    message.success('保存成功');
    // eslint-disable-next-line no-console
    // console.log('导出数据: ', contentData);
    console.log('导出数据: ', outFn(contentData));
  };
  // 清空当前展示区所有数据
  const clearSelfAllData = () => {
    setContentData([]);
  };
  // 左上角的三个编辑按钮
  const editButtonGroup = (tp: string) => {
    switch (tp) {
      case 'copy':
        toCopy(outFn(contentData));
        break;
      case 'receive':
        toReceive();
        break;
      case 'delete':
        clearSelfAllData();
        break;
      default:
    }
  };

  // 传入EditButton的参数
  const EProps = {
    contentData,
    setContentData,
    setType,
    setEditCurrent,
    form,
    setCombList,
    setCombCurrentStatus,
  };
  // 传入DropTarget的参数
  const DProps = {
    contentData,
    setContentData,
    setEditCurrent,
    form,
    setType,
    setCombList,
    setCombCurrentStatus,
    auth,
    originCurrent,
    setIsOrigin,
  };
  // 传入EditArea的参数
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const AProps = {
    contentData,
    setContentData,
    editCurrent,
    setEditCurrent,
    form,
    save,
    setType,
    id,
    setId,
    combList,
    setCombList,
    combCurrentStatus,
    auth,
    outFn,
    onFinish,
    isOrigin,
    setIsOrigin,
  };

  const renderTypeMal = (index: number, props: any) => {
    switch (index) {
      case 0:
        return <Text {...props} />;
      case 1:
        return <Var {...props} />;
      case 2:
        return <Comb {...props} />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    setContentData(contentData);
  }, [contentData]);

  useEffect(() => {
    setAuth(jurisdiction);
  }, [jurisdiction]);

  useEffect(() => {
    setContentData(intoFn(data));
  }, [data]);

  useEffect(() => {
    renderTypeMal(type, AProps);
  }, [type, AProps]);

  // eslint-disable-next-line consistent-return
  const renderEditArea = (a: string) => {
    if (a === 'write') {
      return <EditArea renderContent={renderTypeMal(type, AProps)} />;
    }
    return null;
  };
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <DragSource
          auth={auth}
          status={s}
          edits={[
            <EditButton {...EProps} name="固定文本" type="primary" editAreaKey={0} key={0} />,
            <EditButton {...EProps} name="变量" type="dashed" editAreaKey={1} key={1} />,
            <EditButton {...EProps} name="组合" type="default" editAreaKey={2} key={2} />,
            <Button
              className="ml24"
              type="link"
              onClick={() => editButtonGroup('copy')}
              size="small"
              key={3}
            >
              复制
            </Button>,
            <Button key={4} type="link" onClick={() => editButtonGroup('receive')} size="small">
              接收
            </Button>,
            <Button key={5} type="link" onClick={() => editButtonGroup('delete')} size="small">
              清空
            </Button>,
          ]}
        />
        <div className="contentBox">
          <DropTarget cardProps={DProps} data={contentData} setData={setContentData} />
          {renderEditArea(auth)}
        </div>
      </DndProvider>
    </div>
  );
};

export default memo(Drag);
