import React, {
  FunctionComponent,
  Context,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react';

type PageCallback = (widths: any) => void;
type ResizeCallback = (elementId: string, listener: Function) => void;
type TriggerResizeCallback = (elementId: string, width: number, diff: number) => void;

interface LayoutContextContent {
  widths: any;
  setWidths: PageCallback;
  elements: any[];
  setElements: PageCallback;
  addResizeListener: ResizeCallback;
  removeResizeListener: ResizeCallback;
  triggerResize: TriggerResizeCallback;
}

const LayoutContext: Context<LayoutContextContent> = createContext<any>({});

type LayoutProviderProps = {

}

export const LayoutProvider: FunctionComponent<LayoutProviderProps> = ({
  children
}) => {
  const [ widths, setWidths ] = useState<any>({});
  const [ elements, setElements ] = useState<any>([]);
  const [ resizeListeners, setResizeListeners ] = useState<any>([]);

  const value = useMemo(
    () => ({
      widths,
      setWidths,
      elements,
      setElements,
      /*
        Registers to resize
       */
      addResizeListener: (elementId: string, listener: Function) => {
        setResizeListeners((resizeListeners: any) => ({
          ...resizeListeners,
          [elementId]: listener
        }));
      },
      /*
        Unregisters to resize
       */
      removeResizeListener: (elementId: string) => {
        setResizeListeners((resizeListeners: any) => ({
          ...resizeListeners,
          [elementId]: undefined
        }));
      },
      /*
        Triggers resize
       */
      triggerResize: (elementId: string, width: number, diff: number) => {
        Object.values(resizeListeners).forEach((listener: any) => {
          listener(elementId, width, diff);
        })
      }
    }),
    [
      widths,
      setWidths,
      elements,
      setElements,
      resizeListeners,
      setResizeListeners
    ]
  );

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const { widths, setWidths, elements, setElements } = useContext(LayoutContext);
  return { widths, setWidths, elements, setElements };
}

export function useResizeLayout() {
  const { addResizeListener, removeResizeListener, triggerResize } = useContext(LayoutContext);
  return { addResizeListener, removeResizeListener, triggerResize };
}
