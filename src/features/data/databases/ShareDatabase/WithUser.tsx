import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Colors,
  Icon,
  Spinner,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { IDatabase, IUser } from '../../../../shared/models';
import { IState } from '../../../../shared/store/reducers';
import {
  loadUsers
} from '../../../../shared/store/actions/userActions';
import {
  shareDatabaseWithUser
} from '../../../../shared/store/actions/databaseActions';
import SelectAction from './SelectAction';
import SuggestUser from './SuggestUser';
import { fullName } from '../../../../shared/utils/user';

import Avatar from "../../../../shared/components/image/Avatar";

type Callback = (value?: any) => void;
type UserActionCallback = (uid: string, action: string) => void;

interface IWithUserContainerProps {
  database: IDatabase;
  onShare?: Callback;
}

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
    return '';
  }
  if (sharedWithUser.edit) {
    return 'edit';
  } else if (sharedWithUser.use) {
    return 'use';
  } else {
    return 'view';
  }
}

const WithUserInput: FunctionComponent<IWithUserInput> = ({ options, onSelect }: IWithUserInput) => {
  return (
    <div>
      <div className="share-database-dialog__with-user__label">
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
    <div className="share-database-dialog__with-user__share-list">
      {
        selectedUsers.map((user: IUser) => {
          const firstName = user.first_name || '';
          const lastName = user.last_name || '';
          const action = getPermission(selected.find((s: any) => s.uid === user.uid));
          const disabled = currentUserUid === user.uid;

          return (
            <div
              className={"share-database-dialog__with-user__share-list__item " + (disabled ? "disabled" : "")}
              key={user.uid}>
              <div className="user-details">
                <Avatar
                  rounded={true}
                  inline={false}
                  names={[ firstName, lastName ]}
                  image={user.avatar} />
                <div className="user-name">{fullName(user)}</div>
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

const WithUserContainer: FunctionComponent<IWithUserContainerProps> = ({
  database,
  onShare,
}: IWithUserContainerProps) => {
  const [ selected, setSelected ] = useState([] as any[]);

  const users = useSelector((state: IState) => state.users.users);
  const currentUser = useSelector((state: IState) => state.users.user);
  const currentSharingSettings = useSelector((state: IState) => state.databases.currentSharingSettings);
  const databaseUid = database?.uid as string;
  const dispatch = useDispatch();

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

    if (!found && databaseUid) { /* if not found */
      onShare && onShare(); // shared with new user
      /*
       * view is selected by default
       */
      const newSelected = { uid: value.uid, view: true };

      setSelected((oldSelected: any) => [ ...oldSelected, newSelected ]);
      dispatch(shareDatabaseWithUser(databaseUid, value.uid, getPermission(newSelected)));
    }

  }, [ databaseUid, selected.length ]);

  const onRemoveSelected = useCallback((uid: string) => {
    if (uid) {
      onShare && onShare(); // removed user from sharing settings

      setSelected((oldSelected: any) => [ ...oldSelected.filter((s: any) => s.uid !== uid) ]);

      // if permission is not specified, it will be deleted
      dispatch(shareDatabaseWithUser(databaseUid, uid, ""));
    }
  }, [ databaseUid, selected.length ]);

  const onChangeSelected = useCallback((uid: string, action: string) => {
    onShare && onShare(); // changed user sharing settings

    dispatch(shareDatabaseWithUser(databaseUid, uid, action));
  }, [ databaseUid, selected.length ]);

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

  if (!users.length || !currentSharingSettings) {
    return <Spinner size={20} />;
  }

  return (
    <div className="share-database-dialog__with-user">
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
