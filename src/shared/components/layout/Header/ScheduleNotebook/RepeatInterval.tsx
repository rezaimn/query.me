import React, { Fragment, FunctionComponent } from 'react';
import {
  Button,
  ButtonGroup,
  ControlGroup,
  FormGroup,
  Intent,
  NumericInput,
  Radio,
} from '@blueprintjs/core';

import { SimpleSelect } from '../../../select';
import {
  Freq,
  MONTH_DAYS,
  WEEK_DAYS_SHORT
} from './constants';
import {
  createMonthDaysOptions,
  freqOptions,
  monthsShortOptions,
  relativeDaysOptions,
  weekdaysOptions,
} from './selectOptions';

type Callback = (value: any) => any;
type OnChangeCallback = (key: string, transformFn?: Callback) => (value: any) => void;

interface IRepeatIntervalProps {
  freq: string;
  onChange: OnChangeCallback;
}

const getSelectValue = (value: any) => value.value;
const getRadioValue = (value: any) => value.target.value;

export const Yearly = ({
  yearlyOn,
  yearMonth,
  yearMonthDay,
  yearMonthRelativeDay,
  yearMonthWeekDay,
  onChange
}: any) => {
  // yearMonth - value from 1 (Jan) to 12 (Dec)
  const yearMonthInt = (parseInt(yearMonth) - 1) || 0;

  return (
    <Fragment>
      <div className="yearly-schedule">
        <FormGroup inline={true}>
          <Radio
            label="On"
            value={1}
            name="year_type"
            checked={yearlyOn.toString() === "1"}
            onChange={onChange('yearlyOn', getRadioValue)} />
          <SimpleSelect
            selected={yearMonth}
            disabled={false}
            onChange={onChange('yearMonth', getSelectValue)}
            options={monthsShortOptions}
            buttonProps={{
              minimal: false,
            }}/>
          <SimpleSelect
            selected={yearMonthDay}
            disabled={false}
            onChange={onChange('yearMonthDay', getSelectValue)}
            options={createMonthDaysOptions(MONTH_DAYS[yearMonthInt])} /* dynamic based on month */
            buttonProps={{
              minimal: false,
            }}/>
        </FormGroup>
        <FormGroup inline={true}>
        <Radio
          label="On the"
          value={2}
          name="year_type"
          checked={yearlyOn.toString() === "2"}
          onChange={onChange('yearlyOn', getRadioValue)} />
        <SimpleSelect
          selected={yearMonthRelativeDay}
          disabled={false}
          onChange={onChange('yearMonthRelativeDay', getSelectValue)}
          options={relativeDaysOptions}
          buttonProps={{
            minimal: false,
          }}/>
        <SimpleSelect
          selected={yearMonthWeekDay}
          disabled={false}
          onChange={onChange('yearMonthWeekDay', getSelectValue)}
          options={weekdaysOptions}
          buttonProps={{
            minimal: false,
          }}/>
        <span> of </span>
        <SimpleSelect
          selected={yearMonth}
          disabled={false}
          onChange={onChange('yearMonth', getSelectValue)}
          options={monthsShortOptions}
          buttonProps={{
            minimal: false,
          }}/>
      </FormGroup>
      </div>
    </Fragment>
  )
};

export const Monthly = ({
  interval,
  monthlyOn,
  monthDay,
  monthRelativeDay,
  monthWeekDay,
  onChange,
}: any) => {
  return (
    <Fragment>
      <ControlGroup fill={true}>
        <FormGroup
          label="Every"
          inline={true}>
          <NumericInput
            min={1}
            defaultValue={interval}
            buttonPosition={"none"}
            onValueChange={onChange('interval')}/>
        </FormGroup>
        <span className="info-text"> month(s)</span>
      </ControlGroup>
      <div className="monthly-schedule">
        <FormGroup inline={true}>
          <Radio
            label="On day"
            value={1}
            checked={monthlyOn.toString() === "1"}
            name="month_type"
            onChange={onChange('monthlyOn', getRadioValue)} />
          <SimpleSelect
            selected={monthDay}
            disabled={false}
            onChange={onChange('monthDay', getSelectValue)}
            options={createMonthDaysOptions(31)}
            buttonProps={{
              minimal: false,
            }}/>
        </FormGroup>
        <FormGroup inline={true}>
          <Radio
            label="On the"
            value={2}
            checked={monthlyOn.toString() === "2"}
            name="month_type"
            onChange={onChange('monthlyOn', getRadioValue)} />
          <SimpleSelect
            selected={monthRelativeDay}
            disabled={false}
            onChange={onChange('monthRelativeDay', getSelectValue)}
            options={relativeDaysOptions}
            buttonProps={{
              minimal: false,
            }}/>
          <SimpleSelect
            selected={monthWeekDay}
            disabled={false}
            onChange={onChange('monthWeekDay', getSelectValue)}
            options={weekdaysOptions}
            buttonProps={{
              minimal: false,
            }}/>
        </FormGroup>
      </div>

    </Fragment>
  );
};

export const Weekly = ({ interval, weekdays, onChange }: any) => {
  const onChangeWeekday = (weekdays: string[], day: string) => {
    let newWeekdays = [...weekdays];
    if (weekdays.indexOf(day) >= 0) {
      // remove
      newWeekdays = newWeekdays.filter(d => d !== day);
    } else {
      // add
      newWeekdays.push(day);
    }
    onChange("weekdays")([...newWeekdays]);
  }

  return (
    <Fragment>
      <ControlGroup fill={true}>
        <FormGroup
          label="Every"
          inline={true}>
          <NumericInput
            min={1}
            defaultValue={interval}
            buttonPosition={"none"}
            onValueChange={onChange('interval')}/>
        </FormGroup>
        <span className="info-text"> week(s)</span>
      </ControlGroup>
      <FormGroup className="weekdays">
        <ButtonGroup large={false}>
          {
            WEEK_DAYS_SHORT.map((day: string) => {
              const intent = weekdays.indexOf(day) >= 0 ? Intent.PRIMARY : Intent.NONE

              return (
                <Button
                  text={day}
                  key={day}
                  intent={intent}
                  onClick={() => onChangeWeekday(weekdays, day)} />
              );
            })
          }
        </ButtonGroup>
      </FormGroup>
    </Fragment>
  )
};

export const Daily = ({ interval, onChange }: any) => {
  return (
    <ControlGroup fill={true}>
      <FormGroup
        label="Every"
        inline={true}>
        <NumericInput
          min={1}
          defaultValue={interval}
          buttonPosition={"none"}
          onValueChange={onChange}/>
      </FormGroup>
      <span className="info-text"> day(s)</span>
    </ControlGroup>
  )
};

export const Hourly = ({ interval, onChange }: any) => {
  return (
    <ControlGroup fill={true}>
      <FormGroup
        label="Every"
        inline={true}>
        <NumericInput
          min={1}
          defaultValue={interval}
          buttonPosition={"none"}
          onValueChange={onChange}/>
      </FormGroup>
      <span className="info-text"> hour(s)</span>
    </ControlGroup>
  );
};

const RepeatInterval: FunctionComponent<IRepeatIntervalProps> = ({
  freq = Freq.YEARLY,
  onChange
}: IRepeatIntervalProps) => {
  return (
    <FormGroup label="Repeat:" inline={true}>
      <SimpleSelect
        selected={freq}
        disabled={false}
        onChange={onChange('freq', getSelectValue)}
        options={freqOptions}
        buttonProps={{
          minimal: false,
        }}/>
    </FormGroup>
  );
};

export default RepeatInterval;
