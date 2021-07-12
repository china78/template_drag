/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import type { FC } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import React from 'react';
import { Form, Button, Select, TreeSelect } from 'antd';
// import { queryElementType, queryElementName, originData, showFormat } from '../../service';
import * as API from '@/services/api/Drag';
import { v4 as uuidv4 } from 'uuid';
import type { ShowFormatOut } from '../../data';
import './style.less';

const { Option } = Select;
const { TreeNode } = TreeSelect;

type Props = {
  contentData: any;
  setContentData: any;
  editCurrent: any;
  setEditCurrent: any;
  form: any;
  onFinish: any;
  isOrigin: any;
  setIsOrigin: any;
};

const Var: FC<Props> = ({
  contentData,
  setContentData,
  editCurrent,
  setEditCurrent,
  form,
  onFinish,
  isOrigin,
  setIsOrigin,
}) => {
  // 要素大类list
  const [elementType, setElementType] = useState<any[]>([
    // { specId: 'R0002', name: '投保单扩展信息' },
  ]);
  // 要素名称list
  const [elementName, setElementName] = useState<any[]>([
    // { name: '主键', uuid: 'R0002-P0054' },
  ]);
  // 当前为原保批单展示
  // const [isOrigin, setIsOrigin] = useState<boolean>(true);
  // 最新保批单数据
  const [newData, setNewData] = useState<any[]>([]);
  // 最新保批单选中的对象
  const [newValue, setNewValue] = useState({});
  // 显示格式
  const [formatData, setFormatData] = useState<ShowFormatOut[]>([]);

  // 数据来源的值
  const [o, so] = useState('');
  // 要素大类的值
  const [t, st] = useState('');
  // 要素名称的值
  const [n, sn] = useState('');
  // 显示格式的值
  const [g] = useState('');

  // 设置最新保批单当前值
  const setNewCurrentValueToView = (data: any) => {
    const concatCurrent = {
      ...editCurrent,
      value: data.elemName,
      elementCode: data.elemCd,
      elementName: data.elemName,
      path: data.elemPath,
      pathDesc: data.elemPathName,
      parentElementCode: data.parElemCd,
    };
    setEditCurrent(concatCurrent);

    if (concatCurrent.id !== null) {
      contentData.forEach((i: any) => {
        // { id: null, value: '请输入', type: 0, form: 'textArea' }
        // debugger;
        const obj = i;
        if (concatCurrent.id === obj.id) {
          obj.value = concatCurrent.value;
          obj.elementCode = concatCurrent.elementCode;
          obj.elementName = concatCurrent.elementName;
          obj.path = concatCurrent.path;
          obj.pathDesc = concatCurrent.elementName;
          obj.parentElementCode = concatCurrent.parentElementCode;
          obj.form = 'drag';
        }
      });
      const resultData = [...contentData];
      setContentData(resultData);
    }
  };
  const featchShowFormat = async (params: any) => {
    const res: any = await API.showFormat(params);
    const { data } = res;
    // 存下显示格式
    setFormatData(data);
  };

  // 最新保批单集联选中事件
  const onNewChange = (value: any) => {
    // 深层递归
    const recursion = (data: any, path: any) => {
      if (data.length > 0) {
        return data.map((item: any) => {
          if (item.elemPath === path) {
            const params = { dataType: item.dataType, elemCd: item.elemCd };
            featchShowFormat(params);
            setNewValue(item);
            return setNewCurrentValueToView(item);
          }
          if (item?.endorseApplyFactorList && item?.endorseApplyFactorList.length > 0) {
            return recursion(item.endorseApplyFactorList, value);
          }
          return null;
        });
      }
      return null;
    };
    recursion(newData, value);
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  // 获取要素大类数据并保存
  const fetchElementType = () => {
    API.queryElementType().then((res) => {
      setElementType(res.data);
    });
  };

  // 获取要素名称数据并保存
  const fetchElementName = (params: any) => {
    API.queryElementName(params).then((res) => {
      // console.log('elementType: ', res);
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
    setEditCurrent(concatCurrent);
    if (concatCurrent.id !== null) {
      contentData.forEach((ele: any) => {
        // { id: null, value: '请输入', type: 0, form: 'textArea' }
        const obj = ele;
        if (concatCurrent.id === ele.id) {
          obj.dataSource = concatCurrent.dataSource;
          obj.oldNewFlag = concatCurrent.oldNewFlag;
        }
      });
      const resultData = [...contentData];
      setContentData(resultData);
    }
  };
  // 数据来源事件
  const onDataSourceChange = (value: string) => {
    switch (value) {
      case 'old':
        setIsOrigin(true);
        fetchElementType();
        setOldOrNeworPiParams('old');
        so('原保单');
        // form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'new':
        setIsOrigin(true);
        fetchElementType();
        setOldOrNeworPiParams('new');
        so('新保单');
        break;
      case 'pi':
        form.setFieldsValue({ format: '' });
        newAction();
        setOldOrNeworPiParams('pi');
        so('批单');
        break;
      default:
    }
  };
  // 要素大类事件
  const onElementTypeChange = (value: string) => {
    if (value) {
      fetchElementName(value);
      // 把要素大类的list拉出来遍历取parentElementCode
      const item = elementType.filter((i) => i.specId === value);
      const { code, name } = item[0];
      st(name);
      // 要素大类的code要设置到当前的 parentElementCode
      const concatCurrent = { ...editCurrent, parentElementCode: code, path: code };
      setEditCurrent(concatCurrent);

      if (concatCurrent.id !== null) {
        contentData.forEach((ele: any) => {
          // { id: null, value: '请输入', type: 0, form: 'textArea' }
          const obj = ele;
          if (concatCurrent.id === ele.id) {
            obj.parentElementCode = concatCurrent.parentElementCode;
          }
        });
        const resultData = [...contentData];
        setContentData(resultData);
      }
    }
  };

  // 要素名称事件
  const onElementNameChange = (value: string) => {
    if (value) {
      sn(value);
      // 此时的value是name
      // 在这里把【要素名称】同步到 左边展示数据的当前数据
      // 把这个值关联回点击当前
      // 把要素名称list拉出来遍历赋值
      const item = elementName.filter((i) => i.name === value);
      // 拿着当前的item的code 和 dataType去请求显示格式接口
      const params = { dataType: item[0].dataType, elemCd: item[0].code };
      featchShowFormat(params);
      const { code, roleSpecId, comPath } = item[0];
      // const { path } = editCurrent;
      /*------------------------------------------------------------------------------*/
      const concatCurrent = {
        ...editCurrent,
        value,
        elementName: value,
        elementCode: code,
        // specId: propertySpecId,
        specId: roleSpecId,
        path: comPath,
      };
      // debugger;
      setEditCurrent(concatCurrent);
      /*------------------------------------------------------------------------------*/

      // 然后把当前这个值再修改回数组里对应的那个对象
      // 如果当前有标签被选中
      if (concatCurrent.id !== null) {
        contentData.forEach((i: any) => {
          // { id: null, value: '请输入', type: 0, form: 'textArea' }
          // debugger;
          const obj = i;
          if (concatCurrent.id === obj.id) {
            obj.value = concatCurrent.value;
            obj.elementName = concatCurrent.elementName;
            obj.pathDesc = concatCurrent.elementName;
            obj.elementCode = concatCurrent.elementCode;
            obj.specId = concatCurrent.specId;
            obj.path = concatCurrent.path;
            obj.form = 'drag';
          }
        });
        const resultData = [...contentData];
        setContentData(resultData);
      }
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
      return data.map((item: any) => {
        return (
          <TreeNode
            selectable={item.endorseApplyFactorList.length === 0}
            key={item.elemPath}
            value={item.elemPath}
            title={item.elemName}
          >
            {renderChildren(item)}
          </TreeNode>
        );
      });
    }
    return null;
  };
  const renderTreeNode = useCallback((data) => renderTree(data), [newData]);
  // 显示格式方法
  const onShowFormatChange = (value: any) => {
    // YYYY-MM-DD 把当前这个值设置到当前卡片的 showFormat 上
    const concatCurrent = {
      ...editCurrent,
      showFormat: value,
    };
    // sg(rmk)
    setEditCurrent(concatCurrent);
    if (concatCurrent.id !== null) {
      contentData.forEach((i: any) => {
        const obj = i;
        if (concatCurrent.id === obj.id) {
          obj.showFormat = concatCurrent.showFormat;
        }
      });
      const resultData = [...contentData];
      setContentData(resultData);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>变量模式</div>
      <Form
        id={uuidv4()}
        form={form}
        name="basic"
        // initialValues={{ dataSource: '' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item className="itemStyle" name="dataSource" label="数据来源">
          <Select placeholder="请选择数据来源" onChange={onDataSourceChange} allowClear>
            <Option value="old">原保单</Option>
            <Option value="new">新保单</Option>
            <Option value="pi">批单</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="itemStyle"
          name="type"
          label="要素大类"
          style={{ display: isOrigin ? 'flex' : 'none' }}
        >
          <Select placeholder="请选择要素大类" onChange={onElementTypeChange} allowClear>
            {elementType.map((item) => {
              return (
                <Option key={item.specId} value={item.specId}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          className="itemStyle"
          name="name"
          label="要素名称"
          style={{ display: isOrigin ? 'flex' : 'none' }}
        >
          <Select placeholder="请选择要素名称" onChange={onElementNameChange} allowClear>
            {elementName.map((item, index) => {
              return (
                <Option key={index} value={item.name}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        {/* 最新保批单下的级联 */}
        <Form.Item className="itemStyle" name="new" style={{ display: isOrigin ? 'none' : 'flex' }}>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={newValue}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            allowClear
            treeDefaultExpandAll
            onChange={onNewChange}
          >
            {renderTreeNode(newData)}
          </TreeSelect>
        </Form.Item>
        {/* 显示格式 */}
        <Form.Item className="itemStyle" name="format" label="显示格式">
          <Select placeholder="请选择显示格式" onChange={onShowFormatChange} allowClear>
            {formatData.map((item: any, index: any) => {
              return (
                <Option key={index} value={item.displayFormat}>
                  {item.rmk}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            className="varbtn"
            type="primary"
            onClick={() => onFinish(setElementName, setElementType, setFormatData, { o, t, n, g })}
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Var;
