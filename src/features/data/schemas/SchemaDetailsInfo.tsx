import React, { FunctionComponent } from 'react';
import TimeAgo from 'react-timeago';
import './SchemaDetailsInfo.scss';
import LabelledText from '../../../shared/components/form/LabelledText';
import { UnderlinedTabs, UnderlinedTab } from '../../../shared/components/layout/UnderlinedTabs';
import SchemaDetailsInfoTables from './SchemaDetailsInfoTables';
import { ISchema, ISort } from 'shared/models';
import {isFirstPage} from '../../notebooks/utils';
import { displayDetailsSkeleton } from '../../../shared/components/displayRowsSkeleton/displayRowsSkeleton';

type OnCloseCallback = () => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreTablesForSchemaCallback = () => void;

type SchemaDetailsInfoProps = {
  schema: ISchema | null;
  schemaLoading: boolean;
  fromDrawer?: boolean;
  onCloseDrawer?: OnCloseCallback;
  onToggleSort: OnToggleSortCallback;
  loadMoreTablesForSchema: OnLoadMoreTablesForSchemaCallback;
  canLoadMore: boolean;
  currentPage: number;
  firstPage: number;
  infiniteScrollClassName: string;
};

type SchemaDetailsProps = {
  schema: ISchema | null;
  fromDrawer?: boolean;
  onCloseDrawer: OnCloseCallback;
  onToggleSort: OnToggleSortCallback;
  loadMoreTablesForSchema: OnLoadMoreTablesForSchemaCallback;
  canLoadMore: boolean;
  schemaLoading: boolean;
  infiniteScrollClassName: string;
};

const displayDetails = ({
    schema, fromDrawer,
    onCloseDrawer, onToggleSort,
    canLoadMore,
    loadMoreTablesForSchema, schemaLoading,
    infiniteScrollClassName
}: SchemaDetailsProps) => {
  return (
    <div className={`schema-details ${fromDrawer ? 'no-border' : ''}`} data-cy='schemaDetailsInfo'>
      { /* <div className="schema-details__tags__list">
        <Tag minimal={true}>Certified</Tag>
        <Tag minimal={true}>Other Tag</Tag>
        <Tag minimal={true}>Another Tag</Tag>
      </div> */ }
      <div className={`schema-details__props ${fromDrawer ? 'vertical-props' : ''}`}>
        <div className={`schema-details__props__left ${fromDrawer ? 'full-width' : ''}`}>
          <LabelledText inline={true} label="Type" labelUppercase={true}>
            {schema?.database_type}
          </LabelledText>
          { /* <LabelledText inline={true} multilines={true} label="Description" labelUppercase={true}>
            TODO
          </LabelledText> */ }
          <LabelledText inline={true} label="Database" labelUppercase={true}>
            {schema?.database}
          </LabelledText>
        </div>
        <div className={`schema-details__props__right ${fromDrawer ? 'full-width' : ''}`}>
          { /* <LabelledText inline={true} label="Created" labelUppercase={true}>
            {
              schema.last_use ? (
                <TimeAgo date={schema.created_on} />
              ) : (
                <div></div>
              )
            }
          </LabelledText> */ }
          <LabelledText inline={true} label="Last used" labelUppercase={true}>
            {
              schema?.last_use ? (
                <TimeAgo date={schema?.last_use} />
              ) : (
                <div>No use</div>
              )
            }
          </LabelledText>
        </div>
      </div>
      <div className="schema-details__tabs" data-cy='schemaTablesList'>
        <UnderlinedTabs defaultActiveTab="tablesTab">
          <UnderlinedTab id="tablesTab" title="Tables" tag={schema?.tables ? schema?.tables.length.toString() : '0'}>
          <SchemaDetailsInfoTables
            infiniteScrollClassName={infiniteScrollClassName}
            onLoadMore={loadMoreTablesForSchema}
            canLoadMore={canLoadMore}
            schemaLoading={schemaLoading}
            tables={schema?.tables}
            onCloseDrawer={onCloseDrawer}
            onToggleSort={onToggleSort}
          ></SchemaDetailsInfoTables>
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

const SchemaDetailsInfoComponent: FunctionComponent<SchemaDetailsInfoProps> = ({
  schema, schemaLoading,
  fromDrawer, onCloseDrawer, onToggleSort, canLoadMore, currentPage, firstPage, loadMoreTablesForSchema, infiniteScrollClassName
}: SchemaDetailsInfoProps) => {
  const handleCloseDrawer = () => {
    onCloseDrawer && onCloseDrawer();
  }
  return (schemaLoading || !schema) && isFirstPage(currentPage, firstPage) ?
    displayDetailsSkeleton() :
    displayDetails({schema, fromDrawer,
      onCloseDrawer:handleCloseDrawer, onToggleSort,
      canLoadMore,
      loadMoreTablesForSchema,
      schemaLoading,
      infiniteScrollClassName}
    );
};

export default SchemaDetailsInfoComponent;
