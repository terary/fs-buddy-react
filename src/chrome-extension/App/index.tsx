import React, { useState, useEffect, useContext } from 'react';

import { App as TheApp } from './App';

import {
  UIStateContextProvider,
  UIStateContext,
  UIStateDispatch,
} from '../AppState';

export const App = () => {
  return (
    <UIStateContextProvider>
      <TheApp />
    </UIStateContextProvider>
  );
};
