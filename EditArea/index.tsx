/*!
 * Author: Tiangg
 * Date: 2021-03-05
 */

import type { FC } from 'react';
import React from 'react';
import '../DragSource/style.less';

type Props = {
  renderContent: any;
};

const EditArea: FC<Props> = ({ renderContent }) => {
  return <div className="rightContainer">{renderContent}</div>;
};

export default EditArea;
