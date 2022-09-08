import React, {
  FunctionComponent,
  Context,
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef
} from 'react';

type DispatchActionCallback = (dataElement: any) => void;
type AddActionListenerCallback = (blockUid: string, listener: Function) => void;
type RemoveActionListenerCallback = (blockUid: string) => void;

interface ActionContextContent {
  dispatchAction: DispatchActionCallback;
  addActionListener: AddActionListenerCallback;
  removeActionListener: RemoveActionListenerCallback;
}
  
const ActionContext: Context<ActionContextContent> = createContext<ActionContextContent>({
  dispatchAction: (action: any) => {},
  addActionListener: (blockUid: string, listener: Function) => {},
  removeActionListener: (blockUid: string) => {}
});
  
type ActionProviderProps = {

}

export const ActionProvider: FunctionComponent<ActionProviderProps> = ({
  children
}) => {
  const listenersRef = useRef<any>({});

  const value = useMemo(
    () => ({
      dispatchAction: (action: any) => {
        if (listenersRef && listenersRef.current) {
          for (const key of Object.keys(listenersRef.current)) {
            const dataElementListener = listenersRef.current[key];
            if (dataElementListener) {
              dataElementListener(action);
            }
          }
        }
      },
      addActionListener: (listenerUid: string, listener: Function) => {
        listenersRef.current = {
          ...listenersRef.current,
          [listenerUid]: listener
        };
      },
      removeActionListener: (listenerUid: string) => {
        listenersRef.current = {
          ...listenersRef.current,
          [listenerUid]: undefined
        };
      }
    }),
    [
      listenersRef.current
    ]
  );
  
  return (
    <ActionContext.Provider value={value}>
      {children}
    </ActionContext.Provider>
  )
}
  
export function useActions() {
  const {
    dispatchAction,
    addActionListener,
    removeActionListener
  } = useContext(ActionContext);
  return {
    dispatchAction,
    addActionListener,
    removeActionListener
  };
}
