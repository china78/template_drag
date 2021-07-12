/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import { request } from 'umi';
import type { ElementNameInt, ShowFormatInt } from './data';

// 变量状态下, 要素大类的下拉数据, 要fetch这个接口
export const queryElementType = (): Promise<any> => {
  return request('/platform/api/proposal/aggregate/query-role-spec', {
    method: 'POST',
    data: {
      pageIndex: 1,
      pageSize: 100,
    },
  });
};

// 要素名称接口
export const queryElementName = (params: ElementNameInt): Promise<any> => {
  return request('/platform/api/proposal/aggregate/query-role-property', {
    method: 'POST',
    data: {
      roleSpecId: params,
    },
  });
};
// 数据来源-原保批单
export const originData = (params?: any): Promise<any> => {
  return request('/platform/api/endorsement/approvalDocument/query-endorse-apply-factor-list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
};
// 显示格式
export const showFormat = (params: ShowFormatInt): Promise<any> => {
  return request('/platform/api/endorsement/config/query-data-type-format', {
    method: 'POST',
    data: {
      ...params,
    },
  });
};
