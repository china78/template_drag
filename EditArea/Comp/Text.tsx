/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import type { FC } from 'react';
import React from 'react';
import { Form, Input, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './style.less'

type Props = {
  contentData: any;
  setContentData: any;
  editCurrent: any;
  setEditCurrent: any;
  form: any;
  onFinish: any;
};

const Text: FC<Props> = ({
  contentData,
  setContentData,
  editCurrent,
  setEditCurrent,
  form,
  onFinish,
}) => {
  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const textAreaChange = (e: any) => {
    // console.log('当前选中: ', editCurrent);
    // 把这个值关联回点击当前
    /*------------------------------------------------------------------------------*/
    const concatCurrent = { ...editCurrent, value: e.target.value };
    setEditCurrent(concatCurrent);
    /*------------------------------------------------------------------------------*/

    // 然后把当前这个值再修改回数组里对应的那个对象
    // 如果当前有标签被选中
    if (concatCurrent.id !== null) {
      contentData.forEach((item: any) => {
        // { id: null, value: '请输入', type: 0, form: 'textArea' }
        const obj = item;
        if (concatCurrent.id === item.id) {
          obj.value = concatCurrent.value;
          obj.form = 'drag';
        }
      });
      const resultData = [...contentData];
      setContentData(resultData);
    }
  };
  const textAreaInit = (value: any) => {
    // 组合模式下value属性是一个对象数组, 不是单纯的文本
    if (Object.prototype.toString.call(value) === '[object Array]') {
      return '请输入文本!';
    }
    return value;
  };
  return (
    <div>
      <div style={{ marginBottom: 10 }}>定义固定文本</div>
      <Form
        id={uuidv4()}
        form={form}
        name="basic"
        initialValues={{ content: textAreaInit(editCurrent.value) }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="显示内容" name="content">
          <Input.TextArea id={uuidv4()} onChange={textAreaChange} style={{ height: 150 }} />
        </Form.Item>
        <Form.Item>
          <Button className="textbtn" type="primary" onClick={() => onFinish()}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Text;
