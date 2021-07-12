/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Button, Select, Input, TreeSelect } from 'antd';
// import * as services from '../../service';
import * as API from '@/services/api/Drag';
import '../style.less';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;
const { TreeNode } = TreeSelect;
type Params = {
  location: any;
  item: any;
  add: any;
  setCombList: any;
  del: any;
  up: any;
  down: any;
  combCurrentStatus: any;
  setEditCurrent: any;
  combList: any;
  editCurrent: any;
  contentData: any;
  setContentData: any;
};

const CombC = (params: Params) => {
  const {
    location,
    item,
    add,
    setCombList,
    del,
    up,
    down,
    combCurrentStatus,
    setEditCurrent,
    combList,
    editCurrent,
    contentData,
    setContentData,
  } = params;
  // 要素大类list
  const [elementType, setElementType] = useState([{ specId: 'R0002', name: '投保单扩展信息' }]);
  // 要素名称list
  const [elementName, setElementName] = useState([
    { name: '要素选项-01', uuid: 'R0002-P0054' },
    { name: '要素选项-02', uuid: 'R0002-P0055' },
    { name: '要素选项-03', uuid: 'R0002-P0056' },
  ]);
  // 当前类型
  const [currentEditType, setCurrentEditType] = useState(item.type);
  // 文本框的值
  const [textAreaValue, setTextAreaValue] = useState(item.value);
  // 选中大类要素的code
  // const [tcode, setTcode] = useState('');
  // 当前为原保批单展示
  const [isOrigin, setIsOrigin] = useState(true);
  // 最新保批单数据
  const [newData, setNewData] = useState([]);
  // 最新保批单选中的对象
  // const [newValue, setNewValue] = useState({});
  // 显示格式
  const [formatData, setFormatData] = useState([]);

  useEffect(() => {
    setTextAreaValue(item.value);
  }, [item.value]);

  useEffect(() => {
    setCurrentEditType(item.type);
  }, [item.type]);

  useEffect(() => {
    if (item.dataSource === 'endorseApplyOrder') {
      setIsOrigin(false);
    } else {
      setIsOrigin(true);
    }
  }, [item.dataSource]);

  // 操作类型下拉事件
  const editTypeChange = (value: any) => {
    setCurrentEditType(value);
    // 设置当前对象的type属性值
    combList.forEach((ele: any) => {
      const obj = ele;
      if (obj.id === item.id) {
        obj.type = value;
      }
    });
    setCombList(combList);
  };
  // 一个联动修改方法
  const textAreaAndSelectDisPatchData = () => {
    // debugger;
    // 只有在组合模式的编辑状态下执行以下数据联动的代码
    if (combCurrentStatus === 1) {
      // 把当前展示combList -- 存到当编辑对象editCurrent的value上 -- 在设置回contentData
      // 把当前combList设置成editCurrent的value属性
      const replaceCurrent = { ...editCurrent, value: combList };
      setEditCurrent(replaceCurrent);
      // 便利整体数组, 找到当前编辑对象，替换掉
      contentData.forEach((c: any) => {
        const t = c;
        if (t.id === editCurrent.id) {
          t.value = editCurrent.value;
        }
      });
      const replaceContent = contentData;
      setContentData(replaceContent);
    }
  };
  // 文本框事件
  const textAreaChange = (value: any) => {
    setTextAreaValue(value.target.value);
    combList.forEach((ele: any) => {
      const obj = ele;
      if (obj.id === item.id) {
        obj.value = value.target.value;
      }
    });
    setCombList(combList);
    // 调用联动方法
    textAreaAndSelectDisPatchData();
  };
  // 获取要素大类数据并保存
  const fetchElementType = () => {
    API.queryElementType().then((res) => {
      setElementType(res.data);
    });
  };
  // 获取要素名称数据并保存
  const fetchElementName = (p: any) => {
    API.queryElementName(p).then((res) => {
      setElementName(res.data);
    });
  };
  // 最新保批单的action
  const newAction = async () => {
    setIsOrigin(false);
    // 请求集联接口
    const res = await API.originData();
    const { data } = res;
    setNewData(data);
  };
  const setOldOrNeworPiParams = (type: any) => {
    let concatCurrent: any;
    if (type === 'old') {
      concatCurrent = { ...editCurrent, dataSource: 'policy', oldNewFlag: 0 };
    } else if (type === 'new') {
      concatCurrent = { ...editCurrent, dataSource: 'policy', oldNewFlag: 1 };
    } else if (type === 'pi') {
      concatCurrent = { ...editCurrent, dataSource: 'endorseApplyOrder' };
    }
    combList.forEach((e: any) => {
      const obj = e;
      if (obj.id === item.id) {
        obj.dataSource = concatCurrent.dataSource;
        obj.oldNewFlag = concatCurrent.oldNewFlag;
      }
    });

    setCombList(combList);
    // 调用联动方法
    textAreaAndSelectDisPatchData();
  };
  // 数据来源事件
  const onDataSourceChange = (value: string) => {
    switch (value) {
      case 'old':
        setIsOrigin(true);
        fetchElementType();
        setOldOrNeworPiParams('old');
        // form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'new':
        setIsOrigin(true);
        fetchElementType();
        setOldOrNeworPiParams('new');
        break;
      case 'pi':
        newAction();
        setOldOrNeworPiParams('pi');
        break;
      default:
    }
  };
  const renderTree = (data: any) => {
    const renderChildren = (children: any) => {
      if (children?.endorseApplyFactorList && children?.endorseApplyFactorList.length > 0) {
        return children?.endorseApplyFactorList.map((ele: any) => {
          return (
            <TreeNode
              selectable={ele.endorseApplyFactorList.length === 0}
              key={ele.elemPath}
              value={ele.elemPath}
              title={ele.elemName}
            >
              {renderChildren(ele)}
            </TreeNode>
          );
        });
      }
      return null;
    };

    if (data.length > 0) {
      return data.map((i: any) => {
        return (
          <TreeNode
            selectable={i.endorseApplyFactorList.length === 0}
            key={i.elemPath}
            value={i.elemPath}
            title={i.elemName}
          >
            {renderChildren(i)}
          </TreeNode>
        );
      });
    }
    return null;
  };
  const renderTreeNode = useCallback((data) => renderTree(data), [newData]);
  // 要素大类事件
  const onElementTypeChange = (value: string) => {
    if (value) {
      fetchElementName(value);
      const ele: any = elementType.filter((i) => i.specId === value);
      const { code } = ele[0];
      // setTcode(code);
      combList.forEach((e: any) => {
        const obj = e;
        if (obj.id === item.id) {
          obj.parentElementCode = code;
        }
      });
    }
  };
  const featchShowFormat = async (p: any) => {
    const res = await API.showFormat(p);
    const { data } = res;
    // 存下显示格式
    setFormatData(data);
  };

  // 要素名称事件
  const onElementNameChange = (value: string) => {
    if (value) {
      const ele: any = elementName.filter((i) => i.name === value);
      const { code, roleSpecId, comPath } = ele[0];

      // 拿着当前的item的code 和 dataType去请求显示格式接口
      const p: any = { dataType: ele[0].dataType, elemCd: ele[0].code };
      featchShowFormat(p);

      combList.forEach((e: any) => {
        const obj = e;
        if (obj.id === item.id) {
          obj.value = value;
          obj.elementCode = code;
          // obj.specId = propertySpecId;
          obj.specId = roleSpecId;
          obj.elementName = value;
          obj.pathDesc = value;
          obj.path = comPath;
        }
      });

      setCombList(combList);
      // 调用联动方法
      textAreaAndSelectDisPatchData();
    }
  };
  // 显示格式方法
  const onShowFormatChange = (value: any) => {
    // YYYY-MM-DD 把当前这个值设置到当前卡片的 showFormat 上
    const concatCurrent = {
      showFormat: value,
    };
    combList.forEach((e: any) => {
      const obj = e;
      if (obj.id === item.id) {
        obj.showFormat = concatCurrent.showFormat;
      }
    });

    setCombList(combList);
    // 调用联动方法
    textAreaAndSelectDisPatchData();
  };
  const setNewCurrentValueToView = (i: any) => {
    combList.forEach((e: any) => {
      const obj = e;
      if (obj.id === item.id) {
        obj.value = i.elemName;
        obj.elementCode = i.elemCd;
        obj.elementName = i.elemName;
        obj.path = i.elemPath;
        obj.pathDesc = i.elemPathName;
        obj.parentElementCode = i.parElemCd;
        obj.form = 'drag';
      }
    });

    setCombList(combList);
    // 调用联动方法
    textAreaAndSelectDisPatchData();
  };

  // 最新保批单集联选中事件
  const onNewChange = (value: any) => {
    // 深层递归
    const recursion = (data: any, path: any) => {
      if (data.length > 0) {
        return data.map((i: any) => {
          if (i.elemPath === path) {
            // setNewValue(item);
            const p: any = { dataType: i.dataType, elemCd: i.elemCd };
            featchShowFormat(p);
            return setNewCurrentValueToView(i);
          }
          if (i?.endorseApplyFactorList && i?.endorseApplyFactorList.length > 0) {
            return recursion(i.endorseApplyFactorList, value);
          }
          return null;
        });
      }
      return null;
    };
    // debugger;
    recursion(newData, value);
  };

  // 文本区域
  const textDom = (
    <div className="textAreaBox">
      <div className="textAreaBoxText">显示内容: </div>
      <Input.TextArea
        id={uuidv4()}
        defaultValue={textAreaValue}
        className="textArea"
        onChange={textAreaChange}
        style={{ height: 50 }}
      />
    </div>
  );
  const getDefaultValue = (c: any, i: any) => {
    // combCurrentStatus === 1 ? item.dataSource : null
    if (c === 1) {
      if (i.dataSource === 'policy' && Number(i.oldNewFlag) === 0) {
        return '原保单';
      }
      if (i.dataSource === 'policy' && Number(i.oldNewFlag) === 1) {
        return '新保单';
      }
      return '批单';
    }
    return null;
  };
  // 变量类型
  const varDom = (
    <div className="varArea">
      <div>
        <div className="rows">
          <div className="texts">数据来源: </div>
          <Select
            className="select"
            placeholder="请选择数据来源"
            onChange={onDataSourceChange}
            defaultValue={getDefaultValue(combCurrentStatus, item)}
            allowClear
          >
            <Option value="old">原保单</Option>
            <Option value="new">新保单</Option>
            <Option value="pi">批单</Option>
          </Select>
        </div>
        <div className="rows" style={{ display: isOrigin ? 'block' : 'none' }}>
          <div className="texts">要素名称: </div>
          <Select
            className="select"
            placeholder="请选择要素名称"
            onChange={onElementNameChange}
            defaultValue={combCurrentStatus === 1 ? item.value.split('.')[1] : null}
            allowClear
          >
            {elementName.map((ele, index) => {
              return (
                <Option key={index} value={ele.name}>
                  {ele.name}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
      <div>
        <div className="rows" style={{ display: isOrigin ? 'block' : 'none' }}>
          <div className="texts">要素大类: </div>
          <Select
            className="select"
            placeholder="请选择要素大类"
            onChange={onElementTypeChange}
            defaultValue={combCurrentStatus === 1 ? item.value.split('.')[0] : null}
            allowClear
          >
            {elementType.map((i) => {
              return (
                <Option key={i.specId} value={i.specId}>
                  {i.name}
                </Option>
              );
            })}
          </Select>
        </div>

        <div className="rows" style={{ display: isOrigin ? 'none' : 'block' }}>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            // value={newValue}
            defaultValue={combCurrentStatus === 1 ? item.elementName : null}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            allowClear
            treeDefaultExpandAll
            onChange={onNewChange}
          >
            {renderTreeNode(newData)}
          </TreeSelect>
        </div>
        {/* 显示格式 */}
        <div className="rows">
          <div className="texts">显示格式: </div>
          <Select
            placeholder="请选择显示格式"
            className="select"
            onChange={onShowFormatChange}
            defaultValue={combCurrentStatus === 1 ? item.showFormat : null}
            allowClear
          >
            {formatData.map((i: any, index: number) => {
              return (
                <Option key={index} value={i.displayFormat}>
                  {i.rmk}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
    </div>
  );
  // render文本或者变量dom
  const renderTextOrVarDom = (type: any, textd: any, vard: any) => {
    let dom;
    switch (type) {
      case 0:
        dom = textd;
        break;
      case 1:
        dom = vard;
        break;
      default:
    }
    return dom;
  };
  const renderUpDom = (l: number) => {
    if (l !== 0) {
      return (
        <Button className="btns" type="link" onClick={() => up(location, item)}>
          上移
        </Button>
      );
    }
    return null;
  };
  const renderDownDom = (l: number) => {
    if (l + 1 !== combList.length) {
      return (
        <Button className="btns" type="link" onClick={() => down(location, item)}>
          下移
        </Button>
      );
    }
    return null;
  };
  return (
    <div className="editItemBox">
      <div className="editTypeBox">
        <div>操作类型: </div>
        <div>
          {renderDownDom(location)}
          {renderUpDom(location)}
          <Button className="btns" type="link" onClick={() => add()}>
            新增
          </Button>
          <Button className="btns" type="link" onClick={() => del(item.id)}>
            删除
          </Button>
        </div>
      </div>
      {/* 操作类型选择 */}
      <Select
        className="w100 editType"
        defaultValue={item.type}
        placeholder="请选择操作类型"
        onChange={editTypeChange}
      >
        <Option value={Number(0)}>固定文本</Option>
        <Option value={Number(1)}>变量</Option>
      </Select>
      {/* 这里现实 文本dom 或者 变量dom */}
      {renderTextOrVarDom(currentEditType, textDom, varDom)}
    </div>
  );
};

export default CombC;
