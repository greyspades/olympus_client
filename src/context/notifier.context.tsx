"use client";

import React, { Dispatch, createContext, useReducer } from "react";

type NotifierProps = {
    code: number;
    open: boolean;
    content: string;
    title?: string;
    next?: {
      title: string;
      action: () => void;
    };
}

type ActionType = {
  type: string;
  payload: NotifierProps
};

const initialState: NotifierProps = {
  code: null,
    open: false,
    content: null,
    title: null,
    next: {
      title: null,
      action: null
    }
};

const reducer = (state: NotifierProps, action?: ActionType) => {
  switch (action.type) {
    case "CREATE":
      return action.payload;
    case "CLOSE":
      return { ...state, open: false };
    case "RESET":
      return { ...state };
    default:
      return state;
  }
};

export const NotifierContext = createContext<{
  notifierState: NotifierProps;
  notifierDispatch: Dispatch<ActionType>;
}>({ notifierState: initialState, notifierDispatch: () => null });

export const NotifierContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifierState, notifierDispatch] = useReducer(reducer, initialState);

  return (
    <NotifierContext.Provider value={{ notifierState, notifierDispatch }}>
      {children}
    </NotifierContext.Provider>
  );
};
