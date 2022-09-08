import React, { useEffect, useRef, createRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useEditor, RenderElementProps } from 'slate-react';

import { useNotebookEditable } from "../../../hooks/use-editable";
import BlockName from '../../components/BlockName';
import { updateElementProps } from '../../utils';
import { LayoutProvider, useLayout, useResizeLayout } from './LayoutContext';

import './LayoutElement.scss';

type OnChangeCallback = (value: any) => void;

interface LayoutRenderElementProps extends RenderElementProps {
}



export const InnerLayoutElement = ({
  attributes,
  children,
  element,
}: LayoutRenderElementProps) => {
  const editor = useEditor();
  const editable = useNotebookEditable();
  const { addResizeListener, removeResizeListener, triggerResize } = useResizeLayout();
  const { widths, setWidths, setElements } = useLayout();
  const widthsRef = useRef({});
  const layoutRef = createRef<HTMLDivElement>();
  const initializedRef = useRef(false);

  useEffect(() => {
    setElements(element.children);
    if (setWidths && layoutRef.current) {
      const layoutWidth = layoutRef.current.clientWidth;
      if (widthsRef.current && Object.keys(widthsRef.current).length > 0) {
        return;
      }
      setWidths(
        element.children
          .map((block: any) => /* (block.children[0] as any).uid */ block.id)
          .reduce((acc, blockUid) => ({
            ...acc,
            [blockUid]: Math.floor(layoutWidth / element.children.length)
          }), {})
      );
    }
  }, [element.children, setWidths, layoutRef?.current ]);

  const listener = useCallback((elementId: string, width: number, diff: number) => {
    if (widthsRef.current) {
      (widthsRef.current as any)[elementId] = width;
    }
  }, [element.children]);

  useEffect(() => {
    if (!initializedRef.current && element.children && element.children.length > 0) {
      addResizeListener((element as any).id as string, listener);
      initializedRef.current = true;
    }
    return () => {
      if (initializedRef.current) {
        removeResizeListener((element as any).id as string, listener);
        initializedRef.current = false;
      }
    }
  }, [element.children]);

  return (
    <div className="layout" ref={layoutRef}>
      {children}
    </div>
  );
};

export const LayoutElement = ({
  attributes,
  children,
  element,
}: LayoutRenderElementProps) => {
  return (
    <LayoutProvider>
      <InnerLayoutElement attributes={attributes} element={element}>
        {children}
      </InnerLayoutElement>
    </LayoutProvider>
  );
}
