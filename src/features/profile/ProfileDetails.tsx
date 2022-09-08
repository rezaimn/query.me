import React, { Fragment, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Tag, Popover, Position, Menu, MenuItem, Dialog } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import TimeAgo from 'react-timeago';
import {Helmet} from "react-helmet";

import { IUser } from '../../shared/models';
import EditUserDialogComponent from '../../shared/components/dialogs/EditUserDialog';
import Avatar from '../../shared/components/image/Avatar';
import {IState} from '../../shared/store/reducers';
import { loadRoles } from '../../shared/store/actions/roleActions';
import { isAdmin } from '../../shared/utils/auth';

import './ProfileDetails.scss';

type SaveUserCallback = (user: Partial<IUser>) => void;

type ProfileDetailsProps = {
  user: IUser | undefined | null;
  userLoading: boolean;
  onSaveUser: SaveUserCallback;
};

type TUser = IUser | undefined | null;

function displayProfile({
  user, userLoading, rowMenuContent
}: {
  user?: TUser;
  userLoading: boolean;
  rowMenuContent: any;
}) {
  return userLoading ?
    displayProfileSkeleton() :
    displayProfileData({
      user, rowMenuContent
    });
}
function displayProfileSkeleton() {
  return (
    <div className="profile">
      <div className="profile__content">
        <header className={`profile__header with-border extended-height`}>
          <div className="profile__header__left">
            <Avatar skeleton={true} big={true} />
          </div>
          <div className="profile__header__right">
            <div className="profile__header__right__bar">
              <div className="profile__header__title">
                <div className="profile__header__title__label bp3-skeleton">first_name last_name</div>
              </div>
              <div className="profile__header__toolbar">
              </div>
            </div>
            <div className="profile__header__right__extended">
              <div>
                <div className="profile__header__details__email bp3-skeleton">sam@samson.com</div>
                <div className="profile__header__details__tags__list">
                  {
                    [ 'Role' ].map(tag => (
                      <Tag key={tag} minimal={true} className="bp3-skeleton">{tag}</Tag>
                    ))
                  }
                </div>
                <div className="profile__header__details__hints bp3-skeleton">
                  { /* signed up 3 months ago <Icon icon={IconNames.DOT} color={Colors.GRAY3} /> last active a minute ago */ }
                  signed up 3 months ago
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

function displayProfileData({
  user, rowMenuContent
}: {
  user: IUser | undefined | null;
  rowMenuContent: any;
}) {
  const roles: any = (user && user.main_roles) || [];

  return (
    <div className="profile">
      <div className="profile__content">
        <header className={`profile__header with-border extended-height`}>
          <div className="profile__header__left">
            <Avatar image={user?.avatar} big={true} />
          </div>
          <div className="profile__header__right">
            <div className="profile__header__right__bar">
              <div className="profile__header__title">
                <div className="profile__header__title__label">
                  {user?.first_name || user?.last_name ? `${user?.first_name} ${user?.last_name}` : user?.username}
                </div>
              </div>
              <div className="profile__header__toolbar">
                <Popover
                  content={rowMenuContent}
                  position={Position.BOTTOM_RIGHT}
                >
                  <ButtonGroup className="profile__header__toolbar__action">
                    <Button rightIcon={IconNames.MORE}></Button>
                  </ButtonGroup>
                </Popover>
              </div>
            </div>
            <div className="profile__header__right__extended">
              <div>
                <div className="profile__header__details__email">{user?.email}</div>
                <div className="profile__header__details__tags__list">
                  {
                    roles?.map((role: any) => (
                      <Tag key={role.uid} minimal={true}>{role.name}</Tag>
                    ))
                  }
                </div>
                <div className="profile__header__details__hints">
                  { /* signed up 3 months ago <Icon icon={IconNames.DOT} color={Colors.GRAY3} /> last active a minute ago */ }
                  { user && (<span>signed up <TimeAgo date={user?.created_on} /></span>) }
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="profile__details no-border">
        </div>
      </div>
    </div>
  );
}

const ProfileDetailsComponent: FunctionComponent<ProfileDetailsProps> = ({
  user, userLoading, onSaveUser
}: ProfileDetailsProps) => {
  const [ editUserOpened, setEditUserOpened ] = useState(false);
  const roles = useSelector((state: IState) => state.roles.roles);
  const currentUser = useSelector((state: IState) => state.users.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!roles || !roles.length) {
      dispatch(loadRoles());
    }
  }, [ roles ]);

  const openEditUserDialog = useCallback((event: any) => {
    if (user) {
      setEditUserOpened(true);
    }
  }, [ user ]);

  const closeEditUserDialog = useCallback(() => {
    setEditUserOpened(false);
  }, [ ]);

  const saveUser = (updatedUser: Partial<IUser>) => {
    onSaveUser({
      ...updatedUser,
      uid: user?.uid
    });
    closeEditUserDialog();
  };

  const rowMenuContent = (
    <Menu>
      <MenuItem
        icon={IconNames.EDIT}
        text="Edit Profile"
        onClick={openEditUserDialog} />
    </Menu>
  );

  return (
    <Fragment>
      <Helmet>
        <title>
          {
            user ? user?.first_name || user?.last_name ? `${user?.first_name} ${user?.last_name}` : user?.username
            : 'User Profile'
          }
        </title>
      </Helmet>
      { displayProfile({ user, userLoading, rowMenuContent }) }
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={editUserOpened}
        usePortal={true}
        onClose={closeEditUserDialog}
        title="Edit user profile"
        icon="user"
      >
        {
          user && (
            <EditUserDialogComponent
              canEdit={isAdmin(currentUser)}
              user={user}
              roles={roles}
              onSave={saveUser}
              onClose={closeEditUserDialog} />
          )
        }
      </Dialog>
    </Fragment>
  );
};

export default ProfileDetailsComponent;
