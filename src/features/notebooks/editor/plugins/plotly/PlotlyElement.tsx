import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { Transforms } from 'slate';
import { useEditor, useSelected, ReactEditor, RenderElementProps } from 'slate-react';
import {
  Button,
  Checkbox,
  Classes,
  Colors,
  EditableText,
  Icon,
  Intent,
  Menu,
  MenuItem,
  Popover,
  Position,
  Spinner,
  Tooltip,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import plotly from 'plotly.js';

import { IState } from '../../../../../shared/store/reducers';
import { useNotebookEditable } from "../../../hooks/use-editable";
// import PlotlyEditor from 'react-chart-editor';
import PlotlyEditor from './customization/PlotEditor';
import { NewPlotlyEditor } from './editor/NewPlotlyEditor';
import 'react-chart-editor/lib/react-chart-editor.css';
// import PlotlyChart from 'react-plotlyjs-ts';
import { updateElementProps } from '../../utils';
import { useLayout } from '../../../../../shared/components/layout/LayoutContext';

import './PlotlyElement.scss';

interface AdditionalRenderElementProps extends RenderElementProps {
  hovered: boolean;
}

// Editable mode should be false because inline editing of title
// and axes legends doesn't work well
const config = {editable: false};

// used in case the notebook is not editable
const configDisable = {
  editable: false,
  displayModeBar: false,
  staticPlot: true,
}

export const PlotlyElement = ({
  attributes,
  children,
  element,
  hovered
}: AdditionalRenderElementProps) => {
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const [name, setName] = useState((element as any).name as string);
  const [tmpName, setTmpName] = useState((element as any).name as string);
  const [data, setData] = useState<any[]>(
    ((element as any).properties && ((element as any).properties as any).data) ?
    JSON.parse(JSON.stringify(((element as any).properties as any).data as any[])) : []
  );
  const [layout, setLayout] = useState<any>(
    ((element as any).properties && ((element as any).properties as any).layout) ?
      JSON.parse(JSON.stringify(((element as any).properties as any).layout as any)) : {}
  );
  const [frames, setFrames] = useState<any[]>(
    ((element as any).properties && ((element as any).properties as any).frames) ?
      JSON.parse(JSON.stringify(((element as any).properties as any).frames as any[])) : []
  );
  const [editorControlsDisplayed, setEditorControlsDisplayed] = useState(false);
  const [editGraphEnabled, setEditGraphEnabled] = useState(false);
  const [showGearBtn, setShowGearBtn] = useState(false);
  const editor = useEditor();
  const editable = useNotebookEditable();
  const plotlyEditorRef = useRef<any>();
  const { leftMenuClosed } = useLayout();

  useEffect(() => {
    if (!editable && layout) {
      /*
       * do not allow action on the plotly element
       */
      setLayout({
        ...layout,
        hovermdoe: false,
        yaxis: {fixedrange: true},
        xaxis: {fixedrange: true},
        autosize: true
      });
    }
  }, [ editable ]);

  useEffect(() => {
    if (notebook) {
      for (const page of notebook.pages) {
        for (const block of page.blocks) {
          if (block.uid === (element as any).uid) {
            const { properties } = block.content_json;
            if (properties && JSON.stringify(properties) !== JSON.stringify((element as any).properties)) {
              setData(properties.data);
              updateElementProps(editor, element, 'properties', properties);
            }
          }
        }
      }
    }
  }, [ notebook ]);

  useEffect(() => {
    if (plotlyEditorRef.current) {
      plotlyEditorRef.current.handleResize();
    }
  }, [ leftMenuClosed ]);

  const onNameUpdate = useCallback((newName: string) => {
    setName(newName);
    updateElementProps(editor, element, 'name', newName);
  }, []);

  const onDisplayEditorControls = useCallback((displayed: boolean) => {
    setEditorControlsDisplayed(displayed);
  }, [ setEditorControlsDisplayed ]);

  const onSetEditGraphEnabled = useCallback((enabled: boolean) => {
    setEditGraphEnabled(enabled);
  }, []);

  const onClickEditChart = useCallback(() => {
    setEditGraphEnabled(true);
    setTimeout(() => {
      setEditorControlsDisplayed(true);
    }, 200);
  }, []);

  const onUpdateChartConfiguration = (newData: any, newLayout: any, newFrames: any) => {
    setData(newData);
    setLayout(newLayout);
    setFrames(newFrames);

    const newProperties = {
      data: newData,
      layout: newLayout,
      frames: newFrames
    };

    updateElementProps(editor, element, 'properties', newProperties);
  };

  const handleResize = () => {
    plotlyEditorRef.current.handleResize();
  };

  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div className="plotly" {...attributes} suppressContentEditableWarning contentEditable="false"
         onMouseOver={() => setShowGearBtn(true)} onMouseLeave={() => setShowGearBtn(false)}>
      <div className="plotly__toolbar">
        <div className="plotly__toolbar__title" data-cy='plotlyTitle'>
          <Icon className="plotly__toolbar__title__icon" icon={IconNames.CHART} />
          <EditableText
            className="plotly__title__value"
            disabled={!editable}
            defaultValue={name}
            value={tmpName}
            placeholder="Click to edit the chart name"
            onChange={setTmpName}
            onConfirm={onNameUpdate} />
        </div>
        {
          editable && (
            <div className="plotly__toolbar__actions">
              {
                <Button
                  className='bp3-button bp3-minimal'
                  style={{ display: showGearBtn ? 'inline-flex' : 'none' }}
                  onClick={() => onClickEditChart()}
                  icon={<Icon icon={IconNames.EDIT}/>}
                />
              }
            </div>
          )
        }
      </div>
      <div className="plotly-wrapper">
        <NewPlotlyEditor
          ref={plotlyEditorRef}
          label={name}
          data={data}
          layout={layout}
          config={editable ? config: configDisable}
          frames={frames}
          plotly={plotly}
          slateEditor={editor}
          onUpdate={onUpdateChartConfiguration}
          editorControlsDisplayed={editorControlsDisplayed}
          onDisplayEditorControls={onDisplayEditorControls}
          editGraphEnabled={editGraphEnabled}
          onSetEditGraphEnabled={onSetEditGraphEnabled}
          useResizeHandler
          debug
          advancedTraceTypeSelector
        />
      </div>
      <span suppressContentEditableWarning className="void-element">
        {children}
      </span>
    </div>
  );
};
