import React, { Fragment, FunctionComponent } from 'react';
import {
  ControlGroup,
  FormGroup,
  NumericInput,
} from '@blueprintjs/core';
import {
  DateInput,
} from '@blueprintjs/datetime';

import { SimpleSelect } from '../../../select';
import HelpText from './DateTimeHelpText';
import {
  DEFAULT_DATE_FORMAT,
  formatDate,
  parseDate
} from './utils';
import {
  EndOption,
} from './constants';
import {
  endDateOptions
} from './selectOptions';

type Callback = (value: any) => any;
type OnChangeCallback = (key: string, transformFn?: Callback) => (value: any) => void;



interface IEndDateProps {
  endOption: EndOption;
  endAfter: string | number;
  endOnDate: Date;
  onChange: OnChangeCallback;
}

const OnDate = ({ endOnDate, onChange }: any) => {
  return (
    <Fragment>
      <DateInput
      value={endOnDate}
      formatDate={formatDate}
      parseDate={parseDate}
      placeholder={DEFAULT_DATE_FORMAT}
      highlightCurrentDay={true}
      onChange={onChange}
      dayPickerProps={{
        firstDayOfWeek: 1
      }}
     />
     <HelpText />
    </Fragment>
  );
};

const After = ({ endAfter, onChange }: any) => {
  return (
    <NumericInput
      min={1}
      defaultValue={endAfter}
      buttonPosition={"none"}
      onValueChange={onChange} />
  )
};

const EndDate: FunctionComponent<IEndDateProps> = ({
  endOption = EndOption.NEVER,
  endAfter,
  endOnDate,
  onChange,
}: IEndDateProps) => {
  const getSelectValue = (value: any) => value.value;

  return (
    <Fragment>
      <FormGroup label="End:" inline={true}>
        <SimpleSelect
          selected={endOption}
          disabled={false}
          onChange={onChange('endOption', getSelectValue)}
          options={endDateOptions}
          buttonProps={{
            minimal: false,
          }} />
      </FormGroup>
      <div className="end-date-options">
        { (endOption === EndOption.AFTER) && <After endAfter={endAfter} onChange={onChange('endAfter')} /> }
        { (endOption === EndOption.ON_DATE) && <OnDate endOnDate={endOnDate} onChange={onChange('endOnDate')} /> }
      </div>
    </Fragment>
  );
};

export default EndDate;
