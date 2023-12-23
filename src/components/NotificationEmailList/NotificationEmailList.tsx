import React, { useState, useEffect, useContext } from 'react';
import { TFsNotificationEmailLogic } from '../../formstack/type.notification';
import {
  actions,
  UIStateContext,
  UIStateDispatch,
} from '../../chrome-extension/AppState';

import { TGraphNode } from '../../formstack/transformers/pojoToD3TableData';
import ExpandedExpressionTreeGraph from '../ExpandedExpressionTreeGraph/ExpandedExpressionTreeGraph';
import { TStatusRecord } from '../StatusMessageListContainer/type';
import { NotificationEmail } from './NotificationEmail';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Props {
  notificationList: {
    graphMap: TGraphNode[];
    emailNotificationProperties: any;
    statusMessages: TStatusRecord[];
  }[];
}

const NotificationEmailList: React.FC<Props> = ({
  notificationList,
}: Props) => {
  const dispatcher = useContext(UIStateDispatch);
  const uiStateContext = useContext(UIStateContext);

  const [selectedNotification, setSelectedNotification] = useState(
    notificationList[0] || null
  );
  const handleOnNotificationSelected = (evt: DropdownChangeEvent) => {
    const newSelectedNotification = notificationList.find((notification) => {
      return notification.emailNotificationProperties.id == evt.value;
    });
    // @ts-ignore
    // const newSelectedNotification = notificationList[0];
    setSelectedNotification(newSelectedNotification || null);
    console.log({
      handleOnNotificationSelected: {
        value: evt.value,
        newSelectedNotification,
        evt,
      },
    });
  };

  return (
    <div>
      {selectedNotification && (
        <Dropdown
          value={selectedNotification?.emailNotificationProperties?.id || ''}
          onChange={handleOnNotificationSelected}
          options={notificationList}
          optionLabel="emailNotificationProperties.name"
          optionValue="emailNotificationProperties.id"
          placeholder="Select Notification Email"
          className="w-full md:w-14rem"
        />
      )}
      <br />
      Name: {selectedNotification?.emailNotificationProperties?.name}
      <br />
      {Array.isArray(selectedNotification?.graphMap) &&
        selectedNotification?.graphMap.length > 0 && (
          <ExpandedExpressionTreeGraph
            height={500}
            width={600}
            data={selectedNotification.graphMap || []}
          />
        )}
    </div>
  );
};
// const x: TFsNotificationEmailLogic;

export { NotificationEmailList };
