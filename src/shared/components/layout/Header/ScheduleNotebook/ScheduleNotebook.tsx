import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Button,
  Popover,
  Position,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import ScheduleNotebookList from './ScheduleNotebookList';
import ScheduleNotebookForm from './ScheduleNotebookForm';
import { IUser, IWorkflow } from '../../../../models';

type Callback = (value?: any) => void;

enum Step {
  LIST,
  FORM,
  LOG,
}

interface IScheduleNotebookProps {
  users: IUser[];
  workflows: IWorkflow[];
  onSaveForm: Callback;
  onRemove: Callback;
  onRun: Callback;
  saving: boolean;
  loading: boolean;
}

interface IShareNotebookPopoverProps {
  users: IUser[];
  workflows: IWorkflow[];
  step: Step;
  setStep: Callback;
  onSaveForm: Callback;
  onRemove: Callback;
  onRun: Callback;
  saving: boolean;
  loading: boolean;
}

const ScheduleNotebookPopover: FunctionComponent<IShareNotebookPopoverProps> = ({
  step,
  setStep,
  users,
  workflows,
  saving,
  loading,
  onSaveForm,
  onRemove,
  onRun,
}: IShareNotebookPopoverProps) => {
  const [ save, setSave ] = useState<boolean>(false);
  const [ data, setData ] = useState<IWorkflow | null>(null);

  const onNew = () => {
    setStep(Step.FORM);
  };

  const onEdit = (data: IWorkflow) => {
    setData(data);
    setStep(Step.FORM);
  };

  const toggleActive = (data: IWorkflow) => {
    onSaveForm({
      uid: data?.uid || undefined,
      active: !data.active
    })
  };

  const onClose = () => {
    setStep(Step.LIST);
    setData(null);
  };

  const onSave = (formData?: any) => {
    setSave(true);

    onSaveForm({
      ...formData,
      uid: data?.uid || undefined, // uid is used for update
    });
    setData(null);
  };

  useEffect(() => {
    if (save && !saving) {
      // if save was clicked and it finished saving
      setSave(false);
      setStep(Step.LIST);
    }
  }, [ save, saving ]);

  const isList = step === Step.LIST;
  const isForm = step === Step.FORM;
  const isLog = step === Step.LOG;

  return (
    <div className="schedule-notebook-popover">
      {
        isList && (
          <ScheduleNotebookList
            workflows={workflows}
            loading={loading}
            onNew={onNew}
            onEdit={onEdit}
            onRemove={onRemove}
            onRun={onRun}
            toggleActive={toggleActive} />
        )
      }
      {
        isForm && (
          <ScheduleNotebookForm
            data={data}
            users={users}
            saving={saving}
            onCloseForm={onClose}
            onSaveForm={onSave} />
        )
      }
      {
        isLog && ( null )
      }
    </div>
  );
};

const ScheduleNotebook: FunctionComponent<IScheduleNotebookProps> = ({
  workflows,
  users,
  onSaveForm,
  onRemove,
  onRun,
  saving,
  loading,
}: IScheduleNotebookProps) => {
  const [ step, setStep ] = useState(Step.LIST);

  const text = workflows.length ? `Schedule (${workflows.length})` : 'Schedule';
  return (
    <Popover
        content={
          <ScheduleNotebookPopover
            workflows={workflows}
            users={users}
            onSaveForm={onSaveForm}
            onRemove={onRemove}
            onRun={onRun}
            saving={saving}
            loading={loading}
            step={step}
            setStep={setStep} />
        }
        position={Position.BOTTOM_LEFT}
      >
        <Button
          icon={IconNames.CALENDAR}
          text={text}
        />
    </Popover>
  )
};

export default ScheduleNotebook;
