import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {
  Button,
  Intent,
} from '@blueprintjs/core';
import {
  IconNames
} from '@blueprintjs/icons';

import SelectAction from './SelectAction';
import SelectRecipients from './SelectRecipients';
import Scheduler from './Scheduler';
import { IUser, IWorkflow } from '../../../../models';

type Callback = (value?: any) => void;

interface IScheduleNotebookFormProps {
  data: IWorkflow | null;
  onRecipientsChange?: Callback;
  onScheduleChange?: Callback;
  users: IUser[];
  onCloseForm: Callback;
  onSaveForm: Callback;
  saving: boolean;
}

const ScheduleNotebookForm: FunctionComponent<IScheduleNotebookFormProps> = ({
  data,
  onCloseForm,
  onSaveForm,
  users,
  saving,
}: IScheduleNotebookFormProps) => {
  const [ recipients, setRecipients ] = useState<string[]>();
  const [ rrule, setRRule ] = useState<string>('');

  useEffect(() => {
    if (data) {
      setRecipients(data.recipients_json);
      setRRule(data.rrule);
    }
  }, [ data ]);

  const recipientsRef = useRef();
  const schedulerRef = useRef();

  const onSaveFormValidate = () => {
    const recipientsCurrent = recipientsRef.current as any;
    const schedulerCurrent = schedulerRef.current as any;

    if (
      (recipientsCurrent && recipientsCurrent.validate()) &&
      (schedulerCurrent && schedulerCurrent.validate())) {
      onSaveForm({
        recipients,
        rrule,
      });
    }
  };

  return (
    <div className="schedule-notebook-popover__form">
      <div className="schedule-notebook-popover__form__header">
        <h4 className="bp3-heading">Scheduled Execution</h4>
      </div>
      <div className="schedule-notebook-popover__form__select-action">
        <SelectAction />
      </div>
      <div className="schedule-notebook-popover__form__select-recipients">
        <SelectRecipients
          value={recipients}
          ref={recipientsRef}
          onChange={setRecipients}
          users={users} />
      </div>
      <div className="schedule-notebook-popover__form__scheduler">
        <Scheduler
          value={rrule}
          ref={schedulerRef}
          onChange={setRRule} />
      </div>
      <div className="schedule-notebook-popover__form__footer">
        <Button
          onClick={onCloseForm}
          className="cancel">Cancel</Button>
        <Button
          loading={saving}
          onClick={onSaveFormValidate}
          intent={Intent.PRIMARY}>Save</Button>
      </div>
    </div>
  );
};

export default ScheduleNotebookForm;
