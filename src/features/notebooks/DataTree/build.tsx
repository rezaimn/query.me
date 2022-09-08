import React, { FunctionComponent } from 'react';
import { Button, Tooltip, Position, ITreeNode } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { columnIcon } from '../../data/tables/utils';
import { getResultType } from '../../../shared/utils/elasticsearch';

type Lookup = { [key: string]: number };

interface IAddTo {
  dataTree: ITreeNode[];
  lookup: Lookup;
  node: any;
  childNodes?: any[];
  id: string;
  label: string;
  type: string;
  requestCopied?: string | number | null;
  onRequestCopied?: (id: string | null) => void;
  onTablePreview?: (id: string) => void;
}

type RefreshCallback = (id: string) => void;
type RequestCopiedCallback = (id: string | number) => void;
type TablePreviewCallback = (id: string) => void;

function addSchemaToDatabase({ dataTree, lookup, node, id, label, type }: IAddTo) {
  const database_uid: string = node.database_uid;
  const databaseIndex: number = lookup[database_uid];

  if (!(databaseIndex >= 0)) { // if databaseIndex is not >= with 0
    return;
  }

  const index = dataTree[databaseIndex].childNodes?.length || 0;
  lookup[`${database_uid}_${label}`] = index;

  dataTree[databaseIndex].childNodes?.push(
    {
      id,
      label,
      nodeData: { type, path: [databaseIndex, index] },
      icon: 'heat-grid',
      isExpanded: false,
      childNodes: []
    }
  );
}

function buildRequestForTable(label: string, schema_name: string, columns: any[]) {
  const lines = [];
  lines.push(columns && columns.length > 0 ? 'SELECT': 'SELECT *');
  let index = 0;
  for (const column of columns) {
    lines.push(index < columns.length - 1 ?
      `  ${column.table}.${column.name},` :
      `  ${column.table}.${column.name}`
    );
    index++;
  }
  lines.push(`FROM ${schema_name}.${label}`);
  return lines.join('\n');
}

function addTableToSchema({ dataTree, lookup, node, childNodes, id, label, type, requestCopied, onRequestCopied, onTablePreview }: IAddTo) {
  const database_uid: string = node.database_uid;
  const schema_name: string = node.schema;
  const databaseIndex: number = lookup[database_uid];
  // see how lookup is generated in addSchemaToDatabase in order to get the index
  const schemaIndex: number = lookup[`${database_uid}_${schema_name}`];

  if (!(databaseIndex >= 0) || !(schemaIndex >= 0)) {
    return;
  }

  const index = dataTree[databaseIndex].childNodes?.[schemaIndex].childNodes?.length || 0;
  lookup[`${database_uid}_${schema_name}_${label}`] = index;
  const columns = childNodes as any[];

  const request: string = buildRequestForTable(label, schema_name, columns);

  dataTree[databaseIndex].childNodes?.[schemaIndex].childNodes?.push(
    {
      id,
      label,
      nodeData: { type, path: [databaseIndex, schemaIndex, index], request },
      icon: 'th',
      isExpanded: false,
      childNodes: [],
      secondaryLabel: <AddToolbarButtonsForTable
        id={id}
        request={request}
        copiedId={requestCopied as string | null}
        onRequestCopied={onRequestCopied as (id: string | number | null) => void}
        onTablePreview ={ onTablePreview as (id: string ) => void}
      />,
    },
  );
}

function addColumnToTable({ dataTree, lookup, node, id, label, type }: IAddTo) {
  const data_type: string = node.data_type;
  const database_uid: string = node.database_uid;
  const schema_name: string = node.schema;
  const table_name: string = node.table;
  const databaseIndex: number = lookup[database_uid];
  // see how lookup is generated in addSchemaToDatabase in order to get the index
  const schemaIndex: number = lookup[`${database_uid}_${schema_name}`];
  // see how lookup is generated in addTableToSchema in order to get the index
  const tableIndex: number = lookup[`${database_uid}_${schema_name}_${table_name}`];

  if (!(databaseIndex >= 0) || !(schemaIndex >= 0) || !(tableIndex >= 0)) {
    return;
  }

  const index = dataTree[databaseIndex].childNodes?.[schemaIndex].childNodes?.[tableIndex].childNodes?.length || 0;

  dataTree[databaseIndex].childNodes?.[schemaIndex].childNodes?.[tableIndex].childNodes?.push(
    {
      id,
      label,
      nodeData: { type, data_type, path: [ databaseIndex, schemaIndex, tableIndex, index ] },
      icon: columnIcon({ column: node }),
      isExpanded: false
    }
  );
}

function addToolbarButtonsForDatabase(
  id: string,
  onRefresh: RefreshCallback
) {
  const onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    onRefresh(id);
  };

  return (
    <div className="data-tree__toolbar">
      <Tooltip
        hoverOpenDelay={800}
        content={<>Refresh database schema metadata.</>}
        position={Position.BOTTOM}
      >
        <Button
          minimal={true}
          small={true}
          icon={IconNames.REFRESH}
          className="refresh-button" onClick={onClick} />
      </Tooltip>
    </div>
  )
}


export const AddToolbarButtonsForTable: FunctionComponent<{
  request: string,
  id: (string | number),
  copiedId: string | null,
  onRequestCopied: RequestCopiedCallback,
  onTablePreview: TablePreviewCallback }> = ({
    request,
    id,
    copiedId,
    onRequestCopied,
    onTablePreview
}) => {

  return (
    <div className="data-tree__toolbar">
      <div className="copy-request-button">
        <Tooltip
          hoverOpenDelay={800}
          content={<>Preview the first 100 data</>}
          position={Position.BOTTOM}
        >
          <Button
            minimal={true}
            small={true}
            icon={IconNames.EYE_OPEN}
            onClick={()=>onTablePreview(id.toString())}
          />
        </Tooltip>
      </div>
      {
        (copiedId === id) ? (
          <div>Copied!</div>
        ) : (
          <div className="copy-request-button">
            <Tooltip
              hoverOpenDelay={800}
              content={<>Copy SELECT statement to clipboard</>}
              position={Position.BOTTOM}
            >
              <CopyToClipboard
                text={request}
                onCopy={() => onRequestCopied(id)}
              >
                <Button
                  minimal={true}
                  small={true}
                  icon={IconNames.CLIPBOARD}
                />
              </CopyToClipboard>
            </Tooltip>
          </div>
        )
      }
    </div>
  );
};

export function buildDataTree(nodes: any, requestCopied: string | number | null, onRefresh: RefreshCallback, onRequestCopied: RequestCopiedCallback, onTablePreview: TablePreviewCallback): ITreeNode[] {
  const dataTree: ITreeNode[] = [];

  /*
   * lookup object consist of key / value pairs that helps to find the path of a children:
   * - database_id: index => in order to know where to insert schemas
   * - database_id + schema_name: index => in order to know where to insert tables
   * - database_id + schema_name + table_name: index => in order to know where to insert columns
   */
  type Lookup = { [key: string]: number };
  const lookup: Lookup = {};

  /*
   * nodes are sorted by type in the following order:
   * - databases
   * - schemas
   * - tables
   * - columns
   */

  const start = new Date().getTime();
  nodes.forEach((node: any) => {
    const type = getResultType(node);
    const id: string = node.id as string;
    const label: string = node.name;

    switch (type) {
      case 'database':
        lookup[id] = dataTree.length;
        const index = dataTree.length;

        dataTree.push(
          {
            id,
            label,
            nodeData: { type, path: [index] },
            icon: 'database',
            childNodes: [],
            secondaryLabel: addToolbarButtonsForDatabase(id, onRefresh),
          }
        );
        break;
      case 'schema':
        addSchemaToDatabase({ dataTree, lookup, node, id, label, type });
        break;
      case 'table':
        const childNodes = nodes.filter((n: any) => (
          n.database_uid === node.database_uid && n.schema === node.schema && n.table === node.name
        ));
        addTableToSchema({
          dataTree, lookup, node, childNodes, id, label, type, requestCopied,
          onRequestCopied: onRequestCopied as (id: string | null) => void,
          onTablePreview: onTablePreview as (id: string) => void
        });
        break;
      case 'column':
        addColumnToTable({ dataTree, lookup, node, id, label, type });
        break;
    }
 });
  const end = new Date().getTime();
  // console.log('build duration:', (end - start) / 1000); // benchmark builder
  return dataTree;
}
