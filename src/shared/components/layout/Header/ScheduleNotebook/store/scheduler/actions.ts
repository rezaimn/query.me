export enum SchedulerActionTypes {
  SET_SCHEDULER_KEY_VALUE = 'scheduler/set_scheduler_key_value',
  SET_ERROR = 'scheduler/set_error',
  SET_SCHEDULER_RRULE = 'scheduler/set_scheduler_rrule',
}

// Interfaces

export interface ISetSchedulerKeyValueAction {
  type: SchedulerActionTypes.SET_SCHEDULER_KEY_VALUE,
  payload: {
    key: string,
    value: any,
  }
}

export interface ISetErrorAction {
  type: SchedulerActionTypes.SET_ERROR,
  payload: string;
}

export interface ISetSchedulerRRuleAction {
  type: SchedulerActionTypes.SET_SCHEDULER_RRULE,
  payload: string;
}

// Functions

export function setSchedulerKeyValue(key: string, value: any): ISetSchedulerKeyValueAction {
  return {
    type: SchedulerActionTypes.SET_SCHEDULER_KEY_VALUE,
    payload: {
      key,
      value
    }
  }
}

export function setError(error: string): ISetErrorAction {
  return {
    type: SchedulerActionTypes.SET_ERROR,
    payload: error
  }
}

export function setSchedulerRRule(rrule: string): ISetSchedulerRRuleAction {
  return {
    type: SchedulerActionTypes.SET_SCHEDULER_RRULE,
    payload: rrule
  }
}

export type SchedulerAction =
  ISetSchedulerKeyValueAction |
  ISetErrorAction |
  ISetSchedulerRRuleAction;
