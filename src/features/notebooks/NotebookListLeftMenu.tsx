import React, { FunctionComponent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon, Button, Colors, Dialog, Menu, Divider } from '@blueprintjs/core';
import { IconNames, IconName } from '@blueprintjs/icons';

import './NotebookListLeftMenu.scss';
import { IView } from '../../shared/models';
import { IState } from '../../shared/store/reducers';
import LeftMenuItem from '../../shared/components/layout/LeftMenuItem';
import ConfirmDialogComponent from '../../shared/components/dialogs/ConfirmDialog';
import ViewDialogComponent from '../../shared/components/dialogs/ViewDialog';
import { isGuest, isLoggedIn } from '../../shared/utils/auth';

type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;
type AddNotebookCallback = () => void;

type NotebookListLeftMenuComponentProps = {
  views: IView[];
  viewsLoading: boolean;
  viewSaving: boolean;
  viewRemoving: boolean;
  onSaveView: SaveViewCallback;
  onRemoveView: RemoveViewCallback;
  onAddNotebook: AddNotebookCallback;
};

const NotebookListLeftMenuComponent: FunctionComponent<NotebookListLeftMenuComponentProps> = ({
  views, viewsLoading, viewSaving, viewRemoving, onSaveView, onRemoveView, onAddNotebook
}: NotebookListLeftMenuComponentProps) => {
  const [ editView, setEditView ] = useState<IView | null>(null);
  const [ confirmRemoveView, setConfirmRemoveView ] = useState<IView | null>(null);
  const currentUser = useSelector((state: IState) => state.users.user);

  const onEditView = (view: IView) => {
    setEditView(view);
  };

  const onTriggerSaveView = ({ name }: { name: string }) => {
    if (editView) {
      onSaveView({
        ...editView,
        name
      });
    }
  };

  const onTriggerRemoveView = (view: IView) => {
    setConfirmRemoveView(view);
  };

  const displayRows = (
    views: IView[],
    viewsLoading: boolean
  ) => {
    return viewsLoading ?
      displayRowsSkeleton() :
      displayRowsData(views);
  };

  const displayRowsSkeleton = () => {
    return (new Array(5).fill(0)).map((_, index) => (
      <LeftMenuItem
        key={index}
        icon="cog"
        label={`name${index}`}
        skeleton={true}
      ></LeftMenuItem>
    ));
  };

  const displayRowsData = (views: IView[]) => {
    return views && views.map(view => (
      <LeftMenuItem
        key={view.id}
        icon={view.icon as IconName}
        label={view.name}
        link={`/n/v/${view.id}`}
        toolbar={true}
        onEdit={() => onEditView(view)}
        onRemove={() => onTriggerRemoveView(view)}
      ></LeftMenuItem>
    ));
  };

  const configureEditModal = () => {
    return (
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!editView}
        onClose={() => setEditView(null) }
        usePortal={true}
        title="Edit the view"
        icon="help"
      >
        <ViewDialogComponent
          view={editView}
          pending={viewSaving}
          onSave={onTriggerSaveView}
          onClose={() => setEditView(null) }
        >
        </ViewDialogComponent>
      </Dialog>
    );
  };

  const configureConfirmRemoveModal = () => {
    return (
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!confirmRemoveView}
        onClose={() => setConfirmRemoveView(null) }
        usePortal={true}
        title="Delete the view"
        icon="help"
      >
        <ConfirmDialogComponent
          message={confirmRemoveView ? `Do you want to delete the view ${confirmRemoveView?.name}` : ''}
          pending={viewRemoving}
          onConfirm={() => {
            if (confirmRemoveView) {
              onRemoveView(confirmRemoveView.id);
            }
          }}
          onClose={() => setConfirmRemoveView(null) }
        ></ConfirmDialogComponent>
      </Dialog>
    );
  };

  const handleAddNotebook = () => {
    onAddNotebook();
  };

  const isNotGuest = useMemo(() => isLoggedIn(currentUser) && !isGuest(currentUser), [ currentUser ]);

  return (
    <div className="notebooks-left-menu">
      <div className="notebooks-left-menu__action">
        {
          isNotGuest && (
            <Button
              data-cy='addNewNotebookLeftMenu'
              icon={IconNames.ADD}
              className="bp3-large"
              intent="primary"
              aria-label="New Notebook"
              onClick={handleAddNotebook}
            >New Notebook</Button>
          )
        }
      </div>
      <Menu className="notebooks-left-menu__tags" data-cy='leftMenuSavedViews'>
       <Divider/>
        <LeftMenuItem
          icon={IconNames.LAYERS}
          label="All Notebooks"
          link={`/n`}
        ></LeftMenuItem>
        <LeftMenuItem
          icon={IconNames.USER}
          label="My Notebooks"
          link={`/n/my-notebooks`}
        ></LeftMenuItem>
        <LeftMenuItem
          icon={IconNames.HISTORY}
          label="Recently Viewed"
          link={`/n/recent`}
        ></LeftMenuItem>
        <Divider/>
        <div className="notebooks-left-menu__tags__title">
          Saved views
        </div>
        { displayRows(views, viewsLoading) }
      </Menu>
      { configureEditModal() }
      { configureConfirmRemoveModal() }
    </div>
  )
};

export default NotebookListLeftMenuComponent;
