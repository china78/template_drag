/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import type { FC } from 'react';
import React from 'react';
import './style.less';

type Props = {
  status: string;
  edits: any[];
  auth: string;
};
const DragSource: FC<Props> = ({ status, edits, auth }) => {


  return (
    <div className="headerContainer">
      <div className="status">
        {status}
      </div>
      <div className="types">
        {auth === 'write' && <div>操作:{edits}</div>}
      </div>
    </div>
  );
};

export default DragSource;
