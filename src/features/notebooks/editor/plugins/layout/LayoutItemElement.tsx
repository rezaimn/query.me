import React, { useCallback, useEffect, useMemo, useState, createRef, useRef } from 'react';
import { useEditor, RenderElementProps } from 'slate-react';

import { useNotebookEditable } from '../../../hooks/use-editable';
import BlockName from '../../components/BlockName';
import { updateElementProps } from '../../utils';
import { useLayout, useResizeLayout } from './LayoutContext';
import useDebounce from '../../../../../shared/hooks/use-debounce';

import './LayoutItemElement.scss';

type OnChangeCallback = (value: any) => void;

interface LayoutRenderElementProps extends RenderElementProps {
}



export const LayoutItemElement = ({
  attributes,
  children,
  element,
}: LayoutRenderElementProps) => {
  const editor = useEditor();
  const { widths, setWidths, elements } = useLayout();
  const { addResizeListener, removeResizeListener, triggerResize } = useResizeLayout();
  const [width, setWidth] = useState<number>((element as any).width as number || 0);
  const elementRef = createRef<HTMLDivElement>();
  const elementWidthRef = useRef((element as any).width as number || 0);
  const draggingRef = useRef(false);
  const separatorXPositionRef = useRef(0);
  const initializedRef = useRef(false);

  const computedWidth = useMemo(() => {
    let elementWidth = null;
    if ((element as any).width) {
      elementWidth = (element as any).width;
    }
    if (width > 0) {
      return width;
    }
    if (widths) {
      elementWidth = widths[(element as any).id as string];
    }
    elementWidthRef.current = elementWidth;
    return elementWidth;
  }, [elementRef, elementRef.current, (element as any).id, (element as any).width, width, widths]);

  const debouncedComputedWidth = useDebounce(computedWidth, 1000);

  const isLastItem = useMemo(() => {
    if (!elements || !element ) {
      return false;
    }

    return elements.length > 0 && (elements[elements.length - 1].id === (element as any).id);
  }, [ elements, element ]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove as any);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
     document.removeEventListener('mousemove', onMouseMove as any);
     document.removeEventListener('mouseup', onMouseUp);
    };
  });

  const listener = useCallback((elementId: string, width: number, diff: number) => {
    const elementIdIndex = elements.findIndex(elt => elt.id === elementId);
    const currentElementIndex = elements.findIndex(elt => elt.id === (element as any).id);
    if (currentElementIndex === elementIdIndex + 1) {
      const newWidth = elementWidthRef.current - diff;
      setWidth(newWidth);
      elementWidthRef.current = newWidth;
      // updateElementProps(editor, element, 'width', newWidth);
    }
  }, [ elements, setWidth, computedWidth ]);

  useEffect(() => {
    if (!initializedRef.current && elements && elements.length > 0) {
      addResizeListener((element as any).id as string, listener);
      initializedRef.current = true;
    }
    return () => {
      if (initializedRef.current) {
        removeResizeListener((element as any).id as string, listener);
        initializedRef.current = false;
      }
    }
  }, [elements]);

  useEffect(() => {
    updateElementProps(editor, element, 'width', debouncedComputedWidth);
  }, [ debouncedComputedWidth ]);

  const onMouseDown = (e: React.MouseEvent) => {
    separatorXPositionRef.current = e.clientX;
    draggingRef.current = true;
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggingRef.current && separatorXPositionRef.current) {
      const oldWidth = computedWidth;
      const newWidth = computedWidth + e.clientX - separatorXPositionRef.current;
      separatorXPositionRef.current = e.clientX;
      setWidth(newWidth);
      triggerResize((element as any).id as string, newWidth, newWidth - oldWidth);
    }
  };

  const onMouseUp = () => {
    if (width > 0) {
      draggingRef.current = false;
    }
  };

  /* const [ value, setValue ] = useState<string>(element.layout_value as string || '');
  const [ type, setType ] = useState<string>(
    element.hasOwnProperty('layout_type') ? element.layout_type as string : 'text');
  const elementUid = element.uid;

  const onTypeChange = useCallback((newType: string) => {
    if (newType !== type) {
      setType(newType);
      updateElementProps(editor, element, 'layout_type', newType);
    }
  }, [ type ]);

  const onValueChange = useCallback((newValue: any) => {
    updateElementProps(editor, element, 'layout_value', newValue);
  }, [ value ]);

  const onNameUpdate = useCallback((value: string) => {
    updateElementProps(editor, element, 'name', value);
  }, []); */

  // console.log('>> computedWidth = ', computedWidth);

  return (
    <div className="layout_item" style={{width: `${computedWidth}px`}}>
      <div className="content" ref={elementRef}>{children}</div>
      <div
        className="divider"
        suppressContentEditableWarning
        contentEditable={false}
        style={{visibility: isLastItem ? 'hidden' : 'visible', userSelect: 'none'}}
        onMouseDown={onMouseDown}
      ></div>
    </div>
  );
};
