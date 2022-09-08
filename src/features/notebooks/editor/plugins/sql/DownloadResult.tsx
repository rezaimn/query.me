import React, { FunctionComponent } from 'react';
import { CSVLink } from 'react-csv';
import {
  Button,
  Colors,
  Icon,
  Menu,
  MenuItem,
  Popover,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { format } from 'date-fns';

import { INotebookPageBlock } from '../../../../../shared/models';
import config from '../../../../../config';

interface DownloadResultBtnProps {
  selectedResult: any | null;
  block: INotebookPageBlock | null;
  show: boolean;
  selectedResultColumns: any[];
}

interface IDownloadCSVProps {
  block: INotebookPageBlock | null;
  selectedResult: any | null;
  selectedResultColumns: any[];
}

const DownloadCSV: FunctionComponent<IDownloadCSVProps> = ({
  block,
  selectedResult,
  selectedResultColumns,
}: IDownloadCSVProps) => {
  if (!block) {
    return null;
  }

  const name = block && block.name ?
    block.name.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /, '-')
      .toLowerCase() :
    'data';
  const startTime = new Date(selectedResult.start_time);

  return (
    <CSVLink
      data={selectedResult?.value.data}
      headers={selectedResultColumns}
      filename={`${name} ${format(startTime, `yyyy-MM-dd 'at' HH mm ss`)}.csv`}
      separator=";"
      target="_blank"
      className="query-results__header__toolbar__csv-link"
    >
      <MenuItem target="_blank" text="CSV" />
    </CSVLink>
  )
};

const DownloadResultBtn = React.memo(({
  selectedResult,
  block,
  show,
  selectedResultColumns
}: DownloadResultBtnProps) => {
  /*

   * @TODO - Download CSV link
   */
  if (!show) {
    return null;
  } else if (!(selectedResult && selectedResult?.value)) {
    return null;
  } else if (!(selectedResult && selectedResult?.value && selectedResult?.value.data)) {
    return null;
  }

  const xlsxLink = config.app.url + '/api/v1/block/' + block?.uid + '/export/' + selectedResult.key + '?type=xlsx';

  const contentMenu = (
    <Menu>
      <DownloadCSV
          block={block}
          selectedResult={selectedResult}
          selectedResultColumns={selectedResultColumns} />
      <MenuItem
        text="XLSX"
        target="_blank"
        href={xlsxLink}
      />
    </Menu>
  );

  return (
    <Popover
      content={contentMenu}
      position={Position.TOP_LEFT}
    >
      <Tooltip content="Download result">
        <Button className='bp3-button bp3-minimal'
                icon={<Icon icon={IconNames.DOWNLOAD} color={Colors.GRAY1} />} />
      </Tooltip>
    </Popover>
  )
});

export default DownloadResultBtn;
