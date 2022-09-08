import React, { FunctionComponent } from 'react';
import { RRule } from 'rrule';
import {
  Icon,
  Tooltip
} from '@blueprintjs/core';

import { formatDate } from './utils';

interface IShowNextSchedules {
  rrule?: string;
}

const filterFn = (date: Date, index: number) => index < 10;

const ShowNextSchedules: FunctionComponent<IShowNextSchedules> = ({
  rrule,
}: IShowNextSchedules) => {
  if (!rrule) {
    return null;
  }

  let rruleObj = null;
  try {
    rruleObj = RRule.fromString(rrule);
  } catch (e) {
    return null;
  }

  return (
    <div>
      <table className='bp3-html-table bp3-html-table-striped bp3-small'>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Next Scheduled Runs</th>
          </tr>
        </thead>
        <tbody>
        {
          rruleObj && rruleObj.all(filterFn).map((date: Date, index: number) => {
              return (
                <tr key={index}>
                  <td>{(index + 1)}</td>
                  <td>{formatDate(date, 'YYYY-MM-DD HH:mm:00')}</td>
                </tr>
              )
            }
          )
        }
        </tbody>
      </table>
    </div>
  );
};

export default ShowNextSchedules;
