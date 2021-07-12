/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import type { FC } from 'react';
import React from 'react';
import { Button, Select, message } from 'antd';
import CombC from './CombC';
import '../style.less';
import { v4 as uuidv4 } from 'uuid';
import update from 'immutability-helper';

type Props = {
  contentData: any;
  setContentData: any;
  editCurrent: any;
  setEditCurrent: any;
  form: any;
  save: any;
  id: any;
  setId: any;
  setType: any;
  combList: any;
  setCombList: any;
  combCurrentStatus: any;
  outFn: any;
};

const Comb: FC<Props> = ({
  contentData,
  setContentData,
  editCurrent,
  setEditCurrent,
  form,
  id,
  setType,
  combList,
  setCombList,
  combCurrentStatus,
  save,
  outFn,
}) => {
  const del = (itemId: any) => {
    if (combList.length === 1) {
      return;
    }
    const filtedData = combList.filter((item: any) => item.id !== itemId);
    setCombList(filtedData);
  };
  const up = (index: number, item: any) => {
    if (index !== 0) {
      setCombList(
        update(combList, {
          $splice: [
            [index, 1],
            [index - 1, 0, item],
          ],
        }),
      );
    }
  };
  const down = (index: number, item: any) => {
    if (index + 1 !== combList.length) {
      setCombList(
        update(combList, {
          $splice: [
            [index, 1],
            [index + 1, 0, item],
          ],
        }),
      );
    }
  };
  // 添加一项
  const add = () => {
    const item = { id: uuidv4(), type: null, value: '', form: 'textArea' };
    const newList = combList.concat(item);
    setCombList(newList);
  };

  const handleChange = () => {};

  const combSave = () => {
    // 把combList赋值给contentData的最后一项的value:combList
    // 如果为空就不能保存成功
    if (combList[0].value === '') {
      message.warning('当前为空');
      return;
    }
    if (contentData.length === 0) {
      message.warning('当前为空');
      return;
    }
    // 分辨出是新增还是编辑, 新增直接走这条，编辑根据点击【当前对象】id替换值
    // 看看有么有当前对象，有的话，代表是编辑状态，没有的话，是新增状态
    // 如果editCurrent的type=2 && value=[] 那么就是编辑，如果type=2 && value=‘组合’那就是新增
    // console.log('当前对象: ', editCurrent)
    // console.log('整体数据: ', contentData);
    // console.log('当前组合: ', combList)
    if (editCurrent.type === 2 && editCurrent.value === '组合') {
      // console.log('新增')
      const newData = update(contentData[contentData.length - 1], { value: { $set: combList } });
      contentData.pop();
      const result = contentData.concat(newData);
      result.forEach((item: any) => {
        const obj = item;
        obj.form = 'textArea';
      });

      // console.log('全部数据: ', result)
      setContentData(result);
      // const resultCut = JSON.parse(JSON.stringify(result));
      save(outFn(result));
      // console.log('导出数据: ', outFn(result));

      message.success('保存成功');
    } else if (editCurrent.type === 2 && Array.isArray(editCurrent.value)) {
      // console.log('编辑')
      contentData.forEach((item: any) => {
        const aitem = item;
        if (item.id === editCurrent.id) {
          aitem.value = combList;
        }
      });
      const result = contentData;
      setContentData(result);
      save(outFn(result));
      // console.log('导出数据: ', outFn(result));
    } else {
      return;
    }
    // // 清空combList数组
    const initCombList = [{ id: uuidv4(), type: 'text', value: '', form: 'textArea' }];
    setCombList(initCombList);
    // 跳走, 跳到固定文本编辑模块下
    setType(0);
    // 设置文本框值为普通文本
    form.setFieldsValue({
      content: '请输入文本!',
    });
  };
  const typesOption = [{ label: '循环依据', value: 'loop' }];
  const CombCProps = {
    add,
    combList,
    setCombList,
    id,
    del,
    up,
    down,
    combCurrentStatus,
    editCurrent,
    setEditCurrent,
    contentData,
    setContentData,
  };
  return (
    <div>
      <div style={{ marginBottom: 10 }}>组合定义</div>
      <div className="elementTypeBox">
        <div className="texts">要素大类: </div>
        <Select className="select" value="loop" options={typesOption} onChange={handleChange} />
      </div>

      {/* 这里开始循环部分 */}
      {combList.map((item: any, location: any) => {
        return <CombC location={location} key={item.id} item={item} {...CombCProps} />;
      })}
      {/* 这里结束循环部分 */}
      <Button type="primary" onClick={combSave} style={{ marginRight: 10 }}>
        保存
      </Button>
    </div>
  );
};

export default Comb;
