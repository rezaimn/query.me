import React, {
  FunctionComponent,
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Colors,
  Icon,
  MenuItem,
  Spinner,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { IUser } from '../../../../models';
import { IState } from '../../../../store/reducers';
import { loadUsers, setLastInvitedUser } from '../../../../store/actions/userActions';
import SuggestUser from './SuggestUser';
import Avatar from '../../../image/Avatar';
import { userIsType } from '../../../../utils/auth';
import { fullName } from '../../../../utils/user';
import { shareNotebookWithUser } from '../../../../store/actions/notebookActions';
import usePrevious from "../../../../hooks/use-previous";
import SelectAction from "./SelectAction";

type Callback = (value: any) => void;
type UserActionCallback = (uid: string, action: string) => void;

interface Option {
  value: string;
  uid: string;
}

interface IWithUserInput {
  options: Option[];
  onSelect: Callback;
}

interface IWithUserList {
  currentUser: IUser | null;
  users: IUser[];
  selected: string[]; /* user uid */
  onChange: UserActionCallback;
  onRemove: Callback;
}

function getPermission(sharedWithUser: any) {
  if (!sharedWithUser) {
    return "";
  }
  return sharedWithUser.edit ? "edit" : sharedWithUser.view ? "view" : "";
}

const WithUserInput: FunctionComponent<IWithUserInput> = ({ options, onSelect }: IWithUserInput) => {
  return (
    <div>
      <div className="with-user__label">
        <Icon icon={IconNames.PEOPLE} color={Colors.GRAY1} /> Invite individual users:
      </div>
      <SuggestUser
        options={options}
        onSelect={onSelect} />
    </div>
  );
}

const WithUserList: FunctionComponent<IWithUserList> = ({
  currentUser,
  users,
  selected,
  onChange,
  onRemove
}: IWithUserList) => {
  const selectedUsers = users.filter((user: IUser) => selected.find((s: any) => s.uid === user.uid));
  const currentUserUid = currentUser?.uid;

  return (
    <div className="with-user__share-list">
      {
        selectedUsers.map((user: IUser) => {
          const firstName = user.first_name || '';
          const lastName = user.last_name || '';
          const userRoleType = userIsType(user);
          const userRoleTypeHint = userRoleType ? `(${userRoleType})` : '';
          const action = getPermission(selected.find((s: any) => s.uid === user.uid));
          const disabled = currentUserUid === user.uid;

          return (
            <div className={"with-user__share-list__item " + (disabled ? "disabled" : "")} key={user.uid}>
              <div className="user-details">
                <Avatar
                  rounded={true}
                  inline={false}
                  names={[ firstName, lastName ]}
                  image={user.avatar} />
                <div className="user-name">{fullName(user)} {userRoleTypeHint}</div>
              </div>
              <div className="remove-user">
                <SelectAction
                  key={user.uid}
                  selected={action}
                  onChange={(option: Option) => onChange(user.uid, option.value)}
                  disabled={disabled} />
                <Button
                  disabled={disabled}
                  icon={IconNames.CROSS}
                  minimal={true}
                  onClick={() => onRemove(user.uid)} />
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

const WithUserContainer: FunctionComponent = ({}) => {
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const users = useSelector((state: IState) => state.users.users);
  const currentUser = useSelector((state: IState) => state.users.user);
  const lastInvitedUser = useSelector((state: IState) => state.users.lastInvitedUser);
  const currentSharingSettings = useSelector((state: IState) => state.notebooks.currentSharingSettings);
  const notebookUid = notebook?.uid as string;
  const dispatch = useDispatch();
  const [ selected, setSelected ] = useState([] as any[]);
  const totalUsers = usePrevious(users.length);

  useEffect(() => {
    dispatch(setLastInvitedUser(null));
    return () => {
      dispatch(setLastInvitedUser(null));
    }
  }, [ ]);

  useEffect(() => {
    if (lastInvitedUser && totalUsers > 0 && totalUsers !== users.length) {
      /*
       * @TODO - improve because it feels a bit hacky
       *
       * Because we don't have an afterInvite hook on the SuggestUser component,
       * this is how we check if a user was invited or not.
       *
       * When this component is opened / closed, lastInvitedUser is unset (if any) and initial users count is saved.
       * If a user will be invited, then it means that:
       * - we will have a lastInvitedUser
       * - initial user's count will be different that current users count.
       */
      const value: Option = {
        value: fullName(lastInvitedUser),
        uid: lastInvitedUser.uid || '',
      }
      onSelect(value);
      dispatch(setLastInvitedUser(null));
    }
  }, [ users, lastInvitedUser ]);

  useEffect(() => {
    if (!users.length) {
      dispatch(loadUsers({ page: 0, page_size: -1 }));
    }
  }, [ users ]);

  useEffect(() => {
    if (
      currentSharingSettings &&
      currentSharingSettings.shared_with_users &&
      currentSharingSettings.shared_with_users.length) {
      setSelected(currentSharingSettings.shared_with_users);
    }
  }, [ currentSharingSettings ]);

  const onSelect = useCallback((value: Option) => {
    if (!value.uid) {
      /* this means "Add user" was clicked */
      return;
    }

    const found = selected.find((s: any) => s.uid === value.uid);

    if (!found) { /* if not found */
      /*
       * view is selected by default
       */
      const newSelected = { uid: value.uid, view: true };

      setSelected((oldSelected: any) => [ ...oldSelected, newSelected ]);
      dispatch(shareNotebookWithUser(notebookUid, value.uid, getPermission(newSelected)));
    }

  }, [ notebookUid, selected.length ]);

  const onRemoveSelected = useCallback((uid: string) => {
    if (uid) {
      setSelected((oldSelected: any) => [ ...oldSelected.filter((s: any) => s.uid !== uid) ]);

      // if permission is not specified, it will be deleted
      dispatch(shareNotebookWithUser(notebookUid, uid, ""));
    }
  }, [ notebookUid, selected.length ]);

  const onChangeSelected = useCallback((uid: string, action: string) => {
    dispatch(shareNotebookWithUser(notebookUid, uid, action));
  }, [ notebookUid, selected.length ]);

  if (!users.length || !currentSharingSettings) {
    return <Spinner size={20} />;
  }

  const options: Option[] = users.map((user: any) => {
    return {
      value: fullName(user),
      uid: user.uid
    }
  }).filter((value: Option) => {
    return !selected.find((s: any) => s.uid === value.uid); /* this means it's already selected */
  });

  return (
    <div className="share-notebook__popover__content">
      <WithUserInput
        options={options}
        onSelect={onSelect} />
      <WithUserList
        currentUser={currentUser}
        users={users}
        selected={selected}
        onChange={onChangeSelected}
        onRemove={onRemoveSelected} />
    </div>
  );
};

export default WithUserContainer;
