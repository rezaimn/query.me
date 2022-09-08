import React, { FunctionComponent, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {Button, Dialog, Menu} from '@blueprintjs/core';
import {useHistory} from 'react-router-dom';
import {IconNames, IconName} from '@blueprintjs/icons';

import './SharedListLeftMenu.scss';
import { IView } from "../../models";
import { IState } from '../../store/reducers';
import LeftMenuItem from '../../../shared/components/layout/LeftMenuItem';
import ConfirmDialogComponent from '../../../shared/components/dialogs/ConfirmDialog';
import ViewDialogComponent from '../../../shared/components/dialogs/ViewDialog';
import { isGuest, isLoggedIn } from '../../utils/auth';

type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;

type SharedListLeftMenuComponentProps = {
  views: IView[];
  viewsLoading: boolean;
  viewSaving: boolean;
  viewRemoving: boolean;
  onSaveView: SaveViewCallback;
  onRemoveView: RemoveViewCallback;
  menuTitle: string;
  routePreLink: string;
  getAllViewsLink: string;
};

const SharedListLeftMenuComponent: FunctionComponent<SharedListLeftMenuComponentProps> = ({
  views, viewsLoading,
  viewSaving, viewRemoving,
  onSaveView, onRemoveView,
  menuTitle, routePreLink,
  getAllViewsLink
}: SharedListLeftMenuComponentProps) => {
  const [editView, setEditView] = useState<IView | null>(null);
  const [confirmRemoveView, setConfirmRemoveView] = useState<IView | null>(null);
  const currentUser = useSelector((state: IState) => state.users.user);
  const history = useHistory();

  const displayNewConnection = () => {
    history.push('/d/d/connect');
  }

  const onEditView = (view: IView) => {
    setEditView(view);
  };

  const onTriggerSaveView = ({name}: { name: string }) => {
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
        link={`${routePreLink}${view.id}`}
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
        onClose={() => setEditView(null)}
        usePortal={true}
        title="Edit the view"
        icon="help"
      >
        <ViewDialogComponent
          view={editView}
          pending={viewSaving}
          onSave={onTriggerSaveView}
          onClose={() => setEditView(null)}
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
        onClose={() => setConfirmRemoveView(null)}
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
          onClose={() => setConfirmRemoveView(null)}
        ></ConfirmDialogComponent>
      </Dialog>
    );
  };

  const isNotGuest = useMemo(() => isLoggedIn(currentUser) && !isGuest(currentUser), [ currentUser ]);

  return (
    <div className="shared-left-menu">
      <div className="shared-left-menu__action">
        {
          isNotGuest && (
            <Button
              data-cy='addNewDBLeftMenu'
              icon={IconNames.ADD}
              className="bp3-large"
              intent="primary"
              onClick={displayNewConnection}
            >New Database</Button>
          )
        }
      </div>
      <Menu className="shared-left-menu__domains" data-cy='leftMenuMainLists'>
        <LeftMenuItem
          icon={IconNames.DATABASE}
          label="Databases"
          link={`/d/d`}
          notExactLink={true}
        ></LeftMenuItem>
        <LeftMenuItem
          icon={IconNames.HEAT_GRID}
          label="Schemas"
          link={`/d/s`}
          notExactLink={true}
        ></LeftMenuItem>
        <LeftMenuItem
          icon={IconNames.TH}
          label="Tables"
          link={`/d/t`}
          notExactLink={true}
        ></LeftMenuItem>
      </Menu>
      <Menu className="shared-left-menu__tags" data-cy='leftMenuSavedViews'>
        <LeftMenuItem
          icon={IconNames.LAYERS}
          label={`All ${menuTitle}`}
          link={getAllViewsLink}
        ></LeftMenuItem>
        {displayRows(views, viewsLoading)}
      </Menu>
      {configureEditModal()}
      {configureConfirmRemoveModal()}
    </div>
  )
};

export default SharedListLeftMenuComponent;
