import React, { FunctionComponent } from 'react';
import TimeAgo from 'react-timeago';
import './TableDetailsInfo.scss';
import LabelledText from '../../../shared/components/form/LabelledText';
import { UnderlinedTabs, UnderlinedTab } from '../../../shared/components/layout/UnderlinedTabs';
import TableDetailsInfoColumns from './TableDetailsInfoColumns';
import { ITable, ISort } from 'shared/models';
import {isFirstPage} from '../../notebooks/utils';
import { displayDetailsSkeleton } from '../../../shared/components/displayRowsSkeleton/displayRowsSkeleton';

type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreColumnsForTableCallback = () => void;

type TableDetailsInfoProps = {
  table: ITable | null;
  tableLoading: boolean;
  fromDrawer?: boolean;
  onToggleSort: OnToggleSortCallback;
  loadMoreColumnsForTable: OnLoadMoreColumnsForTableCallback;
  canLoadMore: boolean;
  currentPage: number;
  firstPage: number;
  infiniteScrollClassName: string;
};

type TableDetailsProps = {
  table: ITable | null;
  fromDrawer?: boolean;
  onToggleSort: OnToggleSortCallback;
  loadMoreColumnsForTable: OnLoadMoreColumnsForTableCallback;
  canLoadMore: boolean;
  tableLoading: boolean;
  infiniteScrollClassName: string;
};


const displayDetails = ({
   table, fromDrawer,
   onToggleSort,
   canLoadMore,
   loadMoreColumnsForTable, tableLoading,
   infiniteScrollClassName
}: TableDetailsProps) => {
  return (
    <div className={`table-details ${fromDrawer ? 'no-border' : ''}`} data-cy='tableDetailsInfo'>
      { /* <div className="table-details__tags__list">
        <Tag minimal={true}>Certified</Tag>
        <Tag minimal={true}>Other Tag</Tag>
        <Tag minimal={true}>Another Tag</Tag>
      </div> */ }
      <div className={`table-details__props ${fromDrawer ? 'vertical-props' : ''}`}>
        <div className={`table-details__props__left ${fromDrawer ? 'full-width' : ''}`}>
          <LabelledText inline={true} label="Type" labelUppercase={true}>
            {table?.type}
          </LabelledText>
          <LabelledText inline={true} label="Database" labelUppercase={true}>
            {table?.database}
          </LabelledText>
          <LabelledText inline={true} label="Schema" labelUppercase={true}>
            {table?.schema}
          </LabelledText>
        </div>
        <div className={`table-details__props__right ${fromDrawer ? 'full-width' : ''}`}>
          { /* <LabelledText inline={true} label="Created" labelUppercase={true}>
            {
              table.last_use ? (
                <TimeAgo date={table.created_on} />
              ) : (
                <div></div>
              )
            }
          </LabelledText> */ }
          <LabelledText inline={true} label="Last used" labelUppercase={true}>
            {
              table?.last_use ? (
                <TimeAgo date={table?.last_use} />
              ) : (
                <div>No use</div>
              )
            }
          </LabelledText>
          { /* <LabelledText inline={true} label="Owners" labelUppercase={true} vAlign="center">
            <Avatar image={image1} />
            <Avatar image={image2} />
          </LabelledText> */ }
        </div>
      </div>
      <div className="table-details__tabs" data-cy='tableColumnsList'>
        <UnderlinedTabs defaultActiveTab="columnsTab">
          <UnderlinedTab id="columnsTab" title="Columns" tag={table?.columns ? table.columns.length.toString() : '0'}>
          <TableDetailsInfoColumns
            infiniteScrollClassName={infiniteScrollClassName}
            onLoadMore={loadMoreColumnsForTable}
            canLoadMore={canLoadMore}
            tableLoading={tableLoading}
            columns={table?.columns}
            onToggleSort={onToggleSort}
          ></TableDetailsInfoColumns>
          </UnderlinedTab>
          { /* <UnderlinedTab id="tab2" title="Related Content">
            <div>Test2</div>
          </UnderlinedTab>
          <UnderlinedTab id="tab3" title="Users" tag="21">
            <div>Test3</div>
          </UnderlinedTab>
          <UnderlinedTab id="tab4" title="Security">
            <div>Test4</div>
          </UnderlinedTab> */ }
        </UnderlinedTabs>
      </div>
    </div>
  );
}

const TableDetailsInfoComponent: FunctionComponent<TableDetailsInfoProps> = ({
  table, tableLoading, fromDrawer, onToggleSort, canLoadMore, currentPage, firstPage, loadMoreColumnsForTable, infiniteScrollClassName
}: TableDetailsInfoProps) => {
  return (tableLoading || !table) && isFirstPage(currentPage, firstPage) ?
    displayDetailsSkeleton() :
    displayDetails({table, fromDrawer, onToggleSort,
      canLoadMore,
      loadMoreColumnsForTable,
      tableLoading,
      infiniteScrollClassName});
};

export default TableDetailsInfoComponent;
