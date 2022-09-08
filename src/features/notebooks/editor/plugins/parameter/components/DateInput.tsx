import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { DateInput as BPDateInput } from '@blueprintjs/datetime';

type OnChangeCallback = (value: any) => void;

interface IDateInput {
  value: any;
  editable: boolean;
  onChange: OnChangeCallback;
}

const FORMAT = 'YYYY-MM-DD';

export const DATE_INPUT_TYPE = 'datetime';

const isDate = (date: any) => {
  return !isNaN(new Date(date).getTime());
};

const DateInput = ({ value, editable, onChange }: IDateInput) => {
  const formatDate = useCallback((date: Date) => moment(date).format(FORMAT), []);
  const parseDate = useCallback((date: string) => moment(date, FORMAT).toDate(), []);
  const defaultValue = useMemo(() => isDate(value) ? new Date(value) : new Date(), [ value ]);
  const onValueChange = useCallback((value: any) => onChange(moment(value).format(FORMAT)), []);

  return (
    <div>
      <BPDateInput
        inputProps={{
          large: true
        }}
        disabled={!editable}
        formatDate={formatDate}
        parseDate={parseDate}
        placeholder={FORMAT}
        highlightCurrentDay={true}
        defaultValue={defaultValue}
        onChange={onValueChange}
      />
    </div>
  );
};

export const MemoizedDateInput = React.memo(DateInput);
