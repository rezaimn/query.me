import { IItem } from '../../../select';
import {
  EndOption,
  Freq,
} from './constants';

export const endDateOptions: IItem[] = [
  {
    label: 'Never',
    value: EndOption.NEVER
  },
  {
    label: 'After',
    value: EndOption.AFTER
  },
  {
    label: 'On date',
    value: EndOption.ON_DATE
  }
];

export const freqOptions: IItem[] = [
  {
    label: 'Yearly',
    value: Freq.YEARLY
  },
  {
    label: 'Monthly',
    value: Freq.MONTHLY
  },
  {
    label: 'Weekly',
    value: Freq.WEEKLY
  },
  {
    label: 'Daily',
    value: Freq.DAILY
  },
  {
    label: 'Hourly',
    value: Freq.HOURLY
  },
];

const createArrayFromOneUntil = (until: number) => Array.from(Array(until).keys(), (v => v + 1))

export const createMonthDaysOptions = (until: number): IItem[] =>
  createArrayFromOneUntil(until).map((v: number) => ({
    label: "" + v,
    value: "" + v,
  }));

export const relativeDaysOptions: IItem[] = [
  {
    label: "First",
    value: "1"
  },
  {
    label: "Second",
    value: "2"
  },
  {
    label: "Third",
    value: "3"
  },
  {
    label: "Fourth",
    value: "4"
  },
  {
    label: "Last",
    value: "-1"
  },
];

export const weekdaysOptions: IItem[] = [
  {
    label: "Monday",
    value: "MO"
  },
  {
    label: "Tuesday",
    value: "TU"
  },
  {
    label: "Wednesday",
    value: "WE"
  },
  {
    label: "Thursday",
    value: "TH"
  },
  {
    label: "Friday",
    value: "FR"
  },
  {
    label: "Saturday",
    value: "SA"
  },
  {
    label: "Sunday",
    value: "SU"
  },
  {
    label: "Day",
    value: "MO,TU,WE,TH,FR,SA,SU"
  },
  {
    label: "Weekday",
    value: "MO,TU,WE,TH,FR"
  },
  {
    label: "Weekend",
    value: "SA,SU"
  },
];

export const monthsShortOptions: IItem[] = [
  {
    label: 'Jan',
    value: '1',
  },
  {
    label: 'Feb',
    value: '2',
  },
  {
    label: 'Mar',
    value: '3',
  },
  {
    label: 'Apr',
    value: '4',
  },
  {
    label: 'May',
    value: '5',
  },
  {
    label: 'Jun',
    value: '6',
  },
  {
    label: 'Jul',
    value: '7',
  },
  {
    label: 'Aug',
    value: '8',
  },
  {
    label: 'Sep',
    value: '9',
  },
  {
    label: 'Oct',
    value: '10',
  },
  {
    label: 'Nov',
    value: '11',
  },
  {
    label: 'Dec',
    value: '12',
  },
];
