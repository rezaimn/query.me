export interface IWorkflow {
  id: number;
  uid: string;
  name?: string;
  profile?: string;
  active?: boolean;
  notebook_id: number;
  rrule: string;
  recipients: string;
  recipients_json: string[];
  last_run?: string;
  next_run?: string;
}

export interface IWorkflowToSave {
  // uid?: string; // only in case of update
  name?: string;
  profile?: string;
  active?: boolean;
  notebook_id?: number; // can be empty in case of an update
  rrule?: string;
  recipients?: string | string[]; // this is saved as a string to the BE
}
