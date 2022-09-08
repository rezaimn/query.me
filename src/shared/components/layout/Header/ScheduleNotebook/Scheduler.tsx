import React, {
  Fragment,
  FunctionComponent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
} from 'react';
import {
  Callout,
  Button,
  ControlGroup,
  Divider,
  FormGroup,
  Icon,
  Label,
  Menu,
  MenuItem,
  Popover,
  Position,
  Tag,
} from '@blueprintjs/core';
import {
  DateInput
} from '@blueprintjs/datetime';
import {
  IconNames
} from '@blueprintjs/icons';

import EndDate from './EndDate';
import RepeatInterval, {
  Yearly,
  Monthly,
  Weekly,
  Daily,
  Hourly,
} from './RepeatInterval';

import {
  DEFAULT_DATE_FORMAT,
  formatDate,
  parseDate,
  isDate,
} from './utils';
import {
  // actions
  setSchedulerKeyValue,
  schedulerReducer,
  setSchedulerRRule,
  setError,
  initialSchedulerState,
} from './store/scheduler';
import { Freq } from './constants';
import ShowNextSchedules from './ShowNextSchedules';
import HelpText from './DateTimeHelpText';

type Callback = (value: any) => any;

interface ISchedulerProps {
  value: string | null | undefined,
  onChange: Callback;
}

const Scheduler = forwardRef(({
  value,
  onChange: setRRule
}: ISchedulerProps, ref: any) => {
  const [ state, dispatch ] = useReducer(schedulerReducer, initialSchedulerState);

  const onChange = (key: string, transformFn?: Callback) => (value: any) => {
    dispatch(setSchedulerKeyValue(key,
      transformFn ? transformFn(value) : value)
    );
  };

  useEffect(() => {
    /*
     * on load, if set
     */
    if (value && !state.rrule) {
      dispatch(setSchedulerRRule(value));
    }
  }, [ value, state.rrule ]);

  useEffect(() => {
    if (state.rrule) {
      dispatch(setError(''));
    }

    setRRule(state.rrule);
  }, [ state.rrule ]);

  useImperativeHandle(ref, () => ({
    validate() {
      const isValid = state.rrule.length > 0;

      if (!isValid) {
        dispatch(setError('Invalid schedule.'));
      }
      return isValid;
    }
  }));

  const { freq } = state;

  const isHourly = freq == Freq.HOURLY;
  const isDaily = freq == Freq.DAILY;
  const isWeekly = freq == Freq.WEEKLY;
  const isMonthly = freq == Freq.MONTHLY;
  const isYearly = freq == Freq.YEARLY;

  return (
    <Fragment>
      <div className="scheduler-label">
        <Icon icon={IconNames.CALENDAR}/> Schedule:
      </div>
      <div className="scheduler-form">
        <div>
          <ControlGroup fill={true}>
            <FormGroup label="Start Date:" inline={true}>
              <DateInput
                value={state.startDate}
                formatDate={formatDate}
                parseDate={parseDate}
                placeholder={DEFAULT_DATE_FORMAT}
                highlightCurrentDay={true}
                onChange={onChange('startDate')}
                dayPickerProps={{
                  firstDayOfWeek: 1
                }}
              />
              <HelpText />
            </FormGroup>
          </ControlGroup>
          <ControlGroup fill={true} className="scheduler-form__repeat_end-date">
            <RepeatInterval
              freq={freq}
              onChange={onChange} />
            { isYearly && <Yearly
              yearlyOn={state.yearlyOn}
              yearMonth={state.yearMonth}
              yearMonthDay={state.yearMonthDay}
              yearMonthRelativeDay={state.yearMonthRelativeDay}
              yearMonthWeekDay={state.yearMonthWeekDay}
              onChange={onChange} />
            }
            { isMonthly && <Monthly
              interval={state.interval}
              monthlyOn={state.monthlyOn}
              monthDay={state.monthDay}
              monthRelativeDay={state.monthRelativeDay}
              monthWeekDay={state.monthWeekDay}
              onChange={onChange} />
            }
            { isWeekly && <Weekly
              interval={state.interval}
              weekdays={state.weekdays}
              onChange={onChange} />
            }
            { isDaily && <Daily interval={state.interval} onChange={onChange('interval')} /> }
            { isHourly && <Hourly interval={state.interval} onChange={onChange('interval')} /> }
            <EndDate
              endOption={state.endOption}
              endAfter={state.endAfter}
              endOnDate={state.endOnDate}
              onChange={onChange} />
          </ControlGroup>
          <div className="input-error">
            {state.error}
          </div>
          <Popover
            disabled={!state.rrule}
            content={<ShowNextSchedules rrule={state.rrule} />}
            position={Position.TOP_LEFT} >
            <Button
              className="preview-scheduled-runs"
              disabled={!state.rrule}
              minimal={true}
              text="Preview next scheduled runs"
              icon={IconNames.EYE_OPEN} />
          </Popover>
        </div>
      </div>
    </Fragment>
  );
});

export default Scheduler;
