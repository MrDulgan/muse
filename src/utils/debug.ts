import createDebug from 'debug';

const debug = (namespace: string) => createDebug(`muse:${namespace}`);

export default debug;
