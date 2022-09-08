import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Dialog,
  Divider,
  Icon,
  Intent,
  Menu,
  MenuItem,
  Popover,
  Position,
  Spinner,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { IWorkflow } from '../../../../models';
import { NoResult } from '../../../list';
import {
  DEFAULT_DATE_FORMAT,
  formatDate,
  rruleToText
} from './utils';
import ConfirmDialogComponent from '../../../dialogs/ConfirmDialog';

type Callback = (value?: any) => void;

interface IScheduleNotebookListProps {
  workflows: IWorkflow[];
  onNew: Callback;
  onEdit: Callback;
  toggleActive: Callback;
  onRemove: Callback;
  onRun: Callback;
  loading?: boolean;
}

interface IScheduleRow {
  workflow: IWorkflow;
  onEdit: Callback;
  toggleActive: Callback;
  onRemove: Callback;
  onRun: Callback;
}

interface IConfirmDialog {
  isOpen: boolean;
  onAction: Callback;
}

const showRecipients = (recipients: string[]) => {
  if (!recipients) {
    return '';
  }
  const totalRecipients = recipients.length;
  const firstRecipient = recipients[0];
  return (totalRecipients === 1) ?
    firstRecipient : firstRecipient + ` + ${totalRecipients - 1} more`;
}

const ScheduleRow = ({ workflow, onEdit, toggleActive, onRemove, onRun }: IScheduleRow) => {
  const ListItemMenu = () => {
    return (
      <Menu>
        <MenuItem
          text="Run now"
          onClick={() => onRun(workflow.uid)}
          icon={IconNames.PLAY} />
        <Divider />
        <MenuItem
          text="Edit"
          icon={IconNames.EDIT}
          onClick={() => onEdit(workflow)} />
        <MenuItem
          text={workflow.active ? 'Deactivate' : 'Activate'}
          icon={workflow.active ? IconNames.PAUSE : IconNames.PLAY}
          onClick={() => toggleActive(workflow)} />
        <Divider />
        <MenuItem
          text="Remove"
          icon={IconNames.TRASH}
          onClick={() => onRemove(workflow.uid)} />
      </Menu>
    )
  };

   // utc is set to false in formatDate because date from server is already in UTC
  const lastRun: string =
    workflow.last_run ? formatDate(new Date(workflow.last_run), DEFAULT_DATE_FORMAT, false) + ' UTC' : '-';

  return (
    <div className="list-item">
      <div className="list-item__title">
        <div>
          <ButtonGroup minimal={true}>
            <Icon icon={IconNames.MANUAL} />
            <Icon icon={IconNames.PLAY} />
            <Icon icon={IconNames.ENVELOPE} />
          </ButtonGroup>
          <span className="list-item__title__description">Send notebook via Email</span>
        </div>
        <Popover
          content={<ListItemMenu />}
          position={Position.BOTTOM_LEFT}
          captureDismiss={true}>
          <Button
            minimal={true}
            icon={IconNames.MORE} />
        </Popover>
      </div>
      <div className="list-item__info-line"><span className="label">SCHEDULE</span>{rruleToText(workflow.rrule)}</div>
      <div className="list-item__info-line"><span className="label">CONTENTS</span>Entire notebook</div>
      <div className="list-item__info-line">
        <span className="label">RECIPIENTS</span>{showRecipients(workflow.recipients_json)}
      </div>
      <div className="list-item__info-line"><span className="label">LAST RUN</span>{lastRun}</div>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onAction }: IConfirmDialog) => {
  return (
    <Dialog
      autoFocus={true}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      enforceFocus={true}
      isOpen={isOpen}
      onClose={() => onAction(false) }
      usePortal={true}
      title="Delete schedule"
      icon="help">
        <ConfirmDialogComponent
          message={'Do you want to delete this schedule?'}
          pending={false}
          onConfirm={() => onAction(true)}
          onClose={() => onAction(false) } />
    </Dialog>
  );
};

const ScheduleNotebookList: FunctionComponent<IScheduleNotebookListProps> = ({
  onNew,
  onEdit,
  onRemove,
  toggleActive,
  onRun,
  workflows,
  loading = false,
}: IScheduleNotebookListProps) => {
  const [ open, setOpen ] = useState<boolean>(false);
  const [ uid, setUid ] = useState<string>(''); // used for remove

  const noWorkflows = !workflows.length;

  const onConfirmAction = (remove: boolean) => {
    if (remove) {
      onRemove(uid);
    }
    setUid(''); // unset it
    setOpen(false);
  };

  const onScheduleRemove = (uid: string) => {
    setUid(uid);
    setOpen(true);
  };

  return (
    <div className="schedule-notebook-popover__list">
      <div className="schedule-notebook-popover__list__header">
        <div>
          <h4 className="bp3-heading list-header-title">Manage Schedules</h4>
        </div>
        <div className="list-header-button">
          <Button
            onClick={onNew}
            intent={Intent.PRIMARY}
            icon={IconNames.ADD}>New</Button>
        </div>
      </div>
      <div className="schedule-notebook-popover__list__content">
        {
          loading ?
            <Spinner size={20} /> :
            noWorkflows ?
              <NoResult
                icon={IconNames.CALENDAR}
                title="No Schedules found"
                description="Click on the 'New' button to create your first schedule." /> :
              workflows.map((workflow: IWorkflow) =>
                <ScheduleRow
                  onEdit={onEdit}
                  onRemove={onScheduleRemove}
                  onRun={onRun}
                  toggleActive={toggleActive}
                  workflow={workflow} />
              )
        }
        <ConfirmDialog
          isOpen={open}
          onAction={onConfirmAction} />
      </div>
    </div>
  )
};

export default ScheduleNotebookList;
