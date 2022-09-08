import React, {useCallback, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  loadUsers,
  saveUser,
  removeUser,
  loadUsersMetadata
} from '../../../shared/store/actions/userActions';
import { loadRoles } from '../../../shared/store/actions/roleActions';
import { IState } from '../../../shared/store/reducers';
import { ApiStatus, ISort, IFilter, IUser } from '../../../shared/models';
import UserListComponent from './UserList';
import {setupParamsFilters} from '../../../shared/utils/setupParamsFilters';

const UserListContainer = () => {
  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.users.canLoadMoreUsers);
  const users = useSelector((state: IState) => state.users.users);
  const usersParams = useSelector((state: IState) => state.users.usersParams);
  const usersMetadata = useSelector((state: IState) => state.users.usersMetadata);
  const usersLoadingListStatus = useSelector((state: IState) => state.users.loadingListStatus);
  const removingStatus = useSelector((state: IState) => state.users.removingStatus);
  const roles = useSelector((state: IState) => state.roles.roles);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUsersMetadata());
  }, [ ]);

  useEffect(() => {
    setPage(firstPage);
    dispatch(loadUsers({page_size, page: firstPage, reload: true  }));
    dispatch(loadRoles());
  }, [ dispatch ]);

  const onToggleSort = (sort: ISort) => {
    const filters = (usersParams && usersParams.filters) ?
      usersParams.filters.map<IFilter>(filter => ({
        name: filter.col,
        label: filter.col,
        type: '',
        opr: filter.opr,
        value: filter.value,
        configured: false,
        fromView: false
      })) :
      undefined;
    dispatch(loadUsers({ filters, sort, page_size, page: firstPage, reload: true  }));
  };

  const onSaveUser = (user: Partial<IUser>) => {
    dispatch(saveUser(user));
  };

  const onRemoveUser = (userUid: string) => {
    dispatch(removeUser(userUid));
    if (users.length <= page_size) {
      dispatch(loadUsers({ filters: setupFilters(), page_size, page: firstPage, reload: true }));
    }
  };

  const setupFilters = useCallback((): IFilter[] => {
    return setupParamsFilters(usersParams, usersMetadata);
  }, [ usersParams, usersMetadata ]);

  const loadMoreUsers= () => {
    dispatch(loadUsers({filters: setupFilters(),page_size, page: page + 1, reload: false}));
    setPage(page + 1);
  }

  return (
    <UserListComponent
      currentPage={page}
      firstPage={firstPage}
      onLoadMore={loadMoreUsers}
      canLoadMore={canLoadMore}
      setPage={setPage}
      listParams={usersParams}
      listMetadata={usersMetadata}
      users={users}
      usersLoading={usersLoadingListStatus === ApiStatus.LOADING}
      removingLoading={removingStatus == ApiStatus.LOADING}
      roles={roles}
      onToggleSort={onToggleSort}
      onSaveUser={onSaveUser}
      onRemoveUser={onRemoveUser}
    ></UserListComponent>
  );
};

export default withRouter(UserListContainer);
