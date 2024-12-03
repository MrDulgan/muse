import { join, resolve } from 'path';
import { platform } from 'os';

export const createDatabasePath = (directory: string): string => {
  return resolve(join(directory, 'db.sqlite'));
};

const createDatabaseUrl = (directory: string): string => {
  let dbPath = createDatabasePath(directory);

  dbPath = encodeURI(dbPath);

  if (platform() === 'win32') {
    dbPath = dbPath.replace(/\\/g, '\\\\');
  }

  return `file:${dbPath}?socket_timeout=10&connection_limit=1`;
};

export default createDatabaseUrl;
