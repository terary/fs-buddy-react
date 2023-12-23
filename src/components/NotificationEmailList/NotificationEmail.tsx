import React, { useState, useEffect, useContext } from 'react';
import { TFsNotificationEmailLogic } from '../../formstack/type.notification';
import { TGraphNode } from '../../formstack/transformers/pojoToD3TableData';
import ExpandedExpressionTreeGraph from '../ExpandedExpressionTreeGraph/ExpandedExpressionTreeGraph';

// interface Props {
//     notificationPros
// }
// graphMap
interface Props {
  graphMap: TGraphNode[];
  emailNotificationProperties: any;
}

const NotificationEmail: React.FC<Props> = ({
  graphMap,
  emailNotificationProperties,
}: Props) => {
  // @ts-ignore
  //   const { name } = props || '';
  return (
    <div>
      Name: {JSON.stringify(emailNotificationProperties)} <br />
      graphMap: <br />
      <ExpandedExpressionTreeGraph
        height={500}
        width={600}
        data={graphMap || []}
      />
    </div>
  );
};
// const x: TFsNotificationEmailLogic;

export { NotificationEmail };
