import rison from 'rison';

import { IDatabase, IDatabaseForCreation, IParams, ISort } from '../models';
import { api } from './Api';
import {buildConnectionUri, isBigQuery, isSnowflake, parseSqlUri, wrapEncryptedExtra} from '../utils/databases';

export const getDatabases = (params: IParams | undefined, sort: ISort | undefined) => {
  if (params && Object.keys(params).length === 1 && (!params.filters || params.filters.length === 0)) {
    params = undefined;
  }
  let requestParams = {};
  if (params && params.filters) {
    requestParams = {
      filters: params.filters
    };
  }
  if (params && params.page_size) {
    requestParams = {
      ...requestParams,
      page: params.page,
      page_size: params.page_size
    };
  }
  if (sort) {
    requestParams = {
      ...requestParams,
      order_column: sort.name,
      order_direction: sort.direction
    };
  }
  return (params || sort) ?
    api.get(`/database/?q=${rison.encode(requestParams)}`).then(res => res.data) :
    api.get('/database/').then(res => res.data);
};

export const getDatabasesMetadata = () => {
  // @TODO - rename this as this is not metadata?
  return api.get(`/database/_info`).then(res => res.data);
}

// Helper Function
const parseDatabaseData = (data: any) => {
    const result: IDatabase = { ...data.result };
    /*
     * parsed data is useful when editing a Database connection (maybe move this to reducer?)
     */

    if (isBigQuery(result.backend)) {
      const parsedUrl: any = parseSqlUri(result.sqlalchemy_uri);

      result.project_id = parsedUrl.host;
      result.dataset = parsedUrl.pathname.startsWith('/') ? parsedUrl.pathname.slice(1) : parsedUrl.pathname;
    } else if (isSnowflake(result.backend)) {
      try {
        const account = result.host || ''; /* account + region */
        const [database, schema] = (result.database || '').split('/');
        const parsedUrl: any = parseSqlUri(result.sqlalchemy_uri, true);

        result.account = account;
        result.database = database;
        result.schema = schema;

        if (parsedUrl.query && parsedUrl.query.role) {
          result.role = parsedUrl.query.role;
        }
        if (parsedUrl.query && parsedUrl.query.warehouse) {
          result.warehouse = parsedUrl.query.warehouse;
        }
      } catch (e) {
        // continue
      }
    }

    return {
      ...data,
      result: result
    };
  }

export const getDatabase = (uid: string, page: number, page_size: number, withSchemas?: boolean) => {
  return withSchemas ?
    Promise.all([
      api.get(`/database/${uid}`).then(res => parseDatabaseData(res.data)),
      api.get(`/es/schema/?q=(filters:!((col:database_uid,opr:eq,value:'${uid}')),page:${page},page_size:${page_size})`)
        .then(res => res.data),
    ]).then(([database, schemas]) => ({
      ...database,
      result: {
        ...database.result,
        schemas: schemas.result
      }
    })) :
    api.get(`/database/${uid}`).then(res => parseDatabaseData(res.data));
};

export const getDatabaseMetadata = (uid: string | string[]) => {
  /*
   * Get database, schema, table, column info from ES
   */
  const getAllData = (uid: string) => {
    return Promise.all([
      api.get(`/es/database/${uid}/metadata`).then((res: any) => res.data),
    ]).then(([ result ]) => ({
      [uid]: result
    }));
  }

  return Promise.all(
    typeof uid === 'string' ? [ getAllData(uid) ] : uid.map(getAllData)
  );
};

export const getDatabaseSharingSettings = (uid: string) => {
  return api.get(`/database/${uid}/sharing_settings`).then((res: any) => res.data);
};

export const getCurrentUserPermissions = (uid: string, userId: string) => {
  return api.get(`/database/${uid}/current_user_permissions`).then((res: any) => res.data);
}

const DEFAULT_CREATE_DATABASE_EXTRA = {
  metadata_params: {},
  engine_params : {
    isolation_level: 'AUTOCOMMIT'  // useful if allow_dml is True, which in our case it is
  }
};

const DEFAULT_CREATE_DATABASE = {
  allow_csv_upload: true, // not used, but let's default it to true
  allow_ctas: true, // allow create table AS
  allow_cvas: true, // allow create view AS
  allow_dml: true, // allow users to run non-SELECT statements in SQL Lab
  allow_multi_schema_metadata_fetch: true, // let's leave it to true
  allow_run_async: true,
  cache_timeout: 0,
  encrypted_extra: null, // used for BigQuery
  expose_in_sqllab: true,
  extra: JSON.stringify(DEFAULT_CREATE_DATABASE_EXTRA, null, 2),
  force_ctas_schema: '',
  impersonate_user: false,
  server_cert: null,  // not used yet, this requires another input in case it will be used
}

export const createDatabase = (databaseData: IDatabaseForCreation) => {
  const {
    engine,
    username, password,
    host, port,
    database_name: database,
    project_id, dataset,
    encrypted_extra,
    account,
    schema,
    warehouse, role,
  } = databaseData;
  const _DEFAULT_CREATE_DATABASE = JSON.parse(JSON.stringify(DEFAULT_CREATE_DATABASE));

  if (isBigQuery(engine) || isSnowflake(engine)) {
    _DEFAULT_CREATE_DATABASE.extra = JSON.stringify(
      {
        ...DEFAULT_CREATE_DATABASE_EXTRA,
        engine_params: {}
      }, null, 2)
  }

  return api.post(`/database/`, {
    ..._DEFAULT_CREATE_DATABASE,
    encrypted_extra: isBigQuery(engine) ? wrapEncryptedExtra(encrypted_extra) : DEFAULT_CREATE_DATABASE.encrypted_extra,
    database_name: databaseData.name,
    sqlalchemy_uri: buildConnectionUri(
      engine, host,
      port, username,
      password, database,
      project_id, dataset,
      account,
      schema,
      warehouse, role,
    )
  }).then(res => res.data);
};

export const editDatabase = (uid: string, databaseData: IDatabaseForCreation) => {
  const {
    engine,
    username, password,
    host, port,
    database_name: database,
    project_id, dataset,
    encrypted_extra,
    account,
    schema,
    warehouse, role,
  } = databaseData;

  return api.put(`/database/${uid}`, {
    database_name: databaseData.name,
    encrypted_extra: isBigQuery(engine) ? wrapEncryptedExtra(encrypted_extra) : DEFAULT_CREATE_DATABASE.encrypted_extra,
    sqlalchemy_uri: buildConnectionUri(
      engine, host,
      port,
      username, password,
      database,
      project_id, dataset,
      account,
      schema,
      warehouse, role,
    )
  }).then(res => res.data);
};

export const removeDatabase = (uid: string) => {
  return api.delete(`/database/${uid}`).then(res => res.data);
};

export const shareDatabaseWithUser = (databaseUid: string, userUid: string, permission: string) => {
  const payload = {
    user_uid: userUid,
    permission
  };

  return api.post(`/database/${databaseUid}/share_with_user`, payload).then(res => res.data);
};

export const shareDatabaseWithWorkspace = (databaseUid: string, permission: string) => {
  const payload = {
    permission
  };

  return api.post(`/database/${databaseUid}/share_with_workspace`, payload).then(res => res.data);
};



