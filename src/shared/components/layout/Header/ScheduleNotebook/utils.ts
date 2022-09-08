import moment from 'moment';
import { RRule } from 'rrule';

import { EndOption, Freq } from './constants';

export const isDate = (date: any) => !isNaN(new Date(date).getTime());

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm';

export const formatDate = (date: Date, format: string = DEFAULT_DATE_FORMAT, utc: boolean = true) => {
  if (utc) {
    return moment(date).utc().format(format);
  }
  return moment(date).format(format);
}

export const parseDate = (date: string, format: string = DEFAULT_DATE_FORMAT): Date => new Date(date);

export const dateRoundUpHour = (date: Date | null = null) => {
  if (date === null) {
    date = new Date(); // now
  }
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDay(),
    date.getHours(),
    0,
    0,
  );
}

const RRULE_DATE_FORMAT = 'YYYYMMDDTHHmm00';

const buildStartDate = (startDate: Date, tz?: string) => {
  let utc = 'Z';

  return `DTSTART:${formatDate(startDate, RRULE_DATE_FORMAT)}${utc}`;
};

const buildEnd = (option: number | string, after: number | string, endDate: Date): string => {
  switch (option) {
    case EndOption.AFTER:
      return `COUNT=${after}`;
    case EndOption.ON_DATE:
      const utc = 'Z';
      return `UNTIL=${formatDate(endDate, RRULE_DATE_FORMAT)}${utc}`;
  }
  return '';
}

export const buildRRule = (data: any) => {
  const {
    freq,
    interval,

    weekdays,

    monthlyOn,
    monthDay,
    monthRelativeDay,
    monthWeekDay,

    yearlyOn,
    yearMonth,
    yearMonthDay,
    yearMonthRelativeDay,
    yearMonthWeekDay,
  } = data;

  const startDate = buildStartDate(data.startDate);

  const items: string[] = [];
  items.push(`FREQ=${freq}`);
  switch (freq) {
    case Freq.YEARLY:
      if (parseInt(yearlyOn) === 1 && yearMonth && yearMonthDay) {
        items.push(`BYMONTH=${yearMonth}`);
        items.push(`BYMONTHDAY=${yearMonthDay}`);
      } else if (parseInt(yearlyOn) === 2 && yearMonthRelativeDay && yearMonthWeekDay && yearMonth) {
        items.push(`BYSETPOS=${yearMonthRelativeDay}`);
        items.push(`BYDAY=${yearMonthWeekDay}`);
        items.push(`BYMONTH=${yearMonth}`);
      }
      break;
    case Freq.MONTHLY:
      items.push(`INTERVAL=${interval}`);

      if (parseInt(monthlyOn) === 1 && monthDay) { // on n-th day of thee month
        items.push(`BYMONTHDAY=${monthDay}`);
      } else if (parseInt(monthlyOn) === 2 && monthRelativeDay && monthWeekDay) { // on relative month day / week day
        items.push(`BYSETPOS=${monthRelativeDay}`);
        items.push(`BYDAY=${monthWeekDay}`);
      }
      break;
    case Freq.WEEKLY:
      items.push(`INTERVAL=${interval}`);

      if (weekdays.length) {
        items.push(`BYDAY=${weekdays.join(',')}`);
      }
      break;
    case Freq.DAILY:
    case Freq.HOURLY:
      items.push(`INTERVAL=${interval}`);
      break;
  }
  const end = buildEnd(data.endOption, data.endAfter, data.endOnDate);
  if (end) {
    items.push(end);
  }

  const rrule = items.join(';');

  return `${startDate};` + "\n" + `RRULE:${rrule}`;
};

export const rruleNextRun = (rrule: string): string | null => {
  if (!rrule) {
    return null;
  }

  try {
    const rruleObj = RRule.fromString(rrule);

    return formatDate(rruleObj.after(new Date()), DEFAULT_DATE_FORMAT);
  } catch (e) {
    return null;
  }
};

export const rruleToText = (rrule: string): string | null => {
  if (!rrule) {
    return null;
  }

  try {
    const rruleObj = RRule.fromString(rrule);

    return rruleObj.toText();
  } catch (e) {
    return null;
  }
};

export const fromStrToRRule = (rrule: string): RRule | null => {
  try {
    return RRule.fromString(rrule);
  } catch (e) {
    return null;
  }
};
