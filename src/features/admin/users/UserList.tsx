import React, {FunctionComponent, useMemo, useState} from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Tag,
  Icon,
  Colors,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Position,
  Dialog,
  ButtonGroup,
  Button,
  Spinner
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import TimeAgo from 'react-timeago';
import {Helmet} from "react-helmet";
import InfiniteScroll from 'react-infinite-scroll-component';

import './UserList.scss';
import { LeftMenu } from '../../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import { PanelTitleToolbar } from '../../../shared/components/layout/PanelTitleToolbar';
import {
  IUser,
  IRole,
  IListColumn,
  ISort,
  IParams,
  INotebooksMetadata,
  ISharedListMetadata
} from '../../../shared/models';
import { IState } from '../../../shared/store/reducers';
import AdminLeftMenuComponent from '../AdminLeftMenu';
import { List, ListHeaders, ListRow, ListColumn, LabelWithLegend, ListFilters } from '../../../shared/components/list';
import { DrawerContainer } from '../../../shared/components/layout/Drawer';
import { stopPropagationForPopover } from '../../../shared/utils/events';
import EditUserDialogComponent from '../../../shared/components/dialogs/EditUserDialog';
import ConfirmDialogComponent from "../../../shared/components/dialogs/ConfirmDialog";
import Avatar from '../../../shared/components/image/Avatar';
import { isAdmin } from '../../../shared/utils/auth';
import {isFirstPage} from '../../notebooks/utils';
import {displayRowsSkeleton} from '../../../shared/components/displayRowsSkeleton/displayRowsSkeleton';
import { loadUsers } from '../../../shared/store/actions/userActions';
import ListFiltersContainer from '../../../shared/components/ListFilterContainer/ListFilterContainer';
import InviteUserButton from './InviteUserButton';
import { userColumns } from './constants';

type RowClickedCallback = (database: IUser) => void;
type RowDoubleClickedCallback = (database: IUser) => void;
type OnContextMenuOpenChangeCallback = (openMode: boolean) => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OpenEditUserCallback = (user: IUser) => void;
type OpenRemoveUserCallback = (user: IUser) => void;
type SaveUserCallback = (user: Partial<IUser>) => void;
type RemoveUserCallback = (uid: string) => void;
type OnLoadMoreCallback = () => void;
type SetPageCallback = (value:number) => void;

type UserListComponentProps = {
  users: IUser[];
  usersLoading: boolean;
  removingLoading: boolean;
  roles: IRole[];
  onToggleSort?: OnToggleSortCallback;
  onSaveUser: SaveUserCallback;
  onRemoveUser: RemoveUserCallback;
  onLoadMore: OnLoadMoreCallback;
  setPage: SetPageCallback;
  canLoadMore: boolean;
  currentPage: number;
  firstPage: number;
  listParams: IParams | undefined;
  listMetadata: ISharedListMetadata | null;
};

function displayRows({
  user,
  users,
  usersLoading,
  headers,
  url,
  rowClickEnabled,
  onRowClicked,
  onRowDoubleClicked,
  onContextMenuOpenChange,
  openEditUserDialog,
  openRemoveUserDialog,
  currentPage,
  firstPage
}: {
  user: IUser | undefined | null,
  users: IUser[];
  usersLoading: boolean;
  headers: { [id: string]: IListColumn };
  url: string;
  rowClickEnabled: boolean;
  onRowClicked: RowClickedCallback;
  onRowDoubleClicked: RowDoubleClickedCallback;
  onContextMenuOpenChange: OnContextMenuOpenChangeCallback;
  openEditUserDialog: OpenEditUserCallback;
  openRemoveUserDialog: OpenRemoveUserCallback;
  currentPage: number;
  firstPage: number;
}) {
  return usersLoading && isFirstPage(currentPage, firstPage) ?
    displayRowsSkeleton(headers) :
    displayRowsData({
      user, users, headers, url,
      rowClickEnabled, onRowClicked,
      onRowDoubleClicked,
      onContextMenuOpenChange,
      openEditUserDialog,
      openRemoveUserDialog
    });
}

function displayRowsData({
  user: currentUser,
  users,
  headers,
  url,
  rowClickEnabled,
  onRowClicked,
  onRowDoubleClicked,
  onContextMenuOpenChange,
  openEditUserDialog,
  openRemoveUserDialog
}: {
  user: IUser | undefined | null,
  users: IUser[];
  headers: { [id: string]: IListColumn };
  url: string;
  rowClickEnabled: boolean;
  onRowClicked: RowClickedCallback;
  onRowDoubleClicked: RowDoubleClickedCallback;
  onContextMenuOpenChange: OnContextMenuOpenChangeCallback;
  openEditUserDialog: OpenEditUserCallback;
  openRemoveUserDialog: OpenRemoveUserCallback;
}) {
  const handleRowClick = (user: IUser) => {
    rowClickEnabled && onRowClicked(user);
  };

  const handleRowDoubleClick = (user: IUser) => {
    rowClickEnabled && onRowDoubleClicked(user);
  };

  return users && users.map((user, index) => {
    const rowMenuContent = (
      <Menu>
        <MenuItem
          icon={IconNames.ID_NUMBER}
          text="View User Profile"
          onClick={() => onRowClicked(user)}
        ></MenuItem>
        {
          isAdmin(currentUser) && (
            <>
              <MenuItem
                icon={IconNames.EDIT}
                text="Edit User"
                onClick={() => openEditUserDialog(user)} />
              <MenuDivider />
              <MenuItem
                icon={IconNames.DELETE}
                text="Remove from Account"
                onClick={() => openRemoveUserDialog(user)} />
            </>
          )
        }
      </Menu>
    );

    return (<ListRow
        key={user.username}
        onRowClicked={() => handleRowClick(user)}
        onRowDoubleClicked={() => handleRowDoubleClick(user)}
      >
        <ListColumn properties={headers.name} main={true}>
          <Avatar
            rounded={false}
            inline={true}
            image={user.avatar}
            names={[ user.first_name, user.last_name ]}
          />
          <LabelWithLegend
            label={(user.last_name && user.first_name) ? `${user.first_name} ${user.last_name}` : user.username} legend={user.email}/>
        </ListColumn>
        <ListColumn properties={headers.roles}>
          {user.main_roles?.map(role => role.name).join(', ')}
        </ListColumn>
        <ListColumn properties={headers.lastSeen}>
          {user.last_login ? <TimeAgo date={user.last_login} minPeriod={60} /> : 'Never'}
        </ListColumn>
        <ListColumn properties={headers.loginCount}>
          {user.login_count || 0}
        </ListColumn>
        <ListColumn properties={headers.created_on}>
          <TimeAgo date={user?.created_on} />
        </ListColumn>
        <ListColumn properties={headers.actions}>
          <div onClick={stopPropagationForPopover}>
            <Popover
              content={rowMenuContent}
              position={Position.BOTTOM_RIGHT}
              className="user-list__rows__trigger"
              onOpened={() => onContextMenuOpenChange(true)}
              onClosed={() => onContextMenuOpenChange(false)}
            >
              <ButtonGroup className="user-list__rows__trigger__button">
                <Button className='bp3-button bp3-minimal' rightIcon={IconNames.MORE}></Button>
              </ButtonGroup>
            </Popover>
          </div>
        </ListColumn>
      </ListRow>
    );
  });
}

const UserListComponent: FunctionComponent<UserListComponentProps> = ({
  users, usersLoading,
  roles,
  onToggleSort, onSaveUser, onRemoveUser, removingLoading,
  onLoadMore, canLoadMore, setPage, currentPage, firstPage,
  listParams, listMetadata
}: UserListComponentProps) => {
  const [ detailsDisplayed, setDetailsDisplayed]  = useState(false);
  const [ rowClickEnabled, setRowClickEnabled ] = useState(true);
  const [ selectedUser, setSelectedUser ] = useState<IUser | null>(null);
  const [ confirmRemoveUser, setConfirmRemoveUser ] = useState<IUser | null>(null);
  const [ editUser, setEditUser ] = useState<IUser | null>(null);
  const currentUser = useSelector((state: IState) => state.users.user);

  let { url } = useRouteMatch();
  url = url.endsWith('/') ? url.slice(0, -1) : url;

  const openEditUserDialog = (user: IUser) => {
    setEditUser(user);
  };

  const closeEditUserDialog = () => {
    setEditUser(null);
  }

  const saveUser = (updatedUser: Partial<IUser>) => {
    onSaveUser({
      ...updatedUser,
      uid: editUser?.uid
    });
    closeEditUserDialog();
  };

  const onCloseDetails = () => {
    setSelectedUser(null);
    setDetailsDisplayed(false);
  };

  const onRowClicked = (row: IUser) => {
    setSelectedUser(row);
    setDetailsDisplayed(true);
  };

  const onRowDoubleClicked = (row: IUser) => {
    // window.open(`${url}/${row.id}`, '_blank');
  };

  const onContextMenuOpenChange = (openMode: boolean) => {
    setRowClickEnabled(!openMode);
  };

  const handleToggleSort = (sort: ISort) => {
    onToggleSort && onToggleSort(sort);
  };

  const openRemoveUserDialog = (user: IUser) => {
    setConfirmRemoveUser(user);
  }

  const configureConfirmRemoveModal = () => {
    const name = `${confirmRemoveUser?.first_name + ' ' + confirmRemoveUser?.last_name}`

    return (
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!confirmRemoveUser}
        onClose={() => setConfirmRemoveUser(null) }
        usePortal={true}
        title="Delete user"
        icon="help"
      >
        <ConfirmDialogComponent
          message={confirmRemoveUser ?
            `Do you want to delete the user '${name}'` :
            ''
          }
          pending={removingLoading}
          onConfirm={() => {
            if (confirmRemoveUser) {
              onRemoveUser(confirmRemoveUser.uid);
            }
          }}
          onClose={() => setConfirmRemoveUser(null) }
        ></ConfirmDialogComponent>
      </Dialog>
    );
  };

  const selectedUserRoles: any = useMemo(() => selectedUser && selectedUser.main_roles || [], [ selectedUser ]);
  return (
    <div>
      <Helmet>
        <title>
          User Management
        </title>
      </Helmet>
      <LeftMenu>
        <AdminLeftMenuComponent></AdminLeftMenuComponent>
      </LeftMenu>
      <PanelTitle>
        Users
      </PanelTitle>
      <PanelTitleToolbar>
        {
          isAdmin(currentUser) && (
            <div className="admin-left-menu__action__button">
              <InviteUserButton />
            </div>
          )
        }
      </PanelTitleToolbar>

      <div className="user-list">
        <ListFiltersContainer
          listMetadata={listMetadata}
          listParams={listParams}
          loadListData={loadUsers}
          view_type='Users'
          disableViews={true}
          setPage={setPage}
          columnsList={userColumns}
        />
        <List>
          <ListHeaders
            headers={userColumns}
            onToggleSort={handleToggleSort}
          ></ListHeaders>
          {
            <div className='infinite-scroll-base' id='users-infinite-scroll'>
              <InfiniteScroll
                dataLength={users.length}
                next={onLoadMore}
                hasMore={!usersLoading && canLoadMore}
                loader={<Spinner size={50} className='load-more-spinner'/>}
                scrollableTarget="users-infinite-scroll"
              >
                {
                  displayRows({
                    user: currentUser, users, usersLoading, headers: userColumns, url,
                    rowClickEnabled, onRowClicked, onRowDoubleClicked,
                    onContextMenuOpenChange, openEditUserDialog, openRemoveUserDialog, currentPage, firstPage
                  })
                }
              </InfiniteScroll>
            </div>
          }
        </List>
        <DrawerContainer
          isOpen={detailsDisplayed}
          iconBackgroundColor={Colors.GRAY2}
          label={
            selectedUser ?
              (selectedUser.first_name || selectedUser.last_name) ?
                `${selectedUser.first_name} ${selectedUser.last_name}` :
                selectedUser.username :
              ''
          }
          image={selectedUser ? selectedUser.avatar : null}
          mode="multiple"
          extendedPanel={
            <div>
              <div className="user-details-panel__email">{selectedUser ? selectedUser.email : ''}</div>
              <div className="user-details-panel__tags__list">
                {
                  selectedUserRoles.map((role: any) => (
                    <Tag key={role.uid} minimal={true}>{role.name}</Tag>
                  ))
                }
              </div>
              <div className="user-details-panel__hints">
                { /* signed up 3 months ago <Icon icon={IconNames.DOT} color={Colors.GRAY3} /> last active a minute ago */ }
                { selectedUser && (<span>signed up <TimeAgo date={selectedUser?.created_on} /></span>) }
              </div>
            </div>
          }
          onClose={onCloseDetails}
        >
        </DrawerContainer>
      </div>
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!editUser}
        usePortal={true}
        onClose={closeEditUserDialog}
        title="Edit user profile"
        icon={IconNames.USER}
      >
        {
          editUser && (
            <EditUserDialogComponent
              canEdit={isAdmin(currentUser)}
              user={editUser}
              roles={roles}
              onSave={saveUser}
              onClose={closeEditUserDialog} />
          )
        }
      </Dialog>

      { configureConfirmRemoveModal() }
    </div>
  )
};

export default UserListComponent;
