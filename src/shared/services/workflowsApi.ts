import rison from 'rison';

import { api } from './Api';
import { IWorkflowToSave } from '../models';

export const getWorkflows = (notebookId: number | string) => {
  const requestParams = {
    filters: [
      {
        col: 'notebook_id',
        opr: 'eq',
        value: notebookId,
      }
    ]
  }

  return api.get(`/workflow/?q=${rison.encode(requestParams)}`).then(res => res.data);
};

export const getWorkflow = (workflowUid: string) => {
  return api.get(`/workflow/${workflowUid}`).then(res => res.data);
};

export const saveWorkflow = (workflow: IWorkflowToSave) => {
  const payload = {
    ...workflow,
    recipients: JSON.stringify(workflow.recipients)
  }

  return api.post(`/workflow/`, payload).then(res => res.data);
}

export const updateWorkflow = (uid: string, workflow: IWorkflowToSave) => {
  let payload = {
    ...workflow,
  }

  if (payload.recipients) {
    payload['recipients'] = JSON.stringify(workflow.recipients);
  }

  return api.put(`/workflow/${uid}`, payload).then(res => res.data);
}

export const removeWorkflow = (uid: string) => {
  return api.delete(`/workflow/${uid}`).then(res => res.data);
}

export const runWorkflow = (uid: string) => {
  return api.post(`/workflow/${uid}/run`).then(res => res.data);
}
