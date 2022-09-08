import { Frequency } from 'rrule';

import {SchedulerAction, SchedulerActionTypes} from './actions';
import {
  EndOption,
  Freq,
  WEEK_DAYS_SHORT,
} from '../../constants';
import {
  dateRoundUpHour,
  buildRRule,
  fromStrToRRule
} from '../../utils';

export const initialSchedulerState: ISchedulerState = {
  rrule: "",
  startDate: dateRoundUpHour(),
  freq: Freq.YEARLY,
  interval: 1,
  weekdays: [],
  monthlyOn: 1,
  monthDay: 1,
  monthRelativeDay: 1,
  monthWeekDay: "MO",
  yearlyOn: 1,
  yearMonth: "1",
  yearMonthDay: 1,
  yearMonthRelativeDay: 1,
  yearMonthWeekDay: "MO",
  endOption: EndOption.NEVER,
  endAfter: 1,
  endOnDate: dateRoundUpHour(),
  error: '',
}

export interface ISchedulerState {
  rrule: string;
  startDate: Date;
  freq: Freq;
  // common
  interval: number; // used for Hourly, Daily, Weekly, Monthly
  // weekly
  weekdays: string[],
  // monthly
  monthlyOn: string | number; // monthly "on" or "on the"
  monthDay: string | number;
  monthRelativeDay: string | number;
  monthWeekDay: string;
  // yearly
  yearlyOn: string | number; // yearly "on" or "on the"
  yearMonth: string;
  yearMonthDay: string | number;
  yearMonthRelativeDay: string | number;
  yearMonthWeekDay: string;

  endOption: EndOption;
  endAfter: string | number;
  endOnDate: Date;
  error: string;
}

export function schedulerReducer(
  state: ISchedulerState = initialSchedulerState,
  action: SchedulerAction): ISchedulerState {

  switch (action.type) {
    case SchedulerActionTypes.SET_SCHEDULER_KEY_VALUE:
      const { key, value } = action.payload;

      if (state.hasOwnProperty(key)) {
        const newState = {
          ...state,
          [key]: value,
        };

        return {
          ...newState,
          rrule: buildRRule(newState),
        }
      }
      return state;

    case SchedulerActionTypes.SET_ERROR:
      return {
          ...state,
          error: action.payload,
        }

    case SchedulerActionTypes.SET_SCHEDULER_RRULE: {
      const rruleObj = fromStrToRRule(action.payload);

      const newState = {
        ...state,
        rrule: action.payload,
      }

      try {
        if (rruleObj) {
          const { options } = rruleObj;

          const freq = Frequency[options.freq];

          newState['startDate'] = options.dtstart;
          newState['freq'] = freq as Freq;
          switch (freq) {
            case Freq.YEARLY:
              if (options.bymonth.length && options.bymonthday.length) {
                newState['yearlyOn'] = '1'; // On
                newState['yearMonth'] = '' + options.bymonth[0];
                newState['yearMonthDay'] = '' + options.bymonthday[0];
              } else if (options.bymonth.length && options.byweekday.length && options.bysetpos.length) {
                newState['yearlyOn'] = '2'; // On
                newState['yearMonth'] = '' + options.bymonth[0];
                newState['yearMonthRelativeDay'] = '' + options.bysetpos[0];
                newState['yearMonthWeekDay'] = WEEK_DAYS_SHORT[options.byweekday[0]];
              }
              break;
            case Freq.MONTHLY:
              newState['interval'] = options.interval;
              if (options.bymonthday.length) {
                newState['monthlyOn'] = '1'; // on day
                newState['monthDay'] = '' + options.bymonthday[0];
              } else if (options.byweekday.length && options.bysetpos.length) {
                newState['monthlyOn'] = '2'; // on the
                newState['monthRelativeDay'] = '' + options.bysetpos[0];
                newState['monthWeekDay'] = WEEK_DAYS_SHORT[options.byweekday[0]];
              }
              break;
            case Freq.WEEKLY:
              newState['interval'] = options.interval;
              newState['weekdays'] = options
                .byweekday.map((id: number) => WEEK_DAYS_SHORT[id]); // 0 - Mo, 1 - Tu, etc.
              break;
            case Freq.DAILY:
            case Freq.HOURLY:
              newState['interval'] = options.interval;
          }

          if (options.count) {
            newState['endOption'] = EndOption.AFTER;
            newState['endAfter'] = options.count;
          } else if (options.until) {
            newState['endOption'] = EndOption.ON_DATE;
            newState['endOnDate'] = options.until;
          } else {
            newState['endOption'] = EndOption.NEVER;
          }
        }
      } catch (e) {
        console.log('ERROR: could not parse RRule:', action.payload);
      }

      return newState;
    }
    default:
      return state;
  }
}
