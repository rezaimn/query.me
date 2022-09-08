export function mapPathToPageName(path: string, title: string) {
  let pageName;
  switch (path) {
    case (path.match(/\/a\/u\/.*/) || {}).input:
      pageName = 'Admin - Users';
      break;
    case "/a/u":
      pageName = 'Admin - Users';
      break;
    case "/a/o":
      pageName = 'Admin - Organization';
      break;
    case "/d/d":
    case (path.match(/\/d\/d\/v\/.*/) || {}).input:
      pageName = 'Data - Database List';
      break;
    case "/d/d/connect":
      if (title === "Connect to a Database | Query.me") {
        pageName = 'Data - Connect';
      } else {
        let regexpDbName: RegExp = /Big Query|Microsoft SQL Server|MySQL|PostgreSQL|Redshift|Snowflake/;
        const dbType = title.match(regexpDbName);
        pageName = `Data - Connect - ${dbType}`;
      }
      break;
    case (path.match(/\/d\/d\/.*/) || {}).input:
      pageName = 'Data - Database';
      break;
    case "/d/s":
    case (path.match(/\/d\/s\/v\/.*/) || {}).input:
      pageName = 'Data - Schema List';
      break;
    case (path.match(/\/d\/s\/.*/) || {}).input:
      pageName = 'Data - Schema';
      break;
    case "/d/t":
    case (path.match(/\/d\/t\/v\/.*/) || {}).input:
      pageName = 'Data - Table List';
      break;
    case (path.match(/\/d\/t\/.*/) || {}).input:
      pageName = 'Data - Table';
      break;
    case "/n":
    case (path.match(/\/n\/v\/.*/) || {}).input:
      pageName = 'Notebook - List';
      break;
    case (path.match(/\/n\/.*/) || {}).input:
      pageName = 'Notebook - Page';
      break;
    case "/app":
      pageName = 'Home';
      break;
    case "/p":
      pageName = 'Profile';
      break;
  }
  return pageName;
}
