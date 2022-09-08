import { ITreeNode } from '@blueprintjs/core';

import { AddToolbarButtonsForTable } from './build';
import React from 'react';

type RequestCopiedCallback = (id: string | number) => void;
type TablePreviewCallback = (id: string) => void;

export function refreshDataTree(
  dataTree: ITreeNode[], requestCopied: string | number | null, onRequestCopied: RequestCopiedCallback, onTablePreview: TablePreviewCallback
): ITreeNode[] {
  return dataTree.map((dataTreeElement: ITreeNode) => ({
    ...dataTreeElement,
    childNodes: dataTreeElement.childNodes ?
        handleChildNodes(dataTreeElement.childNodes, requestCopied, onRequestCopied, onTablePreview) :
        dataTreeElement.childNodes
  }) as ITreeNode);
}

function handleChildNodes(
  childNodes: ITreeNode[], requestCopied: string | number | null, onRequestCopied: RequestCopiedCallback, onTablePreview: TablePreviewCallback
): ITreeNode[] {
  return childNodes.map((childNode: ITreeNode) => ({
    ...childNode,
    secondaryLabel: (childNode.nodeData && (childNode.nodeData as any).type === 'table') ?
      <AddToolbarButtonsForTable
        onTablePreview={onTablePreview}
        id={childNode.id}
        request={childNode.nodeData ? (childNode.nodeData as any).request : null}
        copiedId={requestCopied as string | null }
        onRequestCopied={onRequestCopied as (id: string | number | null) => void}/> : childNode.secondaryLabel,
    childNodes: childNode.childNodes ?
      handleChildNodes(childNode.childNodes, requestCopied, onRequestCopied, onTablePreview) :
      childNode.childNodes
  }) as ITreeNode);
}
