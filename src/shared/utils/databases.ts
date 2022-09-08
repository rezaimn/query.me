import parseUrl from 'url-parse';
import { IDatabaseKind, IDatabaseUri } from '../models';

export const databaseTypes: IDatabaseKind[] = [
  {
    name: 'Apache Impala',
    backend: 'impala',
    port: 20150
  },
  {
    name: 'Apache Kylin',
    backend: 'kylin',
    port: 7070
  },
  {
    name : 'Big Query',
    backend: 'bigquery',
    port: 0
  },
  {
    name : 'Clickhouse',
    backend: 'clickhouse',
    port: 8123
  },
  {
    name: 'Exasol',
    backend: 'exa',
    port: 8563
  },
  {
    name: 'Firebird',
    backend: 'firebird',
    port: 3050
  },
  {
    name: 'MariaDB',
    backend: 'mariadb',
    port: 3306
  },
  {
    name: 'Microsoft SQL Server',
    backend: 'mssql',
    port: 1433
  },
  {
    name: 'MySQL',
    backend: 'mysql',
    port: 3306
  },
  {
    name: 'Oracle',
    backend: 'oracle',
    port: 1521
  },
  {
    name: 'PostgreSQL',
    backend: 'postgresql',
    port: 5432
  },
  {
    name: 'Redshift',
    backend: 'redshift',
    port: 5439
  },
  {
    name: 'Snowflake',
    backend: 'snowflake',
    port: 0
  }
];

export const isBigQuery = (engine: string) => engine === 'bigquery';
export const isSnowflake = (engine: string) => engine === 'snowflake';

function buildSnowflakeConnectionUri(
  username: string,
  password: string,
  database: string,
  account: string, /* account + region */
  schema: string,
  warehouse: string,
  role: string
) {
  const hasParams = (warehouse || role) ? '?' : '';
  return ("snowflake://" +
    `${username}${password ? (':' + password) : ''}` +
    `@${account}` +
    `/${database}/${schema}${hasParams}` +
    `${warehouse ? ('warehouse=' + warehouse) : ''}` +
    `${role ? ('&role=' + role) : ''}`);
}

export function buildConnectionUri(
  type: string,
  hostname?: string,
  port?: number,
  username?: string,
  password?: string,
  database?: string,
  project_id?: string,
  dataset?: string,
  account?: string,
  schema?: string,
  warehouse?: string,
  role?: string,
) {
  /*
   * account, schema, warehouse, role are only used for Snowflake connection
   */

  let connType = ''; // connection type + python driver
  const setPort = (port: number | undefined, defaultPort: number) => port ? port : defaultPort;
  let parameters = '';

  switch (type.toLowerCase()) {
    case 'bigquery':
      connType = 'bigquery';
      return connType + `://${project_id}${ dataset ? ('/' + dataset) : '' }`;
    case 'clickhouse':
      connType = 'clickhouse';
      port = setPort(port, 8123);
      break;
    case 'exa':
      connType = 'exa+pyodbc';
      port = setPort(port, 8563);
      parameters = '?INTTYPESINRESULTSIFPOSSIBLE=y&driver=EXAODBC';
      break;
    case 'firebird':
      connType = 'firebird+fdb';
      port = setPort(port, 3050);
      break;
    case 'kylin':
      connType = 'kylin'; // kylinpy
      port = setPort(port, 7070);
      break;
    case 'impala':
      connType = 'impala';
      port = setPort(port, 21050);
      break;
    case 'mariadb':
    case 'mysql':
      connType = 'mysql+mysqldb';
      port = setPort(port, 3306);
      break;
    case 'mssql':
      connType = 'mssql+pymssql';
      port = setPort(port, 135);
      break;
    case 'oracle':
      connType = 'oracle';
      port = setPort(port, 1521);
      break;
    case 'postgresql':
      connType = 'postgresql+psycopg2';
      port = setPort(port, 5432);
      break;
    case 'redshift':
      connType = 'redshift+psycopg2';
      port = setPort(port, 5439);
      break;
    case 'snowflake':
      return buildSnowflakeConnectionUri(
        username || "", password || "", database || "",
        account || "",
        schema || "",
        warehouse || "", role || ""
      );
  }

  return (
    connType + '://' +
    username + (password ? (':' + password) : '') + '@' +
    hostname + (port ? (':' + port) : '') + '/' + database + parameters
  );
}

export function parseSqlUri(uri: string | undefined, queryString?: boolean): IDatabaseUri | null {
  if (!uri) {
    return null;
  }

  return parseUrl(uri, queryString || false) as IDatabaseUri;
}

export function wrapEncryptedExtra(encryptedExtra: any) {
  /*
   * This is used for BigQuery connection
   */
  encryptedExtra = JSON.parse(encryptedExtra);

  if (encryptedExtra.hasOwnProperty('credentials_info')) {
    return JSON.stringify(encryptedExtra);
  } else {
    return JSON.stringify({
      credentials_info: encryptedExtra
    })
  }
}
