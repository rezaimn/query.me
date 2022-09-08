import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Spinner} from '@blueprintjs/core';

import {IState} from '../../../../store/reducers';
import {ApiStatus} from '../../../../models';
import {loadUsers} from '../../../../store/actions/userActions';
import ScheduleNotebook from './ScheduleNotebook';
import {
  loadWorkflows,
  removeWorkflow,
  saveWorkflow,
  triggerRunWorkflow,
  updateWorkflow,
  unsetWorkflows,
} from '../../../../store/actions/workflowActions';
import './ScheduleNotebook.scss';

interface IScheduleNotebookProps {
  uid: string | undefined | null;
  id: number | undefined | null;
}

interface IFormValues {
  uid?: string; // in case of edit
  rrule: string;
  recipients: string[];
}

const isLoading = (value: ApiStatus | null) => value === ApiStatus.LOADING;

const ScheduleNotebookContainer: FunctionComponent<IScheduleNotebookProps> = ({ uid, id }: IScheduleNotebookProps) => {
  const users = useSelector((state: IState) => state.users.users);
  const workflows = useSelector((state: IState) => state.workflows.workflows);
  const loadingWorkflows = useSelector((state: IState) => state.workflows.loadingListStatus);
  const loadingWorkflow = useSelector((state: IState) => state.workflows.loadingStatus);
  const savingWorkflow = useSelector((state: IState) => state.workflows.savingStatus);
  const dispatch = useDispatch();

  const loading = isLoading(loadingWorkflows) || isLoading(loadingWorkflow) || isLoading(savingWorkflow);

  useEffect(() => {
    if (!users.length) {
      dispatch(loadUsers({ page: 0, page_size: -1 }));
    }
  }, [ users ]);

  useEffect(() => {
    if (!workflows.length && id && loadingWorkflows !== ApiStatus.LOADED) {
      // load workflows for this notebook
      dispatch(loadWorkflows("" + id));
    }
  }, [ workflows, id ]);

  useEffect(() => {

    return () => {
      // unset workflows on unmount
      dispatch(unsetWorkflows());
    };
  }, [ ]);

  const onSaveForm = (data: IFormValues) => {
    if (id) {
      const { uid, ...rest } = data;
      if (uid) {
        // edit Workflow
        dispatch(updateWorkflow(uid, {
          ...rest,
        }));
      } else {
        // save Workflow
        dispatch(saveWorkflow({
          ...data,
          notebook_id: id
        }));
      }
    }
  };

  const onRemove = (uid: string) => {
    dispatch(removeWorkflow(uid));
  };

  const onRun = (uid: string) => {
    dispatch(triggerRunWorkflow(uid));
  };

  return (
    <div className="schedule-notebook">
      {
        !users.length ?
          <Spinner size={20} /> :
          <ScheduleNotebook
            workflows={workflows}
            users={users}
            saving={isLoading(savingWorkflow)}
            loading={loading}
            onSaveForm={onSaveForm}
            onRemove={onRemove}
            onRun={onRun} />
      }
    </div>
  )
};

export default ScheduleNotebookContainer;
