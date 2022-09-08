export enum EndOption {
  NEVER = "1",
  AFTER = "2",
  ON_DATE = "3",
}

export enum Freq {
  YEARLY = "YEARLY",
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY",
  DAILY = "DAILY",
  HOURLY = "HOURLY",
}

export const WEEK_DAYS_SHORT = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

export const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Jan - Dec
