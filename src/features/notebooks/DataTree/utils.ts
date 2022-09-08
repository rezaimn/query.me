import { ITreeNode } from '@blueprintjs/core';

export function filterDataTree(nodes: ITreeNode[] | null, keyword: string, columnType: string) {
  if (!nodes) {
    return [];
  }

  const filterFn = (label: string | undefined) => !!label && label.toLowerCase().indexOf(keyword) >= 0;
  const filterColumnTypeFn = (node: any) =>
    node.nodeData.type === "column" && columnType && node.nodeData.data_type === columnType;

  const newNodes: any = [];

  for (const node of nodes) {
    if (node.childNodes && node.childNodes.length) {
      const found = filterDataTree(node.childNodes, keyword, columnType);

      if (found.length) {
        // parent node with children, where some children contain the searched keyword
        node.childNodes = found;
        newNodes.push({
          ...node,
          isExpanded: true
        });
      } else if (
        (keyword && columnType && filterFn(node.label as string) && filterColumnTypeFn(node)) ||
        (keyword && !columnType && filterFn(node.label as string)) ||
        (columnType && !keyword && filterColumnTypeFn(node))
      ) {
        // parent node with children, but children don't contain the searched keyword
        newNodes.push({
          ...node,
          childNodes: found.length ? found : [],
          hasCaret: false
        });
      }
    } else if (
      (keyword && columnType && filterFn(node.label as string) && filterColumnTypeFn(node)) ||
      (keyword && !columnType && filterFn(node.label as string)) ||
      (columnType && !keyword && filterColumnTypeFn(node))
    ) {
      // edge node
      newNodes.push(
        {
          ...node,
          hasCaret: false
        }
      )
    }
  }

  return newNodes;
}
